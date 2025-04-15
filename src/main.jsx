import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./hooks/ThemeProvider";
import { Toaster } from "./components/ui/toaster";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { ClerkProvider } from "@clerk/clerk-react";
import AdminLayout from "./layout/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminEventsPage from "./pages/Admin/AdminEventsPage";
import AdminInstructorsPage from "./pages/Admin/AdminInstructorsPage";
import NewInstructorPage from "./pages/Admin/NewInstructorPage";
import NewEventPage from "./pages/Admin/NewEventPage";
import ProfilePage from "./pages/ProfilePage";
import AdminBookingsPage from "./pages/Admin/AdminBookingsPage";
import NewClubPage from "./pages/Admin/NewClubPage";
import ClubEvents from "./pages/ClubEvent";
import AdminClubsPage from "./pages/Admin/AdminClubPage";
import InstructorPage from "./pages/InstructorPage";
import AnalyticsDashboard from "./pages/Admin/AnalyticsDashboard";
import RateEventPage from "./pages/RateEventPage";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env.local file");
}

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/club-events/:clubId",
        element: <ClubEvents />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/instructors",
        element: <InstructorPage />,
      },
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {
            path: "",
            element: <AdminDashboard />,
          },
          {
            path: "events/:clubId",
            element: <AdminEventsPage />,
          },
          {
            path: "clubs",
            element: <AdminClubsPage />,
          },
          {
            path: "analytic",
            element: <AnalyticsDashboard />,
          },
          {
            path: "rate-event",
            element: <RateEventPage />,
          },
          {
            path: "instructors",
            element: <AdminInstructorsPage />,
          },
          {
            path: "booking",
            element: <AdminBookingsPage />,
          },
          {
            path: "instructors/new",
            element: <NewInstructorPage />,
          },
          {
            path: "events/new/:clubId",
            element: <NewEventPage />,
          },

          {
            path: "clubs/new",
            element: <NewClubPage />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      signInUrl="/login"
      signUpUrl="/register"
    >
      <ThemeProvider>
        {" "}
        <RouterProvider router={routes} />
        <Toaster />
      </ThemeProvider>
    </ClerkProvider>
  </StrictMode>
);
