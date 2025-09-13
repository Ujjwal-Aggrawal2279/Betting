// src/components/layout/Navbar.jsx
import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../../store/slices/authSlice";
import http from "../../../services/http";
import { useEffect } from "react";
import { getSingleUser } from "../../../store/slices/userSlice";
import { toast } from "sonner";
import { Loader2, LogOut, LogIn } from "lucide-react";

const Navbar = () => {
       const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
       const token = useSelector((state) => state.auth.token);
       const { user, fetchingSingleUser, singleUserError } = useSelector(
              (state) => state.users
       );
       const dispatch = useDispatch();
       const navigate = useNavigate();

       // ✅ fetch user only when token changes
       useEffect(() => {
              if (token) {
                     try {
                            const decoded = jwtDecode(token);
                            if (decoded?.id) {
                                   dispatch(getSingleUser(decoded.id));
                            }
                     } catch (err) {
                            toast.error("Invalid session, please log in again.", err);
                     }
              }
       }, [dispatch, token]);

       // ✅ show error toast if fetching user fails
       useEffect(() => {
              if (singleUserError) {
                     toast.error("Failed to fetch user details.");
              }
       }, [singleUserError]);

       const handleAuthAction = async () => {
              if (isAuthenticated) {
                     try {
                            const response = await http.post("/logout", null, {
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
                            toast.error("Logout failed. Try again.");
                     }
              } else {
                     navigate("/login");
              }
       };

       return (
              <nav className="flex items-center justify-between py-6 px-6 lg:px-6 shadow-md">
                     {/* Logo */}
                     <Link to="/">
                            <img src="/images/ARDOX 2.svg" alt="Logo" className="h-10 w-auto" />
                     </Link>

                     <div className="flex gap-4 items-center">
                            {/* Tokens Section */}
                            {isAuthenticated && <div className="flex items-center gap-2 bg-white/10 px-3 sm:px-4 py-2 rounded-2xl shadow-md border border-white/20">
                                   <span className="hidden sm:block text-white font-medium">Tokens</span>
                                   {fetchingSingleUser ? (
                                          <Loader2 className="w-4 h-4 text-white animate-spin" />
                                   ) : (
                                          <span className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-sm sm:text-base font-bold px-2 sm:px-3 py-1 rounded-full shadow">
                                                 {user?.tokens ?? 0}
                                          </span>
                                   )}
                            </div>}

                            {/* Auth Button */}
                            <Button
                                   onClick={handleAuthAction}
                                   variant="ghost"
                                   className="bg-white cursor-pointer font-display font-semibold text-lg flex items-center gap-2"
                            >
                                   {/* Desktop view: show text */}
                                   <span className="hidden sm:inline">
                                          {isAuthenticated ? "Sign Out" : "Sign In"}
                                   </span>
                                   {/* Mobile view: show icon */}
                                   {isAuthenticated ? (
                                          <LogOut className="sm:hidden w-5 h-5 text-gray-700" />
                                   ) : (
                                          <LogIn className="sm:hidden w-5 h-5 text-gray-700" />
                                   )}
                            </Button>
                     </div>
              </nav>
       );
};

export default Navbar;
