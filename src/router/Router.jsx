import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../components/RootLayout";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";



const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home/>,
      },
      {
        path: "register",
        element:<Register/>,
      },
      {
        path: "login",
        element:<Login/>,
      }
    ],
  },
]);

export default router;
