import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
       LayoutDashboard,
       Gamepad2,
       Banknote,
       Coins,
       ChartNoAxesCombined,
       Cog,
       ChevronUpCircleIcon,
       UserPlus,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
       { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
       { to: "/users", label: "Users", icon: UserPlus },
       { to: "/games", label: "Games", icon: Gamepad2 },
       { to: "/bets", label: "Bets", icon: Banknote },
       { to: "/tokens", label: "Tokens", icon: Coins },
       { to: "/analytics", label: "Analytics", icon: ChartNoAxesCombined },
       { to: "/settings", label: "Settings", icon: Cog },
];

const MobileSidebar = () => {
       return (
              <div className="lg:hidden">
                     <Sheet>
                            <SheetTrigger className="fixed bottom-4 left-4 bg-[#EC981A] p-3 rounded-full shadow-lg z-50">
                                   <ChevronUpCircleIcon size={24} className="text-[#000]" />
                            </SheetTrigger>

                            <SheetContent
                                   side="bottom"
                                   className="bg-[#131620] w-full p-6 font-display border-none"
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
              </div>

       );
};

export default MobileSidebar;
