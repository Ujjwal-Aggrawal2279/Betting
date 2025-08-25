import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import router from "./app/routes";
import { store, persistor } from "./store/store";
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react";
import AppLoader from "./components/loaders/AppLoader";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<AppLoader />} persistor={persistor}>
        <Suspense fallback={<AppLoader />}>
          <RouterProvider router={router} />
        </Suspense>
      </PersistGate>
    </Provider>
  </StrictMode>
);
