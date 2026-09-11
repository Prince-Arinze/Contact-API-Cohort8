import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Alert from "./components/Alert";
import ContactsListPage from "./pages/ContactsListPage";
import ContactDetailPage from "./pages/ContactDetailPage";
import { ModalProvider } from "./context/ModalContext";
import { ConfirmProvider } from "./context/ConfirmContext";
import type { AlertState } from "./types/contact";

export default function App() {
  const [alert, setAlert] = useState<AlertState | null>(null);

  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => setAlert(null), 4500);
    return () => clearTimeout(timer);
  }, [alert]);

  return (
    <ConfirmProvider>
      <ModalProvider onAlert={(type, message) => setAlert({ type, message })}>
        <Navbar />

        {alert && (
          <div className="container">
            <Alert message={alert.message} type={alert.type} />
          </div>
        )}

        <Routes>
          <Route path="/" element={<ContactsListPage favoritesOnly={false} />} />
          <Route path="/contacts" element={<ContactsListPage favoritesOnly={false} />} />
          <Route path="/favorites" element={<ContactsListPage favoritesOnly={true} />} />
          <Route path="/contacts/:id" element={<ContactDetailPage />} />
        </Routes>
      </ModalProvider>
    </ConfirmProvider>
  );
}