const TaskCard = ({ task }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h3 className="text-lg font-semibold text-gray-800">
        {task?.title || "Untitled Task"}
      </h3>

      {task?.description && (
        <p className="text-gray-500 mt-2">
          {task.description}
        </p>
      )}
    </div>
  );
};

export default TaskCard;