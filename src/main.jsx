import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";

// Component to track page views
const AnalyticsTracker = () => {
  const location = useLocation();
  useEffect(() => {
    console.log('Google Analytics: Sending pageview for', location.pathname + location.search);
    window.gtag('config', 'G-H3J2ZJBLHH', {
      page_path: location.pathname + location.search,
    });
  }, [location]);
  return null;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
