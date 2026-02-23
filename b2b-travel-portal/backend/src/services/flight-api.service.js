const axios = require('axios');
const CryptoJS = require('crypto-js');
const { v4: uuidv4 } = require('uuid');

/**
 * Flight API Service
 * Wraps the Client 2.0 Air API endpoints
 */
class FlightApiService {
    constructor() {
        this.baseUrl = process.env.FLIGHT_API_BASE_URL || 'http://domain/airlinehost/AirAPIService.svc/JSONService';
        this.tradeUrl = process.env.TRADE_API_BASE_URL || 'http://domain/tradehost/TradeAPIService.svc/JSONService';
        this.timeout = 30000; // 30 seconds
    }

    /**
     * Generate Auth Header for API requests
     */
    generateAuthHeader(agentCredentials) {
        return {
            UserId: agentCredentials.userId,
            Password: agentCredentials.passwordHash, // SHA1 hashed
            IP_Address: agentCredentials.ipAddress || '0.0.0.0',
            Request_Id: uuidv4().replace(/-/g, '').substring(0, 16),
            IMEI_Number: agentCredentials.imeiNumber || ''
        };
    }

    /**
     * Make API request with error handling
     */
    async makeRequest(endpoint, data, isTradeApi = false) {
        const baseUrl = isTradeApi ? this.tradeUrl : this.baseUrl;
        const url = `${baseUrl}/${endpoint}`;

        try {
            const response = await axios.post(url, data, {
                timeout: this.timeout,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = response.data;

            // Check for API errors
            if (result.Response_Header?.Error_Code !== '0000') {
                throw {
                    code: result.Response_Header?.Error_Code,
                    message: result.Response_Header?.Error_Desc,
                    details: result.Response_Header?.Error_InnerException
                };
            }

            return result;
        } catch (error) {
            if (error.code) {
                throw error; // Re-throw API errors
            }
            throw {
                code: 'NETWORK_ERROR',
                message: error.message,
                details: error.response?.data
            };
        }
    }

    /**
     * Get available sectors and dates (cache this 3-4x daily)
     */
    async getSectorAvailability(agentCredentials) {
        const data = {
            Auth_Header: this.generateAuthHeader(agentCredentials)
        };

        const result = await this.makeRequest('Air_SectorAvailabilityPI', data);
        
        return {
            sectors: result.SectorsPIs?.map(sector => ({
                origin: sector.Origin,
                destination: sector.Destination,
                availableDates: sector.AvailableDates?.split('|') || [],
                maxTravelDate: sector.MaxTravelDate
            })) || []
        };
    }

    /**
     * Search flights
     */
    async searchFlights(agentCredentials, searchParams) {
        const {
            origin,
            destination,
            travelDate,
            returnDate,
            adults = 1,
            children = 0,
            infants = 0,
            classOfTravel = 0, // 0=ECONOMY
            tripType = 0, // 0=ONE_WAY, 1=ROUNDTRIP
            airlineFilters = []
        } = searchParams;

        const tripInfo = [{
            Origin: origin,
            Destination: destination,
            TravelDate: this.formatDate(travelDate),
            Trip_Id: 0
        }];

        // Add return trip if roundtrip
        if (tripType === 1 && returnDate) {
            tripInfo.push({
                Origin: destination,
                Destination: origin,
                TravelDate: this.formatDate(returnDate),
                Trip_Id: 1
            });
        }

        const data = {
            Auth_Header: this.generateAuthHeader(agentCredentials),
            Travel_Type: 0, // 0=DOMESTIC
            Booking_Type: tripType,
            TripInfo: tripInfo,
            Adult_Count: String(adults),
            Child_Count: String(children),
            Infant_Count: String(infants),
            Class_Of_Travel: String(classOfTravel),
            InventoryType: 0,
            Source_Type: 0,
            SrCitizen_Search: searchParams.seniorCitizen || false,
            StudentFare_Search: searchParams.studentFare || false,
            DefenceFare_Search: searchParams.defenceFare || false,
            Filtered_Airline: airlineFilters.length > 0 
                ? airlineFilters.map(code => ({ Airline_Code: code }))
                : [{ Airline_Code: '' }]
        };

        const result = await this.makeRequest('Air_Search', data);

        return {
            searchKey: result.Search_Key,
            trips: result.TripDetails?.map(trip => ({
                tripId: trip.Trip_Id,
                flights: this.transformFlights(trip.Flights)
            })) || []
        };
    }

    /**
     * Reprice/Validate selected flight
     */
    async repriceFlights(agentCredentials, searchKey, selectedFlights) {
        const data = {
            Auth_Header: this.generateAuthHeader(agentCredentials),
            Search_Key: searchKey,
            AirRepriceRequestDetails: selectedFlights.map(flight => ({
                Flight_Id: flight.flightId,
                Fare_Id: flight.fareId
            }))
        };

        const result = await this.makeRequest('Air_Reprice', data);

        return {
            flights: result.AirRepriceResponses?.map(response => ({
                flight: this.transformFlight(response.Flight),
                frequentFlyerAccepted: response.Frequent_Flyer_Accepted,
                requiredPaxDetails: response.Required_PAX_Details,
                isFareChanged: response.Flight?.IsFareChange || false
            })) || []
        };
    }

    /**
     * Get SSR (ancillary services) for a flight
     */
    async getSSR(agentCredentials, searchKey, flightKey) {
        const data = {
            Auth_Header: this.generateAuthHeader(agentCredentials),
            Search_Key: searchKey,
            AirSSRRequestDetails: [{
                Flight_Key: flightKey
            }]
        };

        const result = await this.makeRequest('Air_GetSSR', data);

        return {
            ssrFlights: result.SSRFlightDetails?.map(flightDetail => ({
                ssrOptions: this.transformSSRDetails(flightDetail.SSRDetails)
            })) || []
        };
    }

    /**
     * Get Seat Map
     */
    async getSeatMap(agentCredentials, searchKey, flightKey) {
        const data = {
            Auth_Header: this.generateAuthHeader(agentCredentials),
            Search_Key: searchKey,
            AirSSRRequestDetails: [{
                Flight_Key: flightKey
            }]
        };

        const result = await this.makeRequest('Air_GetSeatMap', data);

        return {
            seatMaps: result.AirSeatMaps || []
        };
    }

    /**
     * Create temporary booking
     */
    async createTempBooking(agentCredentials, bookingData) {
        const {
            searchKey,
            flightKey,
            passengers,
            contact,
            gstDetails,
            ssrSelections = [],
            blockTicket = false
        } = bookingData;

        const data = {
            Auth_Header: this.generateAuthHeader(agentCredentials),
            Search_Key: searchKey,
            AirTempBookingRequestDetails: [{
                Flight_Key: flightKey,
                SSRDetails: ssrSelections.map(ssr => ({
                    Pax_Id: ssr.paxId,
                    SSR_Key: ssr.ssrKey
                }))
            }],
            PAXDetails: passengers.map((pax, index) => ({
                Pax_Id: index + 1,
                Pax_type: pax.type, // 0=ADT, 1=CHD, 2=INF
                Title: pax.title,
                First_Name: pax.firstName,
                Last_Name: pax.lastName,
                Gender: pax.gender,
                Age: String(pax.age || ''),
                DOB: pax.dob ? this.formatDate(pax.dob) : '',
                Passport_Number: pax.passportNumber || '',
                Passport_Expiry: pax.passportExpiry ? this.formatDate(pax.passportExpiry) : '',
                Passport_Issuing_Country: pax.passportCountry || '',
                PAN_Number: pax.panNumber || ''
            })),
            CustomerDetails: {
                Customer_Name: contact.name,
                Customer_Mobile: contact.mobile,
                Customer_Email: contact.email
            },
            GSTDetails: {
                GST: gstDetails?.enabled || false,
                GSTCompany_Name: gstDetails?.companyName || '',
                GSTIN: gstDetails?.gstin || '',
                GSTCompany_Address: gstDetails?.address || '',
                GSTCompany_Mobile: gstDetails?.mobile || '',
                GSTCompany_Email: gstDetails?.email || ''
            },
            BlockTicket: blockTicket
        };

        const result = await this.makeRequest('Air_TempBooking', data);

        return {
            bookingRefNo: result.Booking_RefNo,
            pnrDetails: result.AirlinePNRDetails?.map(pnr => ({
                flightId: pnr.Flight_Id,
                statusId: pnr.Status_Id,
                holdValidity: pnr.Hold_Validity,
                airlinePnrs: pnr.AirlinePNRs?.map(p => ({
                    airlineCode: p.Airline_Code,
                    airlinePnr: p.Airline_PNR,
                    recordLocator: p.Record_Locator
                }))
            })) || []
        };
    }

    /**
     * Issue ticket (after payment)
     */
    async issueTicket(agentCredentials, bookingRefNo, airlinePnr = '') {
        const data = {
            Auth_Header: this.generateAuthHeader(agentCredentials),
            Booking_RefNo: bookingRefNo,
            Airline_PNR: airlinePnr
        };

        const result = await this.makeRequest('Air_Ticketing', data);

        return {
            bookingRefNo: result.Booking_RefNo,
            pnrDetails: result.AirlinePNRDetails || []
        };
    }

    /**
     * Get booking details (reprint)
     */
    async getBookingDetails(agentCredentials, bookingRefNo, airlinePnr = '') {
        const data = {
            Auth_Header: this.generateAuthHeader(agentCredentials),
            Booking_RefNo: bookingRefNo,
            Airline_PNR: airlinePnr
        };

        const result = await this.makeRequest('Air_Reprint', data);

        return this.transformBookingDetails(result);
    }

    /**
     * Get booking history
     */
    async getBookingHistory(agentCredentials, filters = {}) {
        const data = {
            Auth_Header: this.generateAuthHeader(agentCredentials),
            Fromdate: filters.fromDate ? this.formatDate(filters.fromDate) : '',
            Todate: filters.toDate ? this.formatDate(filters.toDate) : '',
            Month: filters.month || '',
            Year: filters.year || '',
            Type: String(filters.type || 0) // 0=ALL, 1=LIVE, 2=CANCELLED, 3=BLOCKED
        };

        const result = await this.makeRequest('Air_History', data);

        return {
            bookings: result.TicketHistory?.map(booking => ({
                refNo: booking.Refno,
                customerName: booking.CustomerName,
                customerMobile: booking.CustomerMobile,
                passengerName: booking.PassengerName,
                bookingType: booking.BookingType,
                travelType: booking.TravelType,
                tripDetails: booking.TripDetails,
                requestDate: booking.ReqDate,
                grossAmount: booking.GrossAmount,
                airlinePnr: booking.AirlinePNR,
                invoiceNumber: booking.InvoiceNumber,
                trips: booking.TicketHistoryTrips
            })) || []
        };
    }

    /**
     * Cancel booking
     */
    async cancelBooking(agentCredentials, bookingRefNo, cancellationType = 0) {
        const data = {
            Auth_Header: this.generateAuthHeader(agentCredentials),
            Booking_RefNo: bookingRefNo,
            CancellationType: cancellationType
        };

        const result = await this.makeRequest('Air_Cancellation', data);
        return result;
    }

    /**
     * Release blocked PNR
     */
    async releasePnr(agentCredentials, bookingRefNo, airlinePnr = '') {
        const data = {
            Auth_Header: this.generateAuthHeader(agentCredentials),
            Booking_RefNo: bookingRefNo,
            Airline_PNR: airlinePnr
        };

        const result = await this.makeRequest('Air_ReleasePNR', data);
        return result;
    }

    /**
     * Get agent wallet balance
     */
    async getWalletBalance(agentCredentials) {
        const data = {
            Auth_Header: this.generateAuthHeader(agentCredentials)
        };

        const result = await this.makeRequest('GetBalance', data, true);

        return {
            creditBalance: result.CreditBalance,
            effectiveBalance: result.EffectiveBalance,
            lienBalance: result.LienBalance,
            odAmount: result.ODAmount
        };
    }

    /**
     * Add payment (debit wallet)
     */
    async addPayment(agentCredentials, bookingRefNo, transactionType = 0, clientRefNo = '') {
        const data = {
            Auth_Header: this.generateAuthHeader(agentCredentials),
            RefNo: bookingRefNo,
            ProductId: '1', // 1 = Airline
            TransactionType: transactionType, // 0=BOOKING, 1=SSR, 2=RESCHEDULE
            ClientRefNo: clientRefNo
        };

        const result = await this.makeRequest('AddPayment', data, true);

        return {
            amount: result.Amount,
            paymentId: result.PaymentID,
            commission: result.Commission,
            sgst: result.SGST,
            cgst: result.CGST,
            igst: result.IGST,
            tds: result.TDS
        };
    }

    // ==================== HELPER METHODS ====================

    /**
     * Format date to MM/DD/YYYY
     */
    formatDate(date) {
        const d = new Date(date);
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const year = d.getFullYear();
        return `${month}/${day}/${year}`;
    }

    /**
     * Transform flight data to normalized format
     */
    transformFlights(flights) {
        return flights?.map(flight => this.transformFlight(flight)) || [];
    }

    transformFlight(flight) {
        return {
            flightId: flight.Flight_Id,
            flightKey: flight.Flight_Key,
            origin: flight.Origin,
            destination: flight.Destination,
            travelDate: flight.TravelDate,
            airlineCode: flight.Airline_Code,
            isLcc: flight.IsLCC,
            blockTicketAllowed: flight.Block_Ticket_Allowed,
            gstEntryAllowed: flight.GST_Entry_Allowed,
            cached: flight.Cached,
            repriced: flight.Repriced,
            inventoryType: flight.InventoryType,
            segments: flight.Segments?.map(seg => ({
                segmentId: seg.Segment_Id,
                legIndex: seg.Leg_Index,
                origin: seg.Origin,
                originCity: seg.Origin_City,
                originTerminal: seg.Origin_Terminal,
                destination: seg.Destination,
                destinationCity: seg.Destination_City,
                destinationTerminal: seg.Destination_Terminal,
                airlineCode: seg.Airline_Code,
                airlineName: seg.Airline_Name,
                flightNumber: seg.Flight_Number,
                aircraftType: seg.Aircraft_Type,
                departureDateTime: seg.Departure_DateTime,
                arrivalDateTime: seg.Arrival_DateTime,
                duration: seg.Duration,
                stopOver: seg.Stop_Over,
                returnFlight: seg.Return_Flight
            })) || [],
            fares: flight.Fares?.map(fare => ({
                fareId: fare.Fare_Id,
                fareKey: fare.Fare_Key,
                refundable: fare.Refundable,
                seatsAvailable: fare.Seats_Available,
                lastFewSeats: fare.LastFewSeats,
                foodOnboard: fare.Food_onboard,
                gstMandatory: fare.GSTMandatory,
                productClass: fare.ProductClass,
                fareType: fare.FareType,
                warning: fare.Warning,
                promptMessage: fare.PromptMessage,
                fareDetails: fare.FareDetails?.map(fd => ({
                    paxType: fd.PAX_Type,
                    basicAmount: fd.Basic_Amount,
                    yqAmount: fd.YQ_Amount,
                    airportTaxAmount: fd.AirportTax_Amount,
                    serviceFeeAmount: fd.Service_Fee_Amount,
                    markupAmount: fd.Trade_Markup_Amount,
                    promoDiscount: fd.Promo_Discount,
                    gst: fd.GST,
                    tds: fd.TDS,
                    grossCommission: fd.Gross_Commission,
                    netCommission: fd.Net_Commission,
                    totalAmount: fd.Total_Amount,
                    currencyCode: fd.Currency_Code,
                    freeBaggage: {
                        checkIn: fd.Free_Baggage?.Check_In_Baggage,
                        handBaggage: fd.Free_Baggage?.Hand_Baggage
                    },
                    fareClasses: fd.FareClasses,
                    airportTaxes: fd.AirportTaxes,
                    rescheduleCharges: fd.RescheduleCharges
                })) || []
            })) || []
        };
    }

    transformSSRDetails(ssrDetails) {
        return ssrDetails?.map(ssr => ({
            ssrType: ssr.SSR_Type,
            ssrTypeName: ssr.SSR_TypeName,
            ssrTypeDesc: ssr.SSR_TypeDesc,
            ssrKey: ssr.SSR_Key,
            ssrCode: ssr.SSR_Code,
            segmentWise: ssr.Segment_Wise,
            legIndex: ssr.Leg_Index,
            segmentId: ssr.Segment_Id,
            flightId: ssr.Flight_ID,
            totalAmount: ssr.Total_Amount,
            currencyCode: ssr.Currency_Code,
            applicablePaxTypes: ssr.ApplicablePaxTypes,
            ssrStatus: ssr.SSR_Status
        })) || [];
    }

    transformBookingDetails(data) {
        return {
            bookingRefNo: data.Booking_RefNo,
            bookingDateTime: data.BookingDateTime,
            bookingType: data.BookingType,
            travelType: data.TravelType,
            adultCount: data.AdultCount,
            childCount: data.ChildCount,
            infantCount: data.InfantCount,
            classOfTravel: data.ClassofTravel,
            invoiceNumber: data.InvoiceNumber,
            paxEmail: data.PAXEmailId,
            paxMobile: data.PAXMobile,
            gst: data.GST,
            gstin: data.GSTIN,
            remark: data.Remark,
            retailerDetail: data.RetailerDetail,
            customerDetail: data.CustomerDetail,
            companyDetail: data.CompanyDetail,
            pnrDetails: data.AirPNRDetails,
            paymentDetails: data.BookingPaymentDetail
        };
    }
}

module.exports = new FlightApiService();
