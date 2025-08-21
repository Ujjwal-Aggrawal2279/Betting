import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

const App = () => {
  return (
    <>

      {/* Routed content */}
      <Outlet />
      {/* Toast notification system */}
      <Toaster richColors position="top-right" />
    </>
  );
};

export default App;
