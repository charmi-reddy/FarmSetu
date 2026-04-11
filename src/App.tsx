import { useWallet } from "./hooks/useWallet";
import { useAuth } from "./hooks/useAuth";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import "./index.css";

function App() {
  const wallet = useWallet();
  const { isLoggedIn } = useAuth();

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <LoginPage />;
  }

  // Show dashboard if logged in
  return <Dashboard wallet={wallet} />;
}

export default App;
