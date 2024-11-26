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

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/otp" element={<Otp />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />

        <Route path="/admins" element={<Admins />} />
        <Route path="/new-admin" element={<AddAdmin />} />
        <Route path="/edit-admin/:id" element={<EditAdmin />} />
      </Route>

      {/* Optional: Catch-all route for unmatched paths */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
