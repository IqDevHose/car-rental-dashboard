// src/App.tsx

import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";

import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import Otp from "./pages/auth/Otp";
import Admins from "./pages/admins/Admins";
import AddAdmin from "./pages/admins/AddAdmin";
import EditAdmin from "./pages/admins/EditAdmin";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Cars from "./pages/cars/cars";
import CreateCar from "./pages/cars/createCar";
import Car from "./pages/cars/Car";
import BrandPage from "./pages/brands/Brands";
import AddBrandPage from "./pages/brands/NewBrand";
import EditBrandPage from "./pages/brands/EditBrand";
import Offers from "./pages/offers/Offers";
import EditOffer from "./pages/offers/EditOffer";
import AddOffer from "./pages/offers/AddOffer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Brands */}
          <Route path="/brand" element={<BrandPage />} />
          <Route path="/add-brand" element={<AddBrandPage />} />
          <Route path="/edit-brand/:brandId" element={<EditBrandPage />} />

          {/* Cars */}
          <Route path="/" element={<Cars />} />
          <Route path="/cars/:id" element={<Car />} />
          <Route path="/cars/create" element={<CreateCar />} />

          {/* Admins */}
          <Route path="/admins" element={<Admins />} />
          <Route path="/new-admin" element={<AddAdmin />} />
          <Route path="/edit-admin/:id" element={<EditAdmin />} />
          {/* Offers */}
          <Route path="/offers" element={<Offers />} />
          <Route path="/edit-offer/:id" element={<EditOffer />} />
          <Route path="/add-offer" element={<AddOffer />} />
        </Route>

        {/* Optional: Catch-all route for unmatched paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
