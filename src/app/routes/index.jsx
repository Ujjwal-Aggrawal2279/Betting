import { createBrowserRouter } from "react-router-dom";
import App from "../../App";
import LoginPage from "../../features/auth/pages/LoginPage";
import HomePage from "../../features/home/pages/HomePage";
import Dashboard from "../../features/dashboard/pages/Dashboard";
import UserPage from "../../features/users/pages/UserPage";
import Roles from "../../features/roles/pages/Roles";
import ProtectedRoute from "../../middleware/protectedRoute";

const router = createBrowserRouter([
       {
              path: "/",
              element: <App />,
              children: [
                     {
                            index: true,
                            element: <ProtectedRoute><HomePage /></ProtectedRoute>,
                     },
                     {
                            path: "login",
                            element: <LoginPage />,
                     },
                     {
                            path: "dashboard",
                            element: <ProtectedRoute><Dashboard /></ProtectedRoute>
                     },
                     {
                            path: "users",
                            element: <ProtectedRoute><UserPage /></ProtectedRoute>
                     },
                     {
                            path: "roles",
                            element: <ProtectedRoute><Roles /></ProtectedRoute>
                     }
              ],
       },
]);

export default router;
