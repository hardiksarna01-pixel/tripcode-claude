import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Grid, Card, CardContent, Tabs, Tab, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Chip, Button, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem,
    FormControl, InputLabel, Alert, LinearProgress, Tooltip, Divider, Badge,
    List, ListItem, ListItemText, ListItemIcon, Avatar, InputAdornment, Collapse
} from '@mui/material';
import {
    Warning as WarningIcon,
    Error as ErrorIcon,
    CheckCircle as CheckIcon,
    Refresh as RefreshIcon,
    Edit as EditIcon,
    SwapHoriz as SwapIcon,
    Cancel as CancelIcon,
    AccountBalance as BalanceIcon,
    Flight as FlightIcon,
    Hotel as HotelIcon,
    DirectionsBus as BusIcon,
    Person as PersonIcon,
    Schedule as ScheduleIcon,
    AttachMoney as MoneyIcon,
    TrendingUp as TrendingIcon,
    Replay as RetryIcon,
    History as HistoryIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Business as BusinessIcon,
    LocalShipping as SupplierIcon
} from '@mui/icons-material';
import adminService from '../../services/adminService';

const PendingBookings = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [overview, setOverview] = useState(null);
    const [pendingBookings, setPendingBookings] = useState([]);
    const [supplierBalances, setSupplierBalances] = useState([]);
    const [processedBookings, setProcessedBookings] = useState([]);

    // Dialogs
    const [pnrDialog, setPnrDialog] = useState({ open: false, booking: null });
    const [rebookDialog, setRebookDialog] = useState({ open: false, booking: null });
    const [cancelDialog, setCancelDialog] = useState({ open: false, booking: null });
    const [topUpDialog, setTopUpDialog] = useState({ open: false, supplier: null });
    const [detailsExpanded, setDetailsExpanded] = useState({});

    // Form states
    const [pnrForm, setPnrForm] = useState({ pnr: '', remarks: '' });
    const [rebookForm, setRebookForm] = useState({ supplierId: '', notes: '' });
    const [cancelForm, setCancelForm] = useState({ reason: '', refundToWallet: true });
    const [topUpForm, setTopUpForm] = useState({ amount: 0, type: 'credit', reference: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Mock data for now - in production, fetch from API
            setOverview({
                totalPending: 5,
                byStatus: { pending_supplier: 4, manual_update_required: 1 },
                byType: { flight: 3, hotel: 1, bus: 1 },
                criticalSuppliers: [
                    { id: 'mystifly', balance: 8500, threshold: 25000, status: 'critical' },
                    { id: 'sabre', balance: 15000, threshold: 50000, status: 'low' }
                ],
                totalShortfall: 34000,
                currency: 'INR'
            });

            setPendingBookings([
                {
                    id: 'PB001',
                    bookingRef: 'BK-2024-78542',
                    pnr: null,
                    type: 'flight',
                    status: 'pending_supplier',
                    reason: 'Low supplier balance',
                    originalSupplier: 'mystifly',
                    supplierStatus: 'critical',
                    requiredAmount: 12500,
                    availableBalance: 8500,
                    shortfall: 4000,
                    customer: { name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '+91-9876543210' },
                    tripDetails: {
                        from: 'DEL', to: 'BOM', date: '2024-01-20',
                        airline: 'Air India', flightNo: 'AI-101', passengers: 2, class: 'Economy'
                    },
                    amount: 12500,
                    agentId: 'AGT-001',
                    agentName: 'Sunrise Travels',
                    createdAt: '2024-01-15T10:30:00Z',
                    alternativeSuppliers: [
                        { id: 'amadeus', name: 'Amadeus', price: 12800, available: true },
                        { id: 'tripjack', name: 'TripJack', price: 12400, available: true }
                    ]
                },
                {
                    id: 'PB002',
                    bookingRef: 'BK-2024-78543',
                    pnr: null,
                    type: 'flight',
                    status: 'pending_supplier',
                    reason: 'Low supplier balance',
                    originalSupplier: 'sabre',
                    supplierStatus: 'low',
                    requiredAmount: 45000,
                    availableBalance: 15000,
                    shortfall: 30000,
                    customer: { name: 'Priya Sharma', email: 'priya@example.com', phone: '+91-8765432109' },
                    tripDetails: {
                        from: 'BLR', to: 'DXB', date: '2024-01-22',
                        airline: 'Emirates', flightNo: 'EK-501', passengers: 3, class: 'Business'
                    },
                    amount: 45000,
                    agentId: 'AGT-002',
                    agentName: 'Global Tours',
                    createdAt: '2024-01-15T11:45:00Z',
                    alternativeSuppliers: [
                        { id: 'amadeus', name: 'Amadeus', price: 46200, available: true },
                        { id: 'galileo', name: 'Galileo', price: 45800, available: true }
                    ]
                },
                {
                    id: 'PB003',
                    bookingRef: 'BK-2024-78544',
                    pnr: null,
                    type: 'hotel',
                    status: 'pending_supplier',
                    reason: 'Low supplier balance',
                    originalSupplier: 'hotelbeds',
                    supplierStatus: 'warning',
                    requiredAmount: 28000,
                    availableBalance: 45000,
                    shortfall: 0,
                    customer: { name: 'Amit Patel', email: 'amit@example.com', phone: '+91-7654321098' },
                    tripDetails: {
                        hotel: 'Taj Mahal Palace', city: 'Mumbai',
                        checkIn: '2024-01-25', checkOut: '2024-01-28', rooms: 2, guests: 4
                    },
                    amount: 28000,
                    agentId: 'AGT-003',
                    agentName: 'Elite Holidays',
                    createdAt: '2024-01-15T14:20:00Z',
                    alternativeSuppliers: [
                        { id: 'booking_com', name: 'Booking.com', price: 29500, available: true }
                    ]
                },
                {
                    id: 'PB004',
                    bookingRef: 'BK-2024-78545',
                    pnr: null,
                    type: 'bus',
                    status: 'pending_supplier',
                    reason: 'Low supplier balance',
                    originalSupplier: 'abhibus',
                    supplierStatus: 'low',
                    requiredAmount: 3500,
                    availableBalance: 12000,
                    shortfall: 0,
                    customer: { name: 'Sunita Devi', email: 'sunita@example.com', phone: '+91-6543210987' },
                    tripDetails: {
                        from: 'Hyderabad', to: 'Chennai', date: '2024-01-18',
                        operator: 'APSRTC', busType: 'AC Sleeper', seats: 2
                    },
                    amount: 3500,
                    agentId: 'AGT-001',
                    agentName: 'Sunrise Travels',
                    createdAt: '2024-01-15T16:00:00Z',
                    alternativeSuppliers: [
                        { id: 'redbus', name: 'RedBus', price: 3600, available: true }
                    ]
                },
                {
                    id: 'PB005',
                    bookingRef: 'BK-2024-78546',
                    pnr: 'ABC123',
                    type: 'flight',
                    status: 'manual_update_required',
                    reason: 'PNR needs manual verification',
                    originalSupplier: 'amadeus',
                    supplierStatus: 'healthy',
                    requiredAmount: 18500,
                    availableBalance: 250000,
                    shortfall: 0,
                    customer: { name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91-5432109876' },
                    tripDetails: {
                        from: 'CCU', to: 'DEL', date: '2024-01-21',
                        airline: 'IndiGo', flightNo: '6E-215', passengers: 1, class: 'Economy'
                    },
                    amount: 18500,
                    agentId: 'AGT-004',
                    agentName: 'Quick Travel',
                    createdAt: '2024-01-15T09:15:00Z',
                    alternativeSuppliers: []
                }
            ]);

            setSupplierBalances([
                { id: 'amadeus', name: 'Amadeus', balance: 250000, threshold: 50000, status: 'healthy', pendingBookings: 0 },
                { id: 'sabre', name: 'Sabre', balance: 15000, threshold: 50000, status: 'low', pendingBookings: 1 },
                { id: 'galileo', name: 'Galileo', balance: 180000, threshold: 50000, status: 'healthy', pendingBookings: 0 },
                { id: 'mystifly', name: 'Mystifly', balance: 8500, threshold: 25000, status: 'critical', pendingBookings: 1 },
                { id: 'tripjack', name: 'TripJack', balance: 320000, threshold: 50000, status: 'healthy', pendingBookings: 0 },
                { id: 'hotelbeds', name: 'Hotelbeds', balance: 45000, threshold: 30000, status: 'warning', pendingBookings: 1 },
                { id: 'booking_com', name: 'Booking.com', balance: 125000, threshold: 40000, status: 'healthy', pendingBookings: 0 },
                { id: 'redbus', name: 'RedBus', balance: 75000, threshold: 20000, status: 'healthy', pendingBookings: 0 },
                { id: 'abhibus', name: 'AbhiBus', balance: 12000, threshold: 15000, status: 'low', pendingBookings: 1 }
            ]);

            setProcessedBookings([
                {
                    id: 'PB000',
                    bookingRef: 'BK-2024-78540',
                    pnr: 'XYZ789',
                    type: 'flight',
                    status: 'rebooked',
                    originalSupplier: 'mystifly',
                    newSupplier: 'tripjack',
                    processedBy: 'admin@flyshop.com',
                    processedAt: '2024-01-14T15:30:00Z',
                    notes: 'Rebooked due to low Mystifly balance'
                }
            ]);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'flight': return <FlightIcon />;
            case 'hotel': return <HotelIcon />;
            case 'bus': return <BusIcon />;
            default: return <FlightIcon />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'healthy': return 'success';
            case 'warning': return 'warning';
            case 'low': return 'warning';
            case 'critical': return 'error';
            case 'pending_supplier': return 'warning';
            case 'manual_update_required': return 'info';
            case 'rebooked': return 'success';
            case 'confirmed': return 'success';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    };

    const handleUpdatePNR = async () => {
        // In production, call API
        console.log('Updating PNR:', pnrForm);
        setPnrDialog({ open: false, booking: null });
        setPnrForm({ pnr: '', remarks: '' });
        fetchData();
    };

    const handleRebook = async () => {
        // In production, call API
        console.log('Rebooking:', rebookForm);
        setRebookDialog({ open: false, booking: null });
        setRebookForm({ supplierId: '', notes: '' });
        fetchData();
    };

    const handleCancel = async () => {
        // In production, call API
        console.log('Cancelling:', cancelForm);
        setCancelDialog({ open: false, booking: null });
        setCancelForm({ reason: '', refundToWallet: true });
        fetchData();
    };

    const handleTopUp = async () => {
        // In production, call API
        console.log('Top up:', topUpForm);
        setTopUpDialog({ open: false, supplier: null });
        setTopUpForm({ amount: 0, type: 'credit', reference: '' });
        fetchData();
    };

    const handleRetry = async (booking) => {
        // In production, call API to retry booking
        console.log('Retrying booking:', booking.id);
        alert('Retry initiated for booking: ' + booking.bookingRef);
        fetchData();
    };

    const toggleDetails = (id) => {
        setDetailsExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Overview Tab
    const OverviewTab = () => (
        <Grid container spacing={3}>
            {/* Summary Cards */}
            <Grid item xs={12} md={3}>
                <Card sx={{ bgcolor: '#fff3e0' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="h4" fontWeight="bold" color="warning.dark">
                                    {overview?.totalPending || 0}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Pending Bookings
                                </Typography>
                            </Box>
                            <WarningIcon sx={{ fontSize: 48, color: 'warning.main', opacity: 0.5 }} />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={3}>
                <Card sx={{ bgcolor: '#ffebee' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="h4" fontWeight="bold" color="error.dark">
                                    {formatCurrency(overview?.totalShortfall || 0)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Total Shortfall
                                </Typography>
                            </Box>
                            <MoneyIcon sx={{ fontSize: 48, color: 'error.main', opacity: 0.5 }} />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={3}>
                <Card sx={{ bgcolor: '#e3f2fd' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="h4" fontWeight="bold" color="info.dark">
                                    {overview?.byStatus?.manual_update_required || 0}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Manual PNR Updates
                                </Typography>
                            </Box>
                            <EditIcon sx={{ fontSize: 48, color: 'info.main', opacity: 0.5 }} />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={3}>
                <Card sx={{ bgcolor: '#fce4ec' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="h4" fontWeight="bold" color="error.dark">
                                    {overview?.criticalSuppliers?.length || 0}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Critical Suppliers
                                </Typography>
                            </Box>
                            <ErrorIcon sx={{ fontSize: 48, color: 'error.main', opacity: 0.5 }} />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            {/* Critical Suppliers Alert */}
            {overview?.criticalSuppliers?.length > 0 && (
                <Grid item xs={12}>
                    <Alert severity="error" icon={<WarningIcon />}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            Critical Supplier Balance Alert
                        </Typography>
                        <Typography variant="body2">
                            {overview.criticalSuppliers.map(s =>
                                `${s.id.charAt(0).toUpperCase() + s.id.slice(1)}: ${formatCurrency(s.balance)} (Threshold: ${formatCurrency(s.threshold)})`
                            ).join(' | ')}
                        </Typography>
                    </Alert>
                </Grid>
            )}

            {/* Pending by Type */}
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>Pending by Product Type</Typography>
                    <List>
                        <ListItem>
                            <ListItemIcon><FlightIcon color="primary" /></ListItemIcon>
                            <ListItemText primary="Flights" secondary={`${overview?.byType?.flight || 0} pending`} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><HotelIcon color="secondary" /></ListItemIcon>
                            <ListItemText primary="Hotels" secondary={`${overview?.byType?.hotel || 0} pending`} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><BusIcon color="success" /></ListItemIcon>
                            <ListItemText primary="Bus" secondary={`${overview?.byType?.bus || 0} pending`} />
                        </ListItem>
                    </List>
                </Paper>
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>Quick Actions</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<RetryIcon />}
                            onClick={() => alert('Bulk retry initiated for eligible bookings')}
                        >
                            Bulk Retry Eligible Bookings
                        </Button>
                        <Button
                            variant="outlined"
                            color="warning"
                            startIcon={<BalanceIcon />}
                            onClick={() => setActiveTab(2)}
                        >
                            Top-Up Supplier Balances
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<HistoryIcon />}
                            onClick={() => setActiveTab(3)}
                        >
                            View Processed History
                        </Button>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );

    // Pending Bookings Tab
    const PendingBookingsTab = () => (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Pending Bookings ({pendingBookings.length})</Typography>
                <Button startIcon={<RefreshIcon />} onClick={fetchData}>Refresh</Button>
            </Box>

            {pendingBookings.map((booking) => (
                <Card key={booking.id} sx={{ mb: 2, border: booking.shortfall > 0 ? '2px solid #f44336' : '1px solid #e0e0e0' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: booking.type === 'flight' ? 'primary.main' : booking.type === 'hotel' ? 'secondary.main' : 'success.main' }}>
                                    {getTypeIcon(booking.type)}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6">{booking.bookingRef}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {booking.customer.name} | {booking.agentName}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                                <Chip
                                    label={booking.status.replace('_', ' ').toUpperCase()}
                                    color={getStatusColor(booking.status)}
                                    size="small"
                                />
                                <Typography variant="h6" sx={{ mt: 1 }}>{formatCurrency(booking.amount)}</Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <Typography variant="subtitle2" color="text.secondary">Trip Details</Typography>
                                {booking.type === 'flight' && (
                                    <Typography>
                                        {booking.tripDetails.from} → {booking.tripDetails.to}<br />
                                        {booking.tripDetails.airline} {booking.tripDetails.flightNo}<br />
                                        {booking.tripDetails.date} | {booking.tripDetails.passengers} Pax | {booking.tripDetails.class}
                                    </Typography>
                                )}
                                {booking.type === 'hotel' && (
                                    <Typography>
                                        {booking.tripDetails.hotel}<br />
                                        {booking.tripDetails.city}<br />
                                        {booking.tripDetails.checkIn} to {booking.tripDetails.checkOut}<br />
                                        {booking.tripDetails.rooms} Rooms | {booking.tripDetails.guests} Guests
                                    </Typography>
                                )}
                                {booking.type === 'bus' && (
                                    <Typography>
                                        {booking.tripDetails.from} → {booking.tripDetails.to}<br />
                                        {booking.tripDetails.operator}<br />
                                        {booking.tripDetails.date} | {booking.tripDetails.busType}<br />
                                        {booking.tripDetails.seats} Seats
                                    </Typography>
                                )}
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Typography variant="subtitle2" color="text.secondary">Supplier Status</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                    <SupplierIcon />
                                    <Typography fontWeight="bold">
                                        {booking.originalSupplier.charAt(0).toUpperCase() + booking.originalSupplier.slice(1)}
                                    </Typography>
                                    <Chip label={booking.supplierStatus} color={getStatusColor(booking.supplierStatus)} size="small" />
                                </Box>
                                {booking.shortfall > 0 && (
                                    <Alert severity="error" sx={{ mt: 1 }}>
                                        <Typography variant="body2">
                                            Required: {formatCurrency(booking.requiredAmount)}<br />
                                            Available: {formatCurrency(booking.availableBalance)}<br />
                                            <strong>Shortfall: {formatCurrency(booking.shortfall)}</strong>
                                        </Typography>
                                    </Alert>
                                )}
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Typography variant="subtitle2" color="text.secondary">PNR</Typography>
                                <Typography variant="h5" sx={{ mt: 1 }}>
                                    {booking.pnr || <Chip label="Not Generated" color="warning" />}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Created: {new Date(booking.createdAt).toLocaleString()}
                                </Typography>
                            </Grid>
                        </Grid>

                        {/* Alternative Suppliers */}
                        {booking.alternativeSuppliers?.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Button
                                    size="small"
                                    onClick={() => toggleDetails(booking.id)}
                                    endIcon={detailsExpanded[booking.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                >
                                    Alternative Suppliers ({booking.alternativeSuppliers.length})
                                </Button>
                                <Collapse in={detailsExpanded[booking.id]}>
                                    <TableContainer sx={{ mt: 1 }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Supplier</TableCell>
                                                    <TableCell>Price</TableCell>
                                                    <TableCell>Availability</TableCell>
                                                    <TableCell>Price Diff</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {booking.alternativeSuppliers.map((alt) => (
                                                    <TableRow key={alt.id}>
                                                        <TableCell>{alt.name}</TableCell>
                                                        <TableCell>{formatCurrency(alt.price)}</TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={alt.available ? 'Available' : 'Unavailable'}
                                                                color={alt.available ? 'success' : 'error'}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography color={alt.price > booking.amount ? 'error' : 'success'}>
                                                                {alt.price > booking.amount ? '+' : ''}{formatCurrency(alt.price - booking.amount)}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Collapse>
                            </Box>
                        )}

                        {/* Actions */}
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<EditIcon />}
                                onClick={() => {
                                    setPnrForm({ pnr: booking.pnr || '', remarks: '' });
                                    setPnrDialog({ open: true, booking });
                                }}
                            >
                                Update PNR
                            </Button>
                            {booking.alternativeSuppliers?.length > 0 && (
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="small"
                                    startIcon={<SwapIcon />}
                                    onClick={() => {
                                        setRebookForm({ supplierId: '', notes: '' });
                                        setRebookDialog({ open: true, booking });
                                    }}
                                >
                                    Rebook with Other Supplier
                                </Button>
                            )}
                            {booking.shortfall === 0 && (
                                <Button
                                    variant="outlined"
                                    color="success"
                                    size="small"
                                    startIcon={<RetryIcon />}
                                    onClick={() => handleRetry(booking)}
                                >
                                    Retry Booking
                                </Button>
                            )}
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                startIcon={<CancelIcon />}
                                onClick={() => {
                                    setCancelForm({ reason: '', refundToWallet: true });
                                    setCancelDialog({ open: true, booking });
                                }}
                            >
                                Cancel Booking
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );

    // Supplier Balances Tab
    const SupplierBalancesTab = () => (
        <Box>
            <Typography variant="h6" gutterBottom>Supplier Balances</Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
                Monitor supplier credit balances. Top-up suppliers with low balance to process pending bookings.
            </Alert>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.100' }}>
                            <TableCell>Supplier</TableCell>
                            <TableCell align="right">Current Balance</TableCell>
                            <TableCell align="right">Threshold</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="center">Pending Bookings</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {supplierBalances.map((supplier) => (
                            <TableRow key={supplier.id} sx={{ bgcolor: supplier.status === 'critical' ? '#ffebee' : supplier.status === 'low' ? '#fff8e1' : 'inherit' }}>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 12 }}>
                                            {supplier.name.substring(0, 2).toUpperCase()}
                                        </Avatar>
                                        <Typography fontWeight="medium">{supplier.name}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography fontWeight="bold" color={supplier.status === 'critical' || supplier.status === 'low' ? 'error' : 'inherit'}>
                                        {formatCurrency(supplier.balance)}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">{formatCurrency(supplier.threshold)}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                                        color={getStatusColor(supplier.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Badge badgeContent={supplier.pendingBookings} color="warning">
                                        <ScheduleIcon />
                                    </Badge>
                                </TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<TrendingIcon />}
                                        onClick={() => {
                                            setTopUpForm({ amount: 0, type: 'credit', reference: '' });
                                            setTopUpDialog({ open: true, supplier });
                                        }}
                                    >
                                        Top-Up
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Balance Summary */}
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h6" gutterBottom>Balance Summary</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                            <Typography variant="h5" color="success.dark">
                                {formatCurrency(supplierBalances.reduce((sum, s) => sum + s.balance, 0))}
                            </Typography>
                            <Typography variant="body2">Total Balance Across All Suppliers</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
                            <Typography variant="h5" color="warning.dark">
                                {supplierBalances.filter(s => s.status === 'low' || s.status === 'warning').length}
                            </Typography>
                            <Typography variant="body2">Suppliers with Low Balance</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'error.light', borderRadius: 2 }}>
                            <Typography variant="h5" color="error.dark">
                                {supplierBalances.filter(s => s.status === 'critical').length}
                            </Typography>
                            <Typography variant="body2">Critical Suppliers</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );

    // Processed History Tab
    const ProcessedHistoryTab = () => (
        <Box>
            <Typography variant="h6" gutterBottom>Processed Bookings History</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.100' }}>
                            <TableCell>Booking Ref</TableCell>
                            <TableCell>PNR</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Original Supplier</TableCell>
                            <TableCell>New Supplier</TableCell>
                            <TableCell>Processed By</TableCell>
                            <TableCell>Processed At</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {processedBookings.map((booking) => (
                            <TableRow key={booking.id}>
                                <TableCell>{booking.bookingRef}</TableCell>
                                <TableCell>
                                    <Chip label={booking.pnr} size="small" color="primary" />
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {getTypeIcon(booking.type)}
                                        {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip label={booking.status} color={getStatusColor(booking.status)} size="small" />
                                </TableCell>
                                <TableCell>{booking.originalSupplier}</TableCell>
                                <TableCell>{booking.newSupplier || '-'}</TableCell>
                                <TableCell>{booking.processedBy}</TableCell>
                                <TableCell>{new Date(booking.processedAt).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                        {processedBookings.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <Typography color="text.secondary" sx={{ py: 4 }}>
                                        No processed bookings yet
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                <LinearProgress />
                <Typography sx={{ mt: 2 }}>Loading pending bookings...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Pending Bookings & Manual PNR Management
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
                Manage bookings pending due to low supplier balance. Update PNR manually or rebook with alternative suppliers.
            </Typography>

            <Paper sx={{ mt: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={(_, v) => setActiveTab(v)}
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab
                        label={
                            <Badge badgeContent={overview?.totalPending || 0} color="warning">
                                <Box sx={{ pr: 2 }}>Overview</Box>
                            </Badge>
                        }
                    />
                    <Tab
                        label={
                            <Badge badgeContent={pendingBookings.length} color="error">
                                <Box sx={{ pr: 2 }}>Pending Bookings</Box>
                            </Badge>
                        }
                    />
                    <Tab label="Supplier Balances" />
                    <Tab label="Processed History" />
                </Tabs>

                <Box sx={{ p: 3 }}>
                    {activeTab === 0 && <OverviewTab />}
                    {activeTab === 1 && <PendingBookingsTab />}
                    {activeTab === 2 && <SupplierBalancesTab />}
                    {activeTab === 3 && <ProcessedHistoryTab />}
                </Box>
            </Paper>

            {/* Update PNR Dialog */}
            <Dialog open={pnrDialog.open} onClose={() => setPnrDialog({ open: false, booking: null })} maxWidth="sm" fullWidth>
                <DialogTitle>Update PNR</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Booking: {pnrDialog.booking?.bookingRef}
                    </Typography>
                    <TextField
                        fullWidth
                        label="PNR"
                        value={pnrForm.pnr}
                        onChange={(e) => setPnrForm({ ...pnrForm, pnr: e.target.value.toUpperCase() })}
                        sx={{ mt: 2 }}
                        placeholder="Enter 6-character PNR"
                    />
                    <TextField
                        fullWidth
                        label="Remarks"
                        value={pnrForm.remarks}
                        onChange={(e) => setPnrForm({ ...pnrForm, remarks: e.target.value })}
                        sx={{ mt: 2 }}
                        multiline
                        rows={2}
                        placeholder="Add any notes or remarks"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPnrDialog({ open: false, booking: null })}>Cancel</Button>
                    <Button variant="contained" onClick={handleUpdatePNR} disabled={!pnrForm.pnr}>
                        Update PNR
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Rebook Dialog */}
            <Dialog open={rebookDialog.open} onClose={() => setRebookDialog({ open: false, booking: null })} maxWidth="sm" fullWidth>
                <DialogTitle>Rebook with Alternative Supplier</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Booking: {rebookDialog.booking?.bookingRef}
                    </Typography>
                    <Alert severity="info" sx={{ my: 2 }}>
                        Original Supplier: {rebookDialog.booking?.originalSupplier} ({rebookDialog.booking?.supplierStatus})
                    </Alert>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Select Alternative Supplier</InputLabel>
                        <Select
                            value={rebookForm.supplierId}
                            onChange={(e) => setRebookForm({ ...rebookForm, supplierId: e.target.value })}
                            label="Select Alternative Supplier"
                        >
                            {rebookDialog.booking?.alternativeSuppliers?.filter(s => s.available).map((supplier) => (
                                <MenuItem key={supplier.id} value={supplier.id}>
                                    {supplier.name} - {formatCurrency(supplier.price)}
                                    {supplier.price > rebookDialog.booking?.amount && (
                                        <Chip label={`+${formatCurrency(supplier.price - rebookDialog.booking.amount)}`} size="small" color="warning" sx={{ ml: 1 }} />
                                    )}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        label="Notes"
                        value={rebookForm.notes}
                        onChange={(e) => setRebookForm({ ...rebookForm, notes: e.target.value })}
                        sx={{ mt: 2 }}
                        multiline
                        rows={2}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRebookDialog({ open: false, booking: null })}>Cancel</Button>
                    <Button variant="contained" color="secondary" onClick={handleRebook} disabled={!rebookForm.supplierId}>
                        Rebook Now
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Cancel Dialog */}
            <Dialog open={cancelDialog.open} onClose={() => setCancelDialog({ open: false, booking: null })} maxWidth="sm" fullWidth>
                <DialogTitle>Cancel Pending Booking</DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        This will cancel the pending booking: {cancelDialog.booking?.bookingRef}
                    </Alert>
                    <TextField
                        fullWidth
                        label="Cancellation Reason"
                        value={cancelForm.reason}
                        onChange={(e) => setCancelForm({ ...cancelForm, reason: e.target.value })}
                        multiline
                        rows={2}
                        required
                    />
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Refund to Wallet</InputLabel>
                        <Select
                            value={cancelForm.refundToWallet}
                            onChange={(e) => setCancelForm({ ...cancelForm, refundToWallet: e.target.value })}
                            label="Refund to Wallet"
                        >
                            <MenuItem value={true}>Yes - Refund {formatCurrency(cancelDialog.booking?.amount || 0)}</MenuItem>
                            <MenuItem value={false}>No Refund</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCancelDialog({ open: false, booking: null })}>Back</Button>
                    <Button variant="contained" color="error" onClick={handleCancel} disabled={!cancelForm.reason}>
                        Confirm Cancellation
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Top-Up Dialog */}
            <Dialog open={topUpDialog.open} onClose={() => setTopUpDialog({ open: false, supplier: null })} maxWidth="sm" fullWidth>
                <DialogTitle>Top-Up Supplier Balance</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Supplier: {topUpDialog.supplier?.name}
                    </Typography>
                    <Alert severity="info" sx={{ my: 2 }}>
                        Current Balance: {formatCurrency(topUpDialog.supplier?.balance || 0)}
                    </Alert>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Transaction Type</InputLabel>
                        <Select
                            value={topUpForm.type}
                            onChange={(e) => setTopUpForm({ ...topUpForm, type: e.target.value })}
                            label="Transaction Type"
                        >
                            <MenuItem value="credit">Credit (Add Balance)</MenuItem>
                            <MenuItem value="debit">Debit (Deduct Balance)</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        label="Amount"
                        type="number"
                        value={topUpForm.amount}
                        onChange={(e) => setTopUpForm({ ...topUpForm, amount: parseFloat(e.target.value) || 0 })}
                        sx={{ mt: 2 }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">₹</InputAdornment>
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Reference Number"
                        value={topUpForm.reference}
                        onChange={(e) => setTopUpForm({ ...topUpForm, reference: e.target.value })}
                        sx={{ mt: 2 }}
                        placeholder="Transaction reference or UTR"
                    />
                    {topUpForm.amount > 0 && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            New Balance: {formatCurrency((topUpDialog.supplier?.balance || 0) + (topUpForm.type === 'credit' ? topUpForm.amount : -topUpForm.amount))}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setTopUpDialog({ open: false, supplier: null })}>Cancel</Button>
                    <Button variant="contained" onClick={handleTopUp} disabled={topUpForm.amount <= 0}>
                        {topUpForm.type === 'credit' ? 'Add Balance' : 'Deduct Balance'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PendingBookings;
