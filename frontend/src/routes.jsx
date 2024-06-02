// routes.js
import GlucoseLogs from './components/GlucoseLogs';
import Appointment from './components/Appointment';
import MedicalForms from './components/MedicalForms';
import Products from './components/Products';
import Notifications from './components/Notifications';
import Tasks from './components/Tasks';
import GlucoseManagement from './components/GlucoseManagement';
import AppointmentManagement from './components/AppointmentManagement';
import Status from './components/Status';
import Logs from './components/Logs';
import AccountManagement from './components/AccountManagement';

export const userRoutes = [
    { path: 'glucose-logs', element: <GlucoseLogs /> },
    { path: 'appointments', element: <Appointment /> },
    { path: 'notifications', element: <Notifications /> },
    { path: 'products', element: <Products /> },
    { path: 'medical-forms', element: <MedicalForms /> }
];

export const adminRoutes = [
    { path: 'glucose-management', element: <GlucoseManagement /> },
    { path: 'appointment-management', element: <AppointmentManagement />},
    { path: 'account-management', element: <AccountManagement />},
    { path: 'status', element: <Status />},
    { path: 'logs', element: <Logs />},
    { path: 'tasks', element: <Tasks />},
];