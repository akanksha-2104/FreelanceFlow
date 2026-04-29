import { getCurrentUser } from "../services/authService";

const Profile = () => {
  const user = getCurrentUser();

  return (
    <div className="container mt-4">
      <h3>My Profile</h3>

      <div className="card mt-3 p-3 shadow-sm">
        <p><strong>Name:</strong> {user?.userName}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>User ID:</strong> {user?.userId}</p>
      </div>
    </div>
  );
};

export default Profile;