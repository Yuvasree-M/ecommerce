import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";

const Profile = () => {

  const { user, role } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="pt-32 text-center">
        <p>Please login</p>
      </div>
    );
  }

  return (

    <div className="min-h-screen pt-28 flex justify-center">

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-[350px] text-center">

        <FaUserCircle size={80} className="mx-auto text-green-500 mb-4" />

        <h2 className="text-xl font-bold mb-2">{user.name}</h2>

        <p className="text-gray-600">{user.email}</p>

        <p className="mt-3 text-sm">
          Role:
          <span className="ml-2 font-semibold text-green-600">
            {role}
          </span>
        </p>

      </div>

    </div>

  );

};

export default Profile;