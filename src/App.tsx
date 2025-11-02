// File: src/App.js (Phiên bản đúng)

import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ElementDetail from "./pages/Detail";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Elements from "./pages/Element";
import LoginSuccess from "./pages/Login/LoginSuccess";
import AddElement from "./pages/AddElement";
import ProfilePage from "./pages/Profile";
import FavouritePage from "./pages/Favourite";
import SettingProfile from "./pages/Setting";

function App() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/favourite" element={<FavouritePage />} />
        <Route path="/elements" element={<Elements />} />
        <Route path="/element/:id" element={<ElementDetail />} />
        <Route path="/login/success" element={<LoginSuccess />} />
        <Route path="/elements/new" element={<AddElement />} />
        <Route path="/settings" element={<SettingProfile />} />

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Suspense>
  );
}

export default App;
