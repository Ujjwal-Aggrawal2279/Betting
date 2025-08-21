// src/components/layout/Navbar.jsx
import { Button } from "@/components/ui/button";

const Navbar = () => {
       return (
              <nav className="flex items-center justify-between py-6 px-6 lg:px-6 shadow-md">
                     <img src="/images/ARDOX 2.svg" alt="Logo" className="h-10 w-auto" />
                     <Button variant="ghost" className="bg-white cursor-pointer font-display font-semibold text-lg">
                            Sign In
                     </Button>
              </nav>
       );
};

export default Navbar;
