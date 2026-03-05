import { createHashRouter } from "react-router";
import FrontendLayout from "./layout/FrontendLayout";
import Home from "./views/front/Home";
import LookForPetSitter from "./views/front/LookForPetSitter";
import SitterServiceDetail from "./views/front/SitterServiceDetail";
import SitterBookingForm from "./views/front/SitterBookingForm";
import NotFound from "./views/front/NotFound";
import OwnerProfile from "./views/front/OwnerProfile";
import Login from "./views/front/Login";
import ServiceDeployForm from "./views/front/ServiceDeployForm";
import AdminLayout from "./layout/AdminLayout";
import AdminBookings from "./views/admin/AdminBookings";
import AdminUsers from "./views/admin/AdminUsers";
import AdminLogin from "./views/admin/AdminLogin";
// import LookForPetSitter2 from "./views/front/LookForPetSitter2";

export const router = createHashRouter([
  {
    path: "/",
    element: <FrontendLayout />,
    children: [
      {
        index: true, // 預設首頁
        element: <Home />,
      },
      {
        path: "lookforpetsitter",
        element: <LookForPetSitter />,
      },
      {
        path: "lookforpetsitter/:id", // 動態參數
        element: <SitterServiceDetail />,
      },
      {
        path: "lookforpetsitter/:id/booking",
        element: <SitterBookingForm />,
      },
      {
        path: "ownerprofile",
        element: <OwnerProfile />,
      },
      {
        path: "servicedeploy",
        element: <ServiceDeployForm />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "adminlogin", 
        element: <AdminLogin />,
      },
      {
        path: "adminbookings", 
        element: <AdminBookings />,
      },
      {
        path: "adminusers", 
        element: <AdminUsers />,
      },
    ]
  },
  {
    path: "*", // 404 頁面
    element: <NotFound />,
  },
]);