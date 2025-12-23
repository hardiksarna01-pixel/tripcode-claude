/**
 * Indian Airports Data
 */
exports.airportsData = [
    { code: 'DEL', city: 'New Delhi', name: 'Indira Gandhi International Airport', country: 'IN' },
    { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj International Airport', country: 'IN' },
    { code: 'BLR', city: 'Bangalore', name: 'Kempegowda International Airport', country: 'IN' },
    { code: 'MAA', city: 'Chennai', name: 'Chennai International Airport', country: 'IN' },
    { code: 'CCU', city: 'Kolkata', name: 'Netaji Subhas Chandra Bose International Airport', country: 'IN' },
    { code: 'HYD', city: 'Hyderabad', name: 'Rajiv Gandhi International Airport', country: 'IN' },
    { code: 'COK', city: 'Kochi', name: 'Cochin International Airport', country: 'IN' },
    { code: 'AMD', city: 'Ahmedabad', name: 'Sardar Vallabhbhai Patel International Airport', country: 'IN' },
    { code: 'PNQ', city: 'Pune', name: 'Pune Airport', country: 'IN' },
    { code: 'GOI', city: 'Goa', name: 'Goa International Airport', country: 'IN' },
    { code: 'JAI', city: 'Jaipur', name: 'Jaipur International Airport', country: 'IN' },
    { code: 'LKO', city: 'Lucknow', name: 'Chaudhary Charan Singh International Airport', country: 'IN' },
    { code: 'IXC', city: 'Chandigarh', name: 'Chandigarh International Airport', country: 'IN' },
    { code: 'GAU', city: 'Guwahati', name: 'Lokpriya Gopinath Bordoloi International Airport', country: 'IN' },
    { code: 'TRV', city: 'Thiruvananthapuram', name: 'Trivandrum International Airport', country: 'IN' },
    { code: 'VTZ', city: 'Visakhapatnam', name: 'Visakhapatnam Airport', country: 'IN' },
    { code: 'BBI', city: 'Bhubaneswar', name: 'Biju Patnaik International Airport', country: 'IN' },
    { code: 'IXB', city: 'Bagdogra', name: 'Bagdogra Airport', country: 'IN' },
    { code: 'IXR', city: 'Ranchi', name: 'Birsa Munda Airport', country: 'IN' },
    { code: 'PAT', city: 'Patna', name: 'Jay Prakash Narayan Airport', country: 'IN' },
    { code: 'NAG', city: 'Nagpur', name: 'Dr. Babasaheb Ambedkar International Airport', country: 'IN' },
    { code: 'IDR', city: 'Indore', name: 'Devi Ahilyabai Holkar Airport', country: 'IN' },
    { code: 'VNS', city: 'Varanasi', name: 'Lal Bahadur Shastri International Airport', country: 'IN' },
    { code: 'SXR', city: 'Srinagar', name: 'Sheikh ul-Alam International Airport', country: 'IN' },
    { code: 'IXU', city: 'Aurangabad', name: 'Aurangabad Airport', country: 'IN' },
    { code: 'RPR', city: 'Raipur', name: 'Swami Vivekananda Airport', country: 'IN' },
    { code: 'UDR', city: 'Udaipur', name: 'Maharana Pratap Airport', country: 'IN' },
    { code: 'ATQ', city: 'Amritsar', name: 'Sri Guru Ram Dass Jee International Airport', country: 'IN' },
    { code: 'IXM', city: 'Madurai', name: 'Madurai Airport', country: 'IN' },
    { code: 'CJB', city: 'Coimbatore', name: 'Coimbatore International Airport', country: 'IN' }
];

/**
 * Indian Airlines Data
 */
exports.airlinesData = [
    { code: '6E', name: 'IndiGo', logo: 'indigo.png', isLcc: true },
    { code: 'SG', name: 'SpiceJet', logo: 'spicejet.png', isLcc: true },
    { code: 'AI', name: 'Air India', logo: 'airindia.png', isLcc: false },
    { code: 'UK', name: 'Vistara', logo: 'vistara.png', isLcc: false },
    { code: 'G8', name: 'Go First', logo: 'gofirst.png', isLcc: true },
    { code: 'I5', name: 'AirAsia India', logo: 'airasia.png', isLcc: true },
    { code: 'QP', name: 'Akasa Air', logo: 'akasa.png', isLcc: true },
    { code: 'IX', name: 'Air India Express', logo: 'aiexpress.png', isLcc: true },
    { code: '9I', name: 'Alliance Air', logo: 'alliance.png', isLcc: false },
    { code: 'S5', name: 'Star Air', logo: 'starair.png', isLcc: true }
];

/**
 * Class of Travel
 */
exports.classOfTravel = [
    { code: 0, name: 'Economy', short: 'Y' },
    { code: 1, name: 'Business', short: 'C' },
    { code: 2, name: 'First', short: 'F' },
    { code: 3, name: 'Premium Economy', short: 'W' }
];

/**
 * Passenger Types
 */
exports.passengerTypes = [
    { code: 0, name: 'Adult', short: 'ADT', ageMin: 12, ageMax: 999 },
    { code: 1, name: 'Child', short: 'CHD', ageMin: 2, ageMax: 11 },
    { code: 2, name: 'Infant', short: 'INF', ageMin: 0, ageMax: 1 }
];

/**
 * SSR Types
 */
exports.ssrTypes = [
    { code: 0, name: 'BAGGAGE' },
    { code: 1, name: 'MEALS' },
    { code: 2, name: 'COMPLIMENTARY_MEALS' },
    { code: 3, name: 'SEAT' },
    { code: 4, name: 'SPORTS' },
    { code: 5, name: 'BAGOUTFIRST' },
    { code: 6, name: 'LOUNGE' },
    { code: 7, name: 'CELEBRATION' },
    { code: 8, name: 'CARRYMORE' },
    { code: 9, name: 'FASTFORWARD' },
    { code: 10, name: 'WHEELCHAIR' },
    { code: 11, name: 'FREQUENTFLYER' },
    { code: 15, name: 'OTHERS' }
];

/**
 * Booking Status
 */
exports.bookingStatus = [
    { code: 0, name: 'Payment Pending' },
    { code: 1, name: 'Payment Failed' },
    { code: 2, name: 'Payment Received' },
    { code: 3, name: 'On Progress' },
    { code: 4, name: 'Confirmed' },
    { code: 5, name: 'Failed' },
    { code: 6, name: 'Cancelled' },
    { code: 7, name: 'Blocked' },
    { code: 8, name: 'Rejected' }
];
