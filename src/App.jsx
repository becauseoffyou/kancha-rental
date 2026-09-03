import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import Equipment from "./pages/Equipment";
import EquipmentDetail from "./pages/EquipmentDetail";
import Booking from "./pages/Booking";
import Profile from "./pages/Profil";
import BookingDetail from "./pages/BookingDetail";
import Invoice from "./pages/Invoice";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/equipment/:id" element={<EquipmentDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/booking/:id" element={<BookingDetail />} />
        <Route path="/invoice/:id" element={<Invoice />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;