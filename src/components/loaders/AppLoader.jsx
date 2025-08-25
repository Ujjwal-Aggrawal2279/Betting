import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import http from "../../services/http";
import { setPermissions } from "../../store/slices/authSlice";


const AppLoader = ({ children }) => {
       const dispatch = useDispatch();
       const { token, isAuthenticated } = useSelector((state) => state.auth);

       useEffect(() => {
              const fetchPermissions = async () => {
                     if (isAuthenticated && token) {
                            const { data } = await http.get("/permissions", {
                                   headers: { Authorization: `Bearer ${token}` },
                            });
                            dispatch(setPermissions(data.permissions.permissions));
                     }
              };

              fetchPermissions();
       }, [isAuthenticated, token, dispatch]);

       return children;
};

export default AppLoader;
