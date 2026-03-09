import { createHashRouter } from "react-router";
import FrontendLayout from "./layout/FrontendLayout";
import Home from "./views/front/Home";
import LookForPetSitter from "./views/front/LookForPetSitter";
import SitterServiceDetail from "./views/front/SitterServiceDetail";
import SitterBookingForm from "./views/front/SitterBookingForm";
import NotFound from "./views/front/NotFound";
import OwnerProfile from "./views/front/OwnerProfile";
import SitterBookingDetail from "./views/front/SitterBookingDetail";
import OwnerBookingDetail from "./views/front/OwnerBookingDetail";
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
      {
        path: "sitter/bookings/:id",
        element: <SitterBookingDetail />,
      },
      {
        path: "owner/bookings/:id",
        element: <OwnerBookingDetail />,
      },
    ],
  },
  // 後台路由區塊
  // ----------------------------------------
  {
    // 1. 獨立的後台登入頁面 (不受 AdminLayout 保護)
    path: "/admin/adminlogin", 
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      // {
      //   path: "adminlogin", 
      //   element: <AdminLogin />,
      // },
      {
        index: true, 
        // 當只輸入 /admin 時，自動導向到訂單管理頁面
        element: <AdminBookings />,
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