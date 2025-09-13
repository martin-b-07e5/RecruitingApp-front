import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import JobOfferCreatePage from "./pages/JobOfferCreatePage";
import HomePage from "./pages/HomePage"; // 🌟 Add import

// Main app with routes

// import About from "./pages/About";
// import Contact from "./pages/Contact";
// import NotFound from "./pages/NotFound";

// 🌟 ProtectedRoute component to restrict access
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useContext(AuthContext);
  if (!user || user.role !== allowedRole) {
    console.log("ProtectedRoute - User: ", user, " Allowed Role: ", allowedRole);
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
              <ProtectedRoute allowedRole="RECRUITER">
                <JobOfferCreatePage />
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
