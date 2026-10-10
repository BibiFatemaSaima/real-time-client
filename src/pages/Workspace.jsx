import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router";

const Workspace = () => {
  const [showModal, setShowModal] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext);

  // ================= GET WORKSPACES =================

  const loadWorkspaces = async () => {
    try {
      const response = await axios.get(
        "https://real-time-server-project3.vercel.app/workspaces",
      );

      setWorkspaces(response.data);
    } catch (error) {
      console.error("Failed to load workspaces:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load workspaces when component loads
  useEffect(() => {
    loadWorkspaces();
  }, []);

  // ================= CREATE WORKSPACE =================

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();

    if (!workspaceName.trim()) {
      return;
    }

    const workspaceData = {
      name: workspaceName,
      description: "",
      ownerEmail: user?.email,
    };

    try {
      const response = await axios.post(
        "https://real-time-server-project3.vercel.app/workspaces",
        workspaceData,
      );

      console.log(response.data);

      // Reload workspace list
      await loadWorkspaces();

      // Reset form
      setWorkspaceName("");
      setShowModal(false);
    } catch (error) {
      console.error("Failed to create workspace:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* ================= HEADER ================= */}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Workspaces</h1>

            <p className="text-gray-500 mt-1">
              Create and manage your team workspaces.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
          >
            + Create Workspace
          </button>
        </div>

        {/* ================= LOADING ================= */}

        {loading && (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}

        {/* ================= WORKSPACE LIST ================= */}

        {!loading && workspaces.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace) => (
              <div key={workspace._id} className="card bg-base-100 shadow-md">
                <div className="card-body">
                  {/* Top section */}
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-lg bg-primary text-white flex items-center justify-center text-xl font-bold">
                      {workspace.name?.charAt(0).toUpperCase()}
                    </div>

                    {workspace.ownerEmail === user?.email && (
                      <span className="badge badge-success">Owner</span>
                    )}
                  </div>

                  {/* Workspace name */}
                  <h2 className="card-title mt-4">{workspace.name}</h2>

                  {/* Description */}
                  <p className="text-gray-500">
                    {workspace.description || "No description available."}
                  </p>

                  {/* Members */}
                  <div className="mt-3 text-sm text-gray-500">
                    👥 {(workspace.members?.length || 0) + 1} Member
                  </div>

                  {/* Button */}
                  <Link
                    to={`/dashboard/workspaces/${workspace._id}`}
                    className="btn btn-primary btn-sm"
                  >
                    View Workspace
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= EMPTY STATE ================= */}

        {!loading && workspaces.length === 0 && (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-700">
              No Workspaces Yet
            </h2>

            <p className="text-gray-500 mt-2">
              Create your first workspace to get started.
            </p>

            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary mt-5"
            >
              Create Workspace
            </button>
          </div>
        )}
      </div>

      {/* ================= CREATE WORKSPACE MODAL ================= */}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-gray-800">
                Create Workspace
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateWorkspace}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Workspace Name</span>
                </label>

                <input
                  type="text"
                  placeholder="Enter workspace name"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>

                <button type="submit" className="btn btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workspace;
