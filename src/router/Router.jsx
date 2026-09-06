import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../components/RootLayout";



const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <div>Home Page</div>,
      },
    ],
  },
]);

export default router;
