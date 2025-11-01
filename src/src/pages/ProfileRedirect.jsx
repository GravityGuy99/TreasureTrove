import { Navigate } from "react-router-dom";
import { useUser } from "../components/GetUser.jsx";

export function ProfileRedirect() {
  const userId = useUser()

  // if not logged in, redirect to login page
  if (!userId) return <Navigate to="/login" replace={true} />

  // redirect to user's page
  return <Navigate to={`/user/${userId}`} replace={true} />
}