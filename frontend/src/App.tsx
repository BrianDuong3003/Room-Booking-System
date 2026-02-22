/* eslint-disable @typescript-eslint/no-explicit-any */
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import ClassroomSearch from "./components/classroom/ClassroomSearch";
import ScheduleSearch from "./components/schedule/ScheduleSearch";
import { SecurityDashboard } from "./components/security/SecurityDashboard";
import { LoginForm } from "./components/auth/LoginForm";
import { RegisterForm } from "./components/auth/RegisterForm";
import { UserProfile } from "./components/auth/UserProfile";
import { ChangePassForm } from "./components/auth/ChangePassForm";
import MyBookingsPage from "@/pages/dashboard/MyBookingsPage";

// Admin Components
import RoomManagement from "./components/admin/rooms/RoomManagement";
import RoomDetails from "./components/admin/rooms/RoomDetails";
import ScheduleManagement from "./components/admin/schedule/ScheduleManagement";
import ScheduleDetails from "./components/admin/schedule/ScheduleDetails";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="/login"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                  <LoginForm />
                </div>
              </div>
            }
          />
          <Route
            path="/register"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                  <RegisterForm />
                </div>
              </div>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout userRole="lecturer">
                  <h1 className="page-title">Dashboard</h1>
                  <p className="text-muted-foreground mb-6">
                    Welcome to the Smart Campus System Dashboard.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="col-span-full">
                      <ClassroomSearch />
                    </div>
                  </div>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/rooms/:roomId"
            element={
              <ProtectedRoute>
                <DashboardLayout userRole="lecturer">
                  <RoomDetails />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/schedule-search"
            element={
              <ProtectedRoute>
                <DashboardLayout userRole="lecturer">
                  <ScheduleSearch />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/schedule"
            element={
              <ProtectedRoute>
                <DashboardLayout userRole="lecturer">
                  <ScheduleManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/rooms"
            element={
              <ProtectedRoute>
                <DashboardLayout userRole="lecturer">
                  <h1 className="page-title">Classroom Search</h1>
                  <RoomManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/security"
            element={
              <ProtectedRoute>
                <DashboardLayout userRole="security">
                  <SecurityDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <ProtectedRoute>
                <DashboardLayout userRole="lecturer">
                  <UserProfile />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/changepass"
            element={
              <ProtectedRoute>
                <DashboardLayout userRole="lecturer">
                  <ChangePassForm />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/bookings"
            element={
              <ProtectedRoute>
                <DashboardLayout userRole="lecturer">
                  <MyBookingsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
