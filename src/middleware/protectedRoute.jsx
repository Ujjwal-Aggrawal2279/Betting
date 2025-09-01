import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const ProtectedRoute = ({ children, requiredPermissions = [] }) => {
       const { isAuthenticated, permissions } = useSelector((state) => state.auth);

       // Not logged in
       if (!isAuthenticated) {
              return <Navigate to="/login" replace />;
       }

       // Check required permissions
       if (requiredPermissions.length > 0) {
              const hasPermission = requiredPermissions.every((perm) =>
                     permissions.includes(perm)
              );

              if (!hasPermission) {
                     return (
                            <div className="flex flex-col items-center justify-center h-screen text-red-500 w-full">
                                   <AlertCircle className="w-12 h-12 mb-4" />
                                   <span className="text-lg font-semibold">Access Denied</span>
                                   <span className="text-sm text-red-400">You do not have permission to view this page.</span>
                            </div>
                     );
              }
       }

       // User is authenticated and has required permissions
       return children;
};

export default ProtectedRoute;
