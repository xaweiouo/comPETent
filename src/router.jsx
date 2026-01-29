import { createHashRouter } from "react-router";
import FrontendLayout from "./layout/FrontendLayout";
import Home from "./views/front/Home";
import LookForPetSitter from "./views/front/LookForPetSitter";
import SitterServiceDetail from "./views/front/SitterServiceDetail";
import NotFound from "./views/front/NotFound";

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
    ],
  },
  {
    path: "*", // 404 頁面
    element: <NotFound />,
  },
]);