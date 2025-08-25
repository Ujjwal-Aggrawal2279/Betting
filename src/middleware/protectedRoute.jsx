import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
       const { isAuthenticated } = useSelector((state) => state.auth);

       // If not authenticated, redirect to login
       if (!isAuthenticated) {
              return <Navigate to="/login" replace />;
       }

       // If authenticated, render the protected component
       return children;
};

export default ProtectedRoute;