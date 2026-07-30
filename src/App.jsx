import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { SocketProvider } from "@/contexts/SocketContext";
import { ConversationsProvider } from "@/contexts/ConversationsContext";
import AppRouter from "./router";

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <ConversationsProvider>
          <ToastProvider>
            <ThemeProvider>
              <AppRouter />
            </ThemeProvider>
          </ToastProvider>
        </ConversationsProvider>
      </SocketProvider>
    </AuthProvider>
  );
}
