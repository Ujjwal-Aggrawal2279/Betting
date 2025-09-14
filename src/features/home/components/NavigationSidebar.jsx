import {
       LayoutDashboard,
       Gamepad2,
       Banknote,
       Coins,
       UserPlus,
       CircleDollarSign,
       Lock,
} from "lucide-react";
import MobileSidebar from "./MobileSidebar";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const navItems = [
       { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
       { to: "/users", label: "Users", icon: UserPlus },
       { to: "/games", label: "Games", icon: Gamepad2 },
       { to: "/rates", label: "Rates", icon: CircleDollarSign },
       { to: "/bets", label: "Bets", icon: Banknote },
       { to: "/tokens", label: "Tokens", icon: Coins },
       { to: "/forgot-password", label: "Password", icon: Lock },
];

const NavigationSidebar = () => {
       const permissions = useSelector((state) => state.auth.permissions);

       return (
              <>
                     {/* Desktop Sidebar */}
                     <aside className="lg:flex hidden 2xl:w-[5%] xl:w-[7%] lg:w-[10%] flex-col gap-3 overflow-hidden font-display bg-[#131620] h-full">
                            <ul className="w-full pt-4">
                                   {navItems.map(({ to, label, icon: Icon }) => {
                                          // Only show dashboard if user has the permission
                                          if (to === "/dashboard" && !permissions.includes("view_dashboard")) {
                                                 return null;
                                          }

                                          return (
                                                 <li
                                                        key={to}
                                                        className="h-20 flex flex-col items-center justify-center"
                                                 >
                                                        <NavLink
                                                               to={to}
                                                               className={({ isActive }) =>
                                                                      `flex flex-col items-center justify-center gap-1 transition-colors ${isActive
                                                                             ? "text-[#EC981A]"
                                                                             : "text-[#2D3660] hover:text-[#EC981A]"
                                                                      }`
                                                               }
                                                        >
                                                               <Icon size={30} />
                                                               <span>{label}</span>
                                                        </NavLink>
                                                 </li>
                                          );
                                   })}
                            </ul>
                     </aside>

                     {/* Mobile Sidebar (Drawer/Sheet) */}
                     <MobileSidebar />
              </>
       );
};

export default NavigationSidebar;
