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
  {
    path: "*", // 404 頁面
    element: <NotFound />,
  },
]);