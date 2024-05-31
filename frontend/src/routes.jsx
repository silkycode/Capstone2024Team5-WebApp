// routes.js
import GlucoseLogs from './components/GlucoseLogs';
import Appointment from './components/Appointment';
import MedicalForms from './components/MedicalForms';
import Products from './components/Products';
import Notifications from './components/Notifications';
import AdminGlucose from './components/AdminGlucose';
import AdminAppointment from './components/AdminAppointment';

export const userRoutes = [
    { path: 'glucose-logs', element: <GlucoseLogs /> },
    { path: 'appointments', element: <Appointment /> },
    { path: 'notifications', element: <Notifications /> },
    { path: 'products', element: <Products /> },
    { path: 'medical-forms', element: <MedicalForms /> }
];

export const adminRoutes = [
    { path: 'admin-glucose', element: <AdminGlucose /> },
    { path: 'admin-appointments', element: <AdminAppointment />},
];