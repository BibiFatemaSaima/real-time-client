import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Boards = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBoards = async () => {
      try {
        const response = await axios.get(
          "https://real-time-server-project3.vercel.app/boards/all",
        );

        setBoards(response.data);
      } catch (error) {
        console.error("Failed to load boards:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBoards();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <Link to="/dashboard" className="btn btn-ghost mb-6">
          ← Back to Dashboard
        </Link>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">All Boards</h1>

          <p className="text-gray-500 mt-2">
            View and manage your project boards.
          </p>
        </div>

        {boards.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center">
            <div className="text-5xl mb-4">📋</div>

            <h2 className="text-xl font-semibold text-gray-700">
              No Boards Yet
            </h2>

            <p className="text-gray-500 mt-2">
              Create a board from your workspace.
            </p>

            <Link to="/dashboard/workspaces" className="btn btn-primary mt-5">
              My Workspaces
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.map((board) => (
              <div
                key={board._id}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h2 className="text-xl font-bold text-gray-800">
                  {board.name}
                </h2>

                <p className="text-gray-500 mt-2">
                  {board.description || "No description available."}
                </p>

                <Link
                  to={`/dashboard/boards/${board._id}`}
                  className="btn btn-primary btn-sm mt-5"
                >
                  Open Board
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Boards;
