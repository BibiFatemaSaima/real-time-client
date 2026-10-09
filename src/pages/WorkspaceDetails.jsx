import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const WorkspaceDetails = () => {
  const { id } = useParams();

  const [workspace, setWorkspace] = useState(null);
  const [boards, setBoards] = useState([]);
  const [workspaceLoading, setWorkspaceLoading] = useState(true);
  const [boardsLoading, setBoardsLoading] = useState(true);

  // Create Board
  const [showModal, setShowModal] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [boardDescription, setBoardDescription] = useState("");

  // Edit Board
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [editBoardName, setEditBoardName] = useState("");
  const [editBoardDescription, setEditBoardDescription] = useState("");

  // Load Workspace
  useEffect(() => {
    const loadWorkspace = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/workspaces/${id}`,
        );

        setWorkspace(response.data);
      } catch (error) {
        console.error("Failed to load workspace:", error);
      } finally {
        setWorkspaceLoading(false);
      }
    };

    loadWorkspace();
  }, [id]);

  // Load Boards
  const loadBoards = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/boards?workspaceId=${id}`,
      );

      setBoards(response.data);
    } catch (error) {
      console.error("Failed to load boards:", error);
    } finally {
      setBoardsLoading(false);
    }
  };

  useEffect(() => {
    loadBoards();
  }, [id]);

  // Create Board
  const handleCreateBoard = async (e) => {
    e.preventDefault();

    if (!boardName.trim()) {
      return;
    }

    const boardData = {
      name: boardName,
      description: boardDescription,
      workspaceId: id,
      ownerEmail: workspace?.ownerEmail || "",
    };

    try {
      await axios.post("http://localhost:3000/boards", boardData);

      await loadBoards();

      setBoardName("");
      setBoardDescription("");
      setShowModal(false);
    } catch (error) {
      console.error("Failed to create board:", error);
    }
  };

  // Open Edit Modal
  const handleEdit = (board) => {
    setSelectedBoard(board);
    setEditBoardName(board.name);
    setEditBoardDescription(board.description || "");
    setShowEditModal(true);
  };

  // Update Board
  const handleUpdateBoard = async () => {
    if (!editBoardName.trim()) {
      alert("Board name is required");
      return;
    }

    try {
      await axios.put(`http://localhost:3000/boards/${selectedBoard._id}`, {
        name: editBoardName,
        description: editBoardDescription,
      });

      alert("Board updated successfully");

      setShowEditModal(false);
      setSelectedBoard(null);

      await loadBoards();
    } catch (error) {
      console.error("Failed to update board:", error);
      alert("Failed to update board");
    }
  };

  // Delete Board
  const handleDelete = async (boardId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this board?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/boards/${boardId}`);

      alert("Board deleted successfully");

      await loadBoards();
    } catch (error) {
      console.error("Failed to delete board:", error);
      alert("Failed to delete board");
    }
  };

  if (workspaceLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-gray-700">
          Workspace Not Found
        </h2>

        <Link to="/dashboard/workspaces" className="btn btn-primary mt-5">
          Back to Workspaces
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/dashboard/workspaces" className="btn btn-ghost mb-6">
          ← Back to Workspaces
        </Link>

        {/* Workspace Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-primary text-white flex items-center justify-center text-2xl font-bold">
                {workspace.name?.charAt(0).toUpperCase()}
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {workspace.name}
                </h1>

                <p className="text-gray-500 mt-1">
                  {workspace.description || "No description available."}
                </p>
              </div>
            </div>

            {workspace.ownerEmail && (
              <div className="text-sm text-gray-500">
                Owner:{" "}
                <span className="font-medium text-gray-700">
                  {workspace.ownerEmail}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Boards Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Boards</h2>

              <p className="text-gray-500 mt-1">
                Manage your workspace boards.
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary"
            >
              + Create Board
            </button>
          </div>

          {/* Boards Loading */}
          {boardsLoading && (
            <div className="flex justify-center py-10">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          )}

          {/* Boards */}
          {!boardsLoading && boards.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boards.map((board) => (
                <div
                  key={board._id}
                  className="card bg-base-100 border border-gray-200 shadow-sm"
                >
                  <div className="card-body">
                    <div className="w-12 h-12 rounded-lg bg-secondary text-white flex items-center justify-center text-xl font-bold">
                      {board.name?.charAt(0).toUpperCase()}
                    </div>

                    <h2 className="card-title mt-3">{board.name}</h2>

                    <p className="text-gray-500">
                      {board.description || "No description available."}
                    </p>

                    {/* Board Buttons */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Link
                        to={`/dashboard/boards/${board._id}`}
                        className="btn btn-primary btn-sm"
                      >
                        Open Board
                      </Link>

                      <button
                        onClick={() => handleEdit(board)}
                        className="btn btn-warning btn-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(board._id)}
                        className="btn btn-error btn-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Boards */}
          {!boardsLoading && boards.length === 0 && (
            <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
              <div className="text-5xl mb-4">📋</div>

              <h3 className="text-xl font-semibold text-gray-700">
                No Boards Yet
              </h3>

              <p className="text-gray-500 mt-2">
                Create your first board to start managing tasks.
              </p>

              <button
                onClick={() => setShowModal(true)}
                className="btn btn-primary mt-5"
              >
                Create Board
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= CREATE BOARD MODAL ================= */}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-gray-800">Create Board</h2>

              <button
                onClick={() => setShowModal(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBoard}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Board Name</span>
                </label>

                <input
                  type="text"
                  placeholder="Enter board name"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text font-medium">Description</span>
                </label>

                <textarea
                  placeholder="Enter board description"
                  value={boardDescription}
                  onChange={(e) => setBoardDescription(e.target.value)}
                  className="textarea textarea-bordered w-full"
                  rows="3"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>

                <button type="submit" className="btn btn-primary">
                  Create Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT BOARD MODAL ================= */}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-gray-800">Edit Board</h2>

              <button
                onClick={() => setShowEditModal(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Board Name</span>
              </label>

              <input
                type="text"
                value={editBoardName}
                onChange={(e) => setEditBoardName(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Enter board name"
              />
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text font-medium">Description</span>
              </label>

              <textarea
                value={editBoardDescription}
                onChange={(e) => setEditBoardDescription(e.target.value)}
                className="textarea textarea-bordered w-full"
                placeholder="Enter board description"
                rows="4"
              ></textarea>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>

              <button onClick={handleUpdateBoard} className="btn btn-primary">
                Update Board
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceDetails;
