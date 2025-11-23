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
import AdminPage from "./pages/AdminPage";
import AdminRoute from "./AdminRoute";
import Spotlight from "./pages/Spotlight";

import Challenges from "./pages/Challenges";
import ChallengeDetail from "./pages/ChallengeDetail";
import AdminChallenges from "./pages/AdminChallenges";
import CreateChallengeEntry from "./pages/CreateChallengeEntry";
import AdminUsers from "./pages/AdminUsers";

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
        <Route path="/spotlight" element={<Spotlight />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/challenges/:id" element={<ChallengeDetail />} />
        <Route 
          path="/challenges/:challengeId/create-entry" 
          element={<CreateChallengeEntry />} 
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />

        <Route 
          path="/admin/users" 
          element={
            <AdminRoute>
            <AdminUsers />
            </AdminRoute>
          } 
        />

        <Route 
          path="/admin/challenges" 
          element={
            <AdminRoute>
              <AdminChallenges />
            </AdminRoute>
          } 
        />

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Suspense>
  );
}

export default App;
