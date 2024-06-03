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
    { path: '/dashboard/glucose-logs', element: <GlucoseLogs /> },
    { path: '/dashboard/appointments', element: <Appointment /> },
    { path: '/dashboard/notifications', element: <Notifications /> },
    { path: '/dashboard/products', element: <Products /> },
    { path: '/dashboard/medical-forms', element: <MedicalForms /> }
];

export const adminRoutes = [
    { path: '/dashboard/glucose-management', element: <GlucoseManagement /> },
    { path: '/dashboard/appointment-management', element: <AppointmentManagement />},
    { path: '/dashboard/account-management', element: <AccountManagement />},
    { path: '/dashboard/status', element: <Status />},
    { path: '/dashboard/logs', element: <Logs />},
    { path: '/dashboard/tasks', element: <Tasks />},
];