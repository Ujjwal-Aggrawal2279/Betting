import { createBrowserRouter } from "react-router-dom";
import App from "../../App";
import LoginPage from "../../features/auth/pages/LoginPage";
import HomePage from "../../features/home/pages/HomePage";

const router = createBrowserRouter([
       {
              path: "/",
              element: <App />,
              children: [
                     {
                            index: true,
                            element: <HomePage />,
                     },
                     {
                            path: "login",
                            element: <LoginPage />,
                     },
              ],
       },
]);

export default router;
