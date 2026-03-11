const { updateProfile } = useContext(AuthContext);

const handleUpdate = async () => {
  try {
    await updateProfile({ newEmail: "new@example.com", newPassword: "newPass123" });
    alert("Profile updated successfully! Cart and API calls now work.");
  } catch (err) {
    alert("Update failed: " + err.message);
  }
};