import { createBrowserRouter } from "react-router-dom";
import App from "../../App";
import LoginPage from "../../features/auth/pages/LoginPage";
import HomePage from "../../features/home/pages/HomePage";
import Dashboard from "../../features/dashboard/pages/Dashboard";
import UserPage from "../../features/users/pages/UserPage";
import Roles from "../../features/roles/pages/Roles";
import ProtectedRoute from "../../middleware/protectedRoute";
import GamePage from "../../features/games/pages/GamePage";
import GameDetailPage from "../../features/games/pages/GameDetailPage";
import RatesPage from "../../features/rates/pages/RatesPage";
import TokenPage from "../../features/tokens/pages/TokenPage";
import ForgotPasswordPage from "../../features/auth/pages/ForgotPasswordPage";
import Betspage from "../../features/bets/pages/Betspage";
import Session from "../../features/sessions/pages/Session";

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
                            path: "forgot-password",
                            element: <ProtectedRoute><ForgotPasswordPage /></ProtectedRoute>
                     },
                     {
                            path: "dashboard",
                            element: <ProtectedRoute requiredPermissions={["view_dashboard"]}><Dashboard /></ProtectedRoute>
                     },
                     {
                            path: "users",
                            element: <ProtectedRoute requiredPermissions={["view_user"]}><UserPage /></ProtectedRoute>
                     },
                     {
                            path: "roles",
                            element: <ProtectedRoute requiredPermissions={["view_roles", "create_role", "edit_role", "role_permissions_manager"]}><Roles /></ProtectedRoute>
                     },
                     {
                            path: "rates",
                            element: <ProtectedRoute requiredPermissions={["rates_manager"]}><RatesPage /></ProtectedRoute>
                     },
                     {
                            path: "sessions",
                            element: <ProtectedRoute requiredPermissions={["match_session_manager"]}><Session /></ProtectedRoute>
                     },
                     {
                            path: "tokens",
                            element: <ProtectedRoute><TokenPage /></ProtectedRoute>
                     },
                     {
                            path: "games",
                            element: <ProtectedRoute><GamePage /></ProtectedRoute>
                     },
                     {
                            path: "games/:title",
                            element: <ProtectedRoute><GameDetailPage /></ProtectedRoute>
                     },
                     {
                            path: "bets",
                            element: <ProtectedRoute><Betspage /></ProtectedRoute>
                     }
              ],
       },
]);

export default router;
