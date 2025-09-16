import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import JobOfferCreatePage from "./pages/JobOfferCreatePage";
import HomePage from "./pages/HomePage";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import AllJobOffersPage from "./pages/AllJobOffersPage"; // 🌟 Add import

// Main app with routes
// import About from "./pages/About";
// import Contact from "./pages/Contact";
// import NotFound from "./pages/NotFound";

// 🌟 ProtectedRoute component to restrict access
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);
  if (!user || !allowedRoles.includes(user.role)) {
    console.log("ProtectedRoute - User: ", user, " Allowed Role: ", allowedRoles);
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/job-offers/create"
            element={
              <ProtectedRoute allowedRoles="RECRUITER">
                <JobOfferCreatePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter-dashboard"
            element={
              <ProtectedRoute allowedRoles={["RECRUITER", "ADMIN"]}>
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/all-job-offers" // 🌟 New route for All Job Offers
            element={
              <ProtectedRoute allowedRoles={["RECRUITER"]}>
                <AllJobOffersPage />
              </ProtectedRoute>
            }
          />

          {/* <Route path="/about" element={<About />} /> */}
          {/* <Route path="/contact" element={<Contact />} /> */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
