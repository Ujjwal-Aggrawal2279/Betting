import {
       LayoutDashboard,
       Gamepad2,
       Banknote,
       Coins,
       ChartNoAxesCombined,
       Cog,
} from "lucide-react";
import MobileSidebar from "./MobileSidebar";
import { NavLink } from "react-router-dom";

const navItems = [
       { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
       { to: "/games", label: "Games", icon: Gamepad2 },
       { to: "/bets", label: "Bets", icon: Banknote },
       { to: "/tokens", label: "Tokens", icon: Coins },
       { to: "/analytics", label: "Analytics", icon: ChartNoAxesCombined },
       { to: "/settings", label: "Settings", icon: Cog },
];

const NavigationSidebar = () => {
       return (
              <>
                     {/* Desktop Sidebar */}
                     <aside className="lg:flex hidden 2xl:w-[5%] xl:w-[7%] lg:w-[10%] flex-col gap-3 overflow-hidden font-display bg-[#131620] h-full">
                            <ul className="w-full pt-4">
                                   {navItems.map(({ to, label, icon: Icon }) => (
                                          <li key={to} className="h-20 flex flex-col items-center justify-center">
                                                 <NavLink
                                                        to={to}
                                                        className={({ isActive }) =>
                                                               `flex flex-col items-center justify-center gap-1 transition-colors ${isActive ? "text-[#EC981A]" : "text-[#2D3660] hover:text-[#EC981A]"
                                                               }`
                                                        }
                                                 >
                                                        <Icon size={30} />
                                                        <span>{label}</span>
                                                 </NavLink>
                                          </li>
                                   ))}
                            </ul>
                     </aside>

                     {/* Mobile Sidebar (Drawer/Sheet) */}
                     <MobileSidebar />
              </>
       );
};

export default NavigationSidebar;
