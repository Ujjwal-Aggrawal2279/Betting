import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
       LayoutDashboard,
       Gamepad2,
       Banknote,
       Coins,
       ChartNoAxesCombined,
       Cog,
       ChevronLast,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
       { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
       { to: "/games", label: "Games", icon: Gamepad2 },
       { to: "/bets", label: "Bets", icon: Banknote },
       { to: "/tokens", label: "Tokens", icon: Coins },
       { to: "/analytics", label: "Analytics", icon: ChartNoAxesCombined },
       { to: "/settings", label: "Settings", icon: Cog },
];

const MobileSidebar = () => {
       return (
              <Sheet>
                     <SheetTrigger className="lg:hidden p-0.5 shadow-md">
                            <ChevronLast size={28} className="text-[#EC981A]" />
                     </SheetTrigger>

                     <SheetContent
                            side="left"
                            className="bg-[#131620] w-64 p-6 font-display border-none"
                     >
                            {/* Hidden accessible title */}
                            <VisuallyHidden>
                                   <h2>Mobile Navigation</h2>
                            </VisuallyHidden>

                            <ul className="pt-6 space-y-6">
                                   {navItems.map(({ to, label, icon: Icon }) => (
                                          <li key={to}>
                                                 <NavLink
                                                        to={to}
                                                        className={({ isActive }) =>
                                                               `flex items-center gap-3 text-lg transition-colors ${isActive
                                                                      ? "text-[#EC981A]"
                                                                      : "text-[#2D3660] hover:text-[#EC981A]"
                                                               }`
                                                        }
                                                 >
                                                        <Icon size={24} />
                                                        {label}
                                                 </NavLink>
                                          </li>
                                   ))}
                            </ul>
                     </SheetContent>
              </Sheet>
       );
};

export default MobileSidebar;
