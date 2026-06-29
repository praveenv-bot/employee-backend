import axios from "axios";

const DeleteTaskButton = ({ taskId, onSuccess }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://employee-backend-0fnt.onrender.com/api/task/delete/${taskId}`,
      );

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button onClick={handleDelete} className="btn-delete">
      Delete
    </button>
  );
};

export default DeleteTaskButton;
