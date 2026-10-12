import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import {
  DndContext,
  closestCenter,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

const BoardDetails = () => {
  const { id } = useParams();

  const [socket, setSocket] = useState(null);

  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState({});
  const [loading, setLoading] = useState(true);
  const [listsLoading, setListsLoading] = useState(true);

  // Create List
  const [showModal, setShowModal] = useState(false);
  const [listName, setListName] = useState("");

  // Create Card
  const [showCardModal, setShowCardModal] = useState(false);
  const [selectedListId, setSelectedListId] = useState(null);
  const [cardTitle, setCardTitle] = useState("");
  const [cardDescription, setCardDescription] = useState("");

  // Card Details
  const [selectedCard, setSelectedCard] = useState(null);
  const [showCardDetails, setShowCardDetails] = useState(false);

  // Card Details fields
  const [dueDate, setDueDate] = useState("");
  const [labels, setLabels] = useState([]);
  const [labelInput, setLabelInput] = useState("");
  const [assignee, setAssignee] = useState("");

  // Activity Log
  const [activities, setActivities] = useState([]);
  // Comments log
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  // Edit List
  const [editingList, setEditingList] = useState(null);
  const [editListName, setEditListName] = useState("");

  // Edit Card
  const [editingCard, setEditingCard] = useState(null);
  const [editCardTitle, setEditCardTitle] = useState("");
  const [editCardDescription, setEditCardDescription] = useState("");
  const [editCardDueDate, setEditCardDueDate] = useState("");
  const [editCardLabels, setEditCardLabels] = useState([]);
  const [editCardLabelInput, setEditCardLabelInput] = useState("");
  const [editCardAssignee, setEditCardAssignee] = useState("");

  // =========================
  // Load Board
  // =========================
  useEffect(() => {
    const loadBoard = async () => {
      try {
        const response = await axios.get(
          `https://real-time-server-project3.vercel.app/boards/${id}`,
        );

        setBoard(response.data);
      } catch (error) {
        console.error("Failed to load board:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBoard();
  }, [id]);

  // =========================
  // Socket.io
  // =========================
  useEffect(() => {
    const newSocket = io("https://real-time-server-project3.vercel.app", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      newSocket.emit("join-board", id);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection failed:", error.message);
    });

    newSocket.on("card-created", (newCard) => {
      setCards((prev) => {
        const listCards = prev[newCard.listId] || [];

        if (listCards.some((card) => card._id === newCard._id)) {
          return prev;
        }

        return {
          ...prev,
          [newCard.listId]: [...listCards, newCard],
        };
      });
    });

    newSocket.on("card-updated", (updatedCard) => {
      setCards((prev) => {
        const updated = { ...prev };

        Object.keys(updated).forEach((listId) => {
          updated[listId] = updated[listId].filter(
            (card) => card._id !== updatedCard._id,
          );
        });

        if (!updated[updatedCard.listId]) {
          updated[updatedCard.listId] = [];
        }

        updated[updatedCard.listId] = [
          ...updated[updatedCard.listId],
          updatedCard,
        ];

        return updated;
      });
    });

    newSocket.on("card-deleted", (deletedCard) => {
      setCards((prev) => {
        const updated = { ...prev };

        Object.keys(updated).forEach((listId) => {
          updated[listId] = updated[listId].filter(
            (card) => card._id !== deletedCard._id,
          );
        });

        return updated;
      });
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [id]);

  // =========================
  // Load Lists
  // =========================
  const loadLists = async () => {
    try {
      setListsLoading(true);

      const response = await axios.get(
        `https://real-time-server-project3.vercel.app/lists?boardId=${id}`,
      );

      const loadedLists = response.data;

      setLists(loadedLists);

      const cardData = {};

      for (const list of loadedLists) {
        try {
          const cardResponse = await axios.get(
            `https://real-time-server-project3.vercel.app/cards?listId=${list._id}`,
          );

          cardData[list._id] = cardResponse.data;
        } catch (error) {
          console.error(`Failed to load cards for list ${list._id}:`, error);

          cardData[list._id] = [];
        }
      }

      setCards(cardData);
    } catch (error) {
      console.error("Failed to load lists:", error);
    } finally {
      setListsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadLists();
    }
  }, [id]);

  // =========================
  // Load Activities
  // =========================
  const loadActivities = async () => {
    try {
      const response = await axios.get(
        `https://real-time-server-project3.vercel.app/activities?boardId=${id}`,
      );

      setActivities(response.data);
    } catch (error) {
      console.error("Failed to load activities:", error);
    }
  };

  useEffect(() => {
    if (id) {
      loadActivities();
    }
  }, [id]);
  // Load Comments
  const loadComments = async (cardId) => {
    try {
      const response = await axios.get(
        `https://real-time-server-project3.vercel.app/comments?cardId=${cardId}`,
      );

      setComments(response.data);
    } catch (error) {
      console.error("Failed to load comments:", error);
    }
  };
  // =========================
  // Create List
  // =========================
  const handleCreateList = async (e) => {
    e.preventDefault();

    if (!listName.trim()) {
      return;
    }

    try {
      await axios.post("https://real-time-server-project3.vercel.app/lists", {
        name: listName,
        boardId: id,
      });

      setListName("");
      setShowModal(false);

      loadLists();
      loadActivities();
    } catch (error) {
      console.error("Failed to create list:", error);
    }
  };

  // =========================
  // Edit List
  // =========================
  const handleEditList = (list) => {
    setEditingList(list);
    setEditListName(list.name);
  };

  const handleUpdateList = async (e) => {
    e.preventDefault();

    if (!editListName.trim()) {
      return;
    }

    try {
      await axios.put(
        `https://real-time-server-project3.vercel.app/lists/${editingList._id}`,
        {
          name: editListName,
        },
      );

      setEditingList(null);
      setEditListName("");

      loadLists();
      loadActivities();
    } catch (error) {
      console.error("Failed to update list:", error);
    }
  };

  // =========================
  // Delete List
  // =========================
  const handleDeleteList = async (listId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this list?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(
        `https://real-time-server-project3.vercel.app/lists/${listId}`,
      );

      loadLists();
      loadActivities();
    } catch (error) {
      console.error("Failed to delete list:", error);
    }
  };

  // =========================
  // Open Create Card Modal
  // =========================
  const handleOpenCardModal = (listId) => {
    setSelectedListId(listId);
    setCardTitle("");
    setCardDescription("");
    setShowCardModal(true);
  };

  // =========================
  // Create Card
  // =========================
  const handleCreateCard = async (e) => {
    e.preventDefault();

    if (!cardTitle.trim()) {
      return;
    }

    try {
      await axios.post("https://real-time-server-project3.vercel.app/cards", {
        title: cardTitle,
        description: cardDescription,
        listId: selectedListId,
        boardId: id,
        labels: [],
      });

      setCardTitle("");
      setCardDescription("");
      setSelectedListId(null);
      setShowCardModal(false);

      loadLists();
      loadActivities();
    } catch (error) {
      console.error("Failed to create card:", error);
    }
  };

  // =========================
  // Open Card Details
  // =========================
  const handleCardClick = (card) => {
    setSelectedCard(card);
    loadComments(card._id);
    setCommentText("");
    setDueDate(card.dueDate || "");
    setLabels(card.labels || []);
    setAssignee(card.assignee || "");

    setShowCardDetails(true);
  };
  // Add Comment
  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim() || !selectedCard) return;

    try {
      await axios.post(
        "https://real-time-server-project3.vercel.app/comments",
        {
          cardId: selectedCard._id,
          boardId: id,
          text: commentText.trim(),
        },
      );

      setCommentText("");
      await loadComments(selectedCard._id);
      await loadActivities();
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("Failed to add comment");
    }
  };
  // =========================
  // Update Card Details
  // =========================
  const handleUpdateDueDate = async () => {
    if (!selectedCard) {
      return;
    }

    try {
      await axios.put(
        `https://real-time-server-project3.vercel.app/cards/${selectedCard._id}`,
        {
          dueDate,
          labels,
          assignee,
        },
      );

      setShowCardDetails(false);
      setSelectedCard(null);

      loadLists();
      loadActivities();
    } catch (error) {
      console.error("Failed to update card details:", error);
    }
  };
  // Add Label - Card Details
  const handleAddLabel = () => {
    if (!labelInput.trim()) {
      return;
    }

    setLabels((prev) => [...prev, labelInput.trim()]);
    setLabelInput("");
  };
  // Remove Label - Card Details
  const handleRemoveLabel = (label) => {
    setLabels((prev) => prev.filter((item) => item !== label));
  };
  // Open Edit Card Modal
  const handleEditCard = (card) => {
    setEditingCard(card);

    setEditCardTitle(card.title || "");
    setEditCardDescription(card.description || "");
    setEditCardDueDate(card.dueDate || "");
    setEditCardLabels(card.labels || []);
    setEditCardAssignee(card.assignee || "");

    setEditCardLabelInput("");
  };
  // Add Label - Edit Card
  const handleAddEditCardLabel = () => {
    if (!editCardLabelInput.trim()) {
      return;
    }

    setEditCardLabels((prev) => [...prev, editCardLabelInput.trim()]);

    setEditCardLabelInput("");
  };
  // Remove Label - Edit Card
  const handleRemoveEditCardLabel = (label) => {
    setEditCardLabels((prev) => prev.filter((item) => item !== label));
  };
  // Update Card
  const handleUpdateCard = async (e) => {
    e.preventDefault();

    if (!editingCard) {
      return;
    }

    if (!editCardTitle.trim()) {
      return;
    }

    try {
      await axios.put(
        `https://real-time-server-project3.vercel.app/cards/${editingCard._id}`,
        {
          title: editCardTitle,
          description: editCardDescription,
          dueDate: editCardDueDate,
          labels: editCardLabels,
          assignee: editCardAssignee,
        },
      );

      setEditingCard(null);

      loadLists();
      loadActivities();
    } catch (error) {
      console.error("Failed to update card:", error);
    }
  };
  // Delete Card
  const handleDeleteCard = async (card) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${card.title}"?`,
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(
        `https://real-time-server-project3.vercel.app/cards/${card._id}`,
      );

      setSelectedCard(null);
      setShowCardDetails(false);
      setEditingCard(null);

      loadLists();
      loadActivities();
    } catch (error) {
      console.error("Failed to delete card:", error);
    }
  };
  // Drag & Drop
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const cardId = active.id;
    const newListId = over.id;

    let oldListId = null;

    Object.entries(cards).forEach(([listId, listCards]) => {
      const foundCard = listCards.find((card) => card._id === cardId);

      if (foundCard) {
        oldListId = listId;
      }
    });

    if (!oldListId || oldListId === newListId) {
      return;
    }

    try {
      await axios.put(
        `https://real-time-server-project3.vercel.app/cards/${cardId}`,
        {
          listId: newListId,
        },
      );

      loadLists();
      loadActivities();
    } catch (error) {
      console.error("Failed to move card:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl font-bold">Board not found</h2>

        <Link to="/dashboard/boards" className="btn btn-primary mt-4">
          Back to Boards
        </Link>
      </div>
    );
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-base-200 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="breadcrumbs text-sm mb-2">
              <ul>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>

                <li>
                  <Link to="/dashboard/boards">Boards</Link>
                </li>

                <li>{board.title}</li>
              </ul>
            </div>

            <h1 className="text-3xl font-bold">{board.title}</h1>

            {board.description && (
              <p className="text-gray-500 mt-2">{board.description}</p>
            )}
          </div>

          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            + Add List
          </button>
        </div>

        {/* Lists */}
        {listsLoading ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : lists.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold">No Lists Yet</h2>

            <p className="text-gray-500 mt-2">
              Create your first list to start adding cards.
            </p>
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-6">
            {lists.map((list) => (
              <ListColumn
                key={list._id}
                list={list}
                cards={cards[list._id] || []}
                onCreateCard={handleOpenCardModal}
                onCardClick={handleCardClick}
                onEditCard={handleEditCard}
                onDeleteCard={handleDeleteCard}
                onEditList={handleEditList}
                onDeleteList={handleDeleteList}
              />
            ))}
          </div>
        )}

        {/* Activity Log */}
        <div className="mt-10">
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title mb-4">Activity Log</h2>

              {activities.length === 0 ? (
                <p className="text-gray-500">No activities yet.</p>
              ) : (
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <div
                      key={activity._id}
                      className="border-b border-base-300 pb-2"
                    >
                      <p>{activity.message}</p>

                      <p className="text-xs text-gray-500 mt-1">
                        {activity.createdAt
                          ? new Date(activity.createdAt).toLocaleString()
                          : ""}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================= */}
        {/* Create List Modal */}
        {/* ========================= */}
        {showModal && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Create New List</h3>

              <form onSubmit={handleCreateList}>
                <input
                  type="text"
                  placeholder="List name"
                  className="input input-bordered w-full"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                />

                <div className="modal-action">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="btn btn-primary">
                    Create List
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================= */}
        {/* Create Card Modal */}
        {/* ========================= */}
        {showCardModal && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Create New Card</h3>

              <form onSubmit={handleCreateCard}>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Card Title</span>
                  </label>

                  <input
                    type="text"
                    placeholder="Enter card title"
                    className="input input-bordered w-full"
                    value={cardTitle}
                    onChange={(e) => setCardTitle(e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>

                  <textarea
                    placeholder="Enter description"
                    className="textarea textarea-bordered w-full"
                    value={cardDescription}
                    onChange={(e) => setCardDescription(e.target.value)}
                  ></textarea>
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setShowCardModal(false)}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="btn btn-primary">
                    Create Card
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================= */}
        {/* Edit List Modal */}
        {/* ========================= */}
        {editingList && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Edit List</h3>

              <form onSubmit={handleUpdateList}>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={editListName}
                  onChange={(e) => setEditListName(e.target.value)}
                />

                <div className="modal-action">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setEditingList(null)}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================= */}
        {/* Card Details Modal */}
        {/* ========================= */}
        {showCardDetails && selectedCard && (
          <div className="modal modal-open">
            <div className="modal-box max-w-2xl">
              <h3 className="font-bold text-2xl mb-5">Card Details</h3>

              {/* Title */}
              <div className="mb-4">
                <h4 className="font-semibold">Title</h4>

                <p className="mt-1">{selectedCard.title}</p>
              </div>

              {/* Description */}
              <div className="mb-4">
                <h4 className="font-semibold">Description</h4>

                <p className="mt-1">
                  {selectedCard.description || "No description"}
                </p>
              </div>

              {/* Labels */}
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Labels</h4>

                <div className="flex flex-wrap gap-2 mb-3">
                  {labels.map((label) => (
                    <div key={label} className="badge badge-primary gap-2">
                      {label}

                      <button
                        type="button"
                        onClick={() => handleRemoveLabel(label)}
                        className="text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add label"
                    className="input input-bordered flex-1"
                    value={labelInput}
                    onChange={(e) => setLabelInput(e.target.value)}
                  />

                  <button
                    type="button"
                    className="btn"
                    onClick={handleAddLabel}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Assignee */}
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Assignee</h4>

                <input
                  type="text"
                  placeholder="Assignee"
                  className="input input-bordered w-full"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                />
              </div>

              {/* Due Date */}
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Due Date</h4>

                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div className="modal-action flex-wrap">
                <button
                  type="button"
                  className="btn btn-error text-white"
                  onClick={() => handleDeleteCard(selectedCard)}
                >
                  Delete Card
                </button>

                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setShowCardDetails(false);
                    setSelectedCard(null);
                  }}
                >
                  Close
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdateDueDate}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================= */}
        {/* Edit Card Modal */}
        {/* ========================= */}
        {editingCard && (
          <div className="modal modal-open">
            <div className="modal-box max-w-2xl">
              <h3 className="font-bold text-2xl mb-5">Edit Card</h3>

              <form onSubmit={handleUpdateCard}>
                {/* Title */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-semibold">Title</span>
                  </label>

                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={editCardTitle}
                    onChange={(e) => setEditCardTitle(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Description
                    </span>
                  </label>

                  <textarea
                    className="textarea textarea-bordered w-full"
                    value={editCardDescription}
                    onChange={(e) => setEditCardDescription(e.target.value)}
                  ></textarea>
                </div>

                {/* Due Date */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-semibold">Due Date</span>
                  </label>

                  <input
                    type="date"
                    className="input input-bordered w-full"
                    value={editCardDueDate}
                    onChange={(e) => setEditCardDueDate(e.target.value)}
                  />
                </div>
                {/* Comments */}
                <div className="mb-5">
                  <label className="label">
                    <span className="label-text font-semibold">Comments</span>
                  </label>

                  <div className="space-y-2 mb-4">
                    {comments.length > 0 ? (
                      comments.map((comment) => (
                        <div
                          key={comment._id}
                          className="bg-gray-100 rounded-lg p-3"
                        >
                          <p className="text-gray-700">{comment.text}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(comment.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No comments yet.</p>
                    )}
                  </div>

                  <form onSubmit={handleAddComment}>
                    <textarea
                      className="textarea textarea-bordered w-full"
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />

                    <button
                      type="submit"
                      className="btn btn-primary btn-sm mt-2"
                    >
                      Add Comment
                    </button>
                  </form>
                </div>
                {/* Labels */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-semibold">Labels</span>
                  </label>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {editCardLabels.map((label) => (
                      <div key={label} className="badge badge-primary gap-2">
                        {label}

                        <button
                          type="button"
                          onClick={() => handleRemoveEditCardLabel(label)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add label"
                      className="input input-bordered flex-1"
                      value={editCardLabelInput}
                      onChange={(e) => setEditCardLabelInput(e.target.value)}
                    />

                    <button
                      type="button"
                      className="btn"
                      onClick={handleAddEditCardLabel}
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Assignee */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-semibold">Assignee</span>
                  </label>

                  <input
                    type="text"
                    placeholder="Assignee"
                    className="input input-bordered w-full"
                    value={editCardAssignee}
                    onChange={(e) => setEditCardAssignee(e.target.value)}
                  />
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setEditingCard(null)}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DndContext>
  );
};

// ==========================================
// List Column
// ==========================================
const ListColumn = ({
  list,
  cards,
  onCreateCard,
  onCardClick,
  onEditCard,
  onDeleteCard,
  onEditList,
  onDeleteList,
}) => {
  const { setNodeRef } = useDroppable({
    id: list._id,
  });

  return (
    <div
      ref={setNodeRef}
      className="w-80 min-w-80 bg-base-100 rounded-xl shadow-md p-4"
    >
      {/* List Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">{list.name}</h2>

        <div className="dropdown dropdown-end">
          <button tabIndex={0} className="btn btn-ghost btn-sm">
            ⋮
          </button>

          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-36 p-2 shadow"
          >
            <li>
              <button onClick={() => onEditList(list)}>Edit List</button>
            </li>

            <li>
              <button
                className="text-error"
                onClick={() => onDeleteList(list._id)}
              >
                Delete List
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Add Card */}
      <button
        className="btn btn-outline btn-sm w-full mb-4"
        onClick={() => onCreateCard(list._id)}
      >
        + Add Card
      </button>

      {/* Cards */}
      <div className="space-y-3 min-h-20">
        {cards.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No cards yet</p>
        ) : (
          cards.map((card) => (
            <CardItem
              key={card._id}
              card={card}
              onClick={onCardClick}
              onEdit={onEditCard}
              onDelete={onDeleteCard}
            />
          ))
        )}
      </div>
    </div>
  );
};

// ==========================================
// Card Item
// ==========================================
const CardItem = ({ card, onClick, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: card._id,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`card bg-base-200 shadow-sm ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="card-body p-4">
        {/* Drag Handle */}
        <div {...listeners} className="cursor-grab text-gray-400 text-sm mb-2">
          ⋮⋮ Drag
        </div>

        {/* Title */}
        <h3 className="font-semibold">{card.title}</h3>

        {/* Description */}
        {card.description && (
          <p className="text-sm text-gray-500">{card.description}</p>
        )}

        {/* Labels */}
        {card.labels && card.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {card.labels.map((label) => (
              <span key={label} className="badge badge-primary badge-sm">
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Assignee */}
        {card.assignee && (
          <p className="text-xs text-gray-500 mt-2">
            Assignee: {card.assignee}
          </p>
        )}

        {/* Due Date */}
        {card.dueDate && (
          <p className="text-xs text-gray-500 mt-1">Due: {card.dueDate}</p>
        )}

        {/* Buttons */}
        <div className="flex gap-2 mt-3">
          <button
            className="btn btn-primary btn-xs flex-1"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onClick(card)}
          >
            View Details
          </button>

          <button
            className="btn btn-warning btn-xs"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onEdit(card)}
          >
            Edit
          </button>

          <button
            className="btn btn-error btn-xs text-white"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onDelete(card)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardDetails;
