import { Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "../components/pages/Landing.page";
import { NotFound404 } from "../components/pages/NotFound404.page";
import { Login } from "../components/pages/Login.page";
import { RegisterHouse } from "../components/pages/RegisterHouse.page";
import { Dashboard } from "../components/pages/Dashboard.page";
import { RegisterUser } from "../components/pages/RegisterUser.page";
import { HousePage } from "../components/pages/House.page";
import { SubPage } from "../components/pages/Sub.Page";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="home" />} />
      <Route path="home" element={<LandingPage />} />
      <Route path="login" element={<Login />} />
      <Route path="register/user" element={<RegisterUser />} />
      <Route path="register/house" element={<RegisterHouse />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="house/manage" element={<HousePage />} />
      <Route path="sub/manage" element={<SubPage />} />
      <Route path="404" element={<NotFound404 />} />
      <Route path="*" element={<Navigate to="404" />} />
    </Routes>
  );
};
