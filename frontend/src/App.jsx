import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { IssueProvider } from "./context/IssueContext";
import { NotificationProvider } from "./context/NotificationContext";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <IssueProvider>
          <AppRoutes />
        </IssueProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;