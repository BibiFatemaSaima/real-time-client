import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../components/RootLayout";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import PrivateRoute from "../components/PrivateRoute";
import Dashboard from "../pages/Dashboard";
import Workspace from "../pages/Workspace";
import WorkspaceDetails from "../pages/WorkspaceDetails";
import BoardDetails from "../pages/BoardDetails";
import Boards from "../pages/Boards";
import Tasks from "../components/Tasks";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "dashboard",
        element: <PrivateRoute />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "workspaces",
            element: <Workspace />,
          },
          {
            path: "workspaces/:id",
            element: <WorkspaceDetails />,
          },
          {
            path: "boards",
            element: <Boards />,
          },
          {
            path: "boards/:id",
            element: <BoardDetails />,
          },
          {
            path: "tasks",
            element: <Tasks />,
          },
        ],
      },
    ],
  },
]);

export default router;
