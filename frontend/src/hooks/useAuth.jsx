import { useAuthContext } from "../context/AuthContext";
import { login } from "../api/authApi";

const useAuth = () => {
  const { user, loginUser, logoutUser } = useAuthContext();

  const handleLogin = async (data) => {
    const res = await login(data);
    loginUser(res.data.token);
  };

  return { user, handleLogin, logoutUser };
};

export default useAuth;