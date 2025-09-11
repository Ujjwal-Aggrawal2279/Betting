import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import http from "../../services/http";
import { setPermissions } from "../../store/slices/authSlice";
import { Loader2 } from "lucide-react";

const AppLoader = ({ children, showLoader = false }) => {
       const dispatch = useDispatch();
       const { token, isAuthenticated } = useSelector((state) => state.auth);
       const [loading, setLoading] = useState(true);

       useEffect(() => {
              const fetchPermissions = async () => {
                     if (isAuthenticated && token) {
                            try {
                                   const { data } = await http.get("/permissions");
                                   dispatch(setPermissions(data.permissions.permissions));
                            } catch (err) {
                                   console.error("Failed to fetch permissions:", err);
                            }
                     }
                     setLoading(false);
              };

              fetchPermissions();
       }, [isAuthenticated, token, dispatch]);

       if (showLoader || loading) {
              return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin" /></div>;
       }

       return children;
};

export default AppLoader;
