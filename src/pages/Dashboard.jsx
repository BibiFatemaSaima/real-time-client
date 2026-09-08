import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Dashboard Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                  {user?.displayName?.charAt(0) ||
                    user?.email?.charAt(0).toUpperCase() ||
                    "U"}
                </div>
              )}

              <div className="hidden sm:block">
                <p className="font-medium text-gray-800">
                  {user?.displayName || "User"}
                </p>

                <p className="text-sm text-gray-500">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.displayName || "User"} 👋
          </h2>

          <p className="text-gray-500">
            Manage your workspaces, boards and tasks from here.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

          {/* Workspace */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🏢</span>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Workspaces
            </h3>

            <p className="text-gray-500 mb-5">
              Create and manage your team workspaces.
            </p>

            <Link
              to="/dashboard/workspaces"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
            >
              View Workspaces
            </Link>
          </div>

          {/* Boards */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📋</span>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Boards
            </h3>

            <p className="text-gray-500 mb-5">
              Organize your projects using task boards.
            </p>

            <Link
              to="/dashboard/boards"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
            >
              View Boards
            </Link>
          </div>

          {/* Tasks */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">✅</span>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              My Tasks
            </h3>

            <p className="text-gray-500 mb-5">
              See and manage the tasks assigned to you.
            </p>

            <Link
              to="/dashboard/tasks"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg transition"
            >
              View Tasks
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Recent Activity
            </h2>

            <button className="text-sm text-blue-600 hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-5">

            {/* Activity 1 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                📝
              </div>

              <div>
                <p className="text-gray-700">
                  No recent activity yet.
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  Your board activities will appear here.
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;