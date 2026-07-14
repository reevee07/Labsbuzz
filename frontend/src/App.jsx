import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleRoute from './components/common/RoleRoute';
import Spinner from './components/common/Spinner';

const HomePage = lazy(() => import('./pages/HomePage'));
const SearchResultsPage = lazy(() => import('./pages/SearchResultsPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const LabOwnerLoginPage = lazy(() => import('./pages/auth/LabOwnerLoginPage'));
const LabOwnerRegisterPage = lazy(() => import('./pages/auth/LabOwnerRegisterPage'));

const BookingFlowPage = lazy(() => import('./pages/booking/BookingFlowPage'));
const BookingSuccessPage = lazy(() => import('./pages/booking/BookingSuccessPage'));

const CustomerOverviewPage = lazy(() => import('./pages/customer/OverviewPage'));
const CustomerBookingsPage = lazy(() => import('./pages/customer/BookingsPage'));
const CustomerSavedLabsPage = lazy(() => import('./pages/customer/SavedLabsPage'));
const CustomerNotificationsPage = lazy(() => import('./pages/customer/NotificationsPage'));
const CustomerProfilePage = lazy(() => import('./pages/customer/ProfilePage'));
const CustomerSettingsPage = lazy(() => import('./pages/customer/SettingsPage'));

const LabOwnerOverviewPage = lazy(() => import('./pages/labowner/OverviewPage'));
const LabOwnerTestsPage = lazy(() => import('./pages/labowner/ManageTestsPage'));
const LabOwnerBookingsPage = lazy(() => import('./pages/labowner/BookingsPage'));
const LabOwnerCalendarPage = lazy(() => import('./pages/labowner/CalendarPage'));
const LabOwnerProfilePage = lazy(() => import('./pages/labowner/LabProfilePage'));
const LabOwnerSettingsPage = lazy(() => import('./pages/labowner/SettingsPage'));

const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const PageFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '160px 0' }}>
    <Spinner size="lg" />
  </div>
);

function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/lab-owner/login" element={<LabOwnerLoginPage />} />
          <Route path="/lab-owner/register" element={<LabOwnerRegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/booking/:labTestId" element={<BookingFlowPage />} />
            <Route path="/booking/success/:bookingId" element={<BookingSuccessPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute roles={['customer']} />}>
            <Route path="/dashboard" element={<DashboardLayout role="customer" />}>
              <Route index element={<CustomerOverviewPage />} />
              <Route path="bookings" element={<CustomerBookingsPage />} />
              <Route path="saved-labs" element={<CustomerSavedLabsPage />} />
              <Route path="notifications" element={<CustomerNotificationsPage />} />
              <Route path="profile" element={<CustomerProfilePage />} />
              <Route path="settings" element={<CustomerSettingsPage />} />
            </Route>
          </Route>

          <Route element={<RoleRoute roles={['lab_owner']} />}>
            <Route path="/lab-owner" element={<DashboardLayout role="lab_owner" />}>
              <Route path="dashboard" element={<LabOwnerOverviewPage />} />
              <Route path="tests" element={<LabOwnerTestsPage />} />
              <Route path="bookings" element={<LabOwnerBookingsPage />} />
              <Route path="calendar" element={<LabOwnerCalendarPage />} />
              <Route path="profile" element={<LabOwnerProfilePage />} />
              <Route path="settings" element={<LabOwnerSettingsPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
