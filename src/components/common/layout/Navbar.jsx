// src/components/layout/Navbar.jsx
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../../store/slices/authSlice";
import http from "../../../services/http";

const Navbar = () => {
       const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
       const token = useSelector((state) => state.auth.token)
       const dispatch = useDispatch();
       const navigate = useNavigate();

       const handleAuthAction = async () => {
              if (isAuthenticated) {
                     try {
                            const response = await http.post("/logout", {
                                   headers: {
                                          Authorization: `Bearer ${token}`,
                                   },
                            });
                            if (response) {
                                   dispatch(logout());
                                   navigate("/login");
                            }
                     } catch (err) {
                            console.error("Logout failed:", err);
                     }
              } else {
                     navigate("/login");
              }
       };
       return (
              <nav className="flex items-center justify-between py-6 px-6 lg:px-6 shadow-md">
                     <Link to="/">
                            <img src="/images/ARDOX 2.svg" alt="Logo" className="h-10 w-auto" />
                     </Link>
                     <Button
                            onClick={handleAuthAction}
                            variant="ghost"
                            className="bg-white cursor-pointer font-display font-semibold text-lg"
                     >
                            {isAuthenticated ? "Sign Out" : "Sign In"}
                     </Button>
              </nav>
       );
};

export default Navbar;
