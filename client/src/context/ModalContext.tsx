import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import ContactModal from "../components/ContactModal";
import { createContact, updateContact } from "../api/contacts";
import { getContactId } from "../utils/contactHelpers";
import type { AlertType, Contact, ContactFormData } from "../types/contact";

interface ModalContextValue {
  openAddModal: () => void;
  openEditModal: (contact: Contact) => void;
  refreshKey: number;
  notify: (type: AlertType, message: string) => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function useModal(): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return ctx;
}

interface ModalProviderProps {
  children: ReactNode;
  onAlert: (type: AlertType, message: string) => void;
}

export function ModalProvider({ children, onAlert }: ModalProviderProps) {
  const [contact, setContact] = useState<Contact | null>(null);
  const [open, setOpen] = useState(false);
  // Bumping this tells any mounted page (list or detail) to refetch.
  const [refreshKey, setRefreshKey] = useState(0);

  const openAddModal = useCallback(() => {
    setContact(null);
    setOpen(true);
  }, []);

  const openEditModal = useCallback((c: Contact) => {
    setContact(c);
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    setContact(null);
  }, []);

  async function handleSave(id: string | null, data: ContactFormData, photo?: File | null) {
    if (id) {
      await updateContact(id, data, photo);
    } else {
      await createContact(data, photo);
    }
    closeModal();
    setRefreshKey((k) => k + 1);
    onAlert(
      "success",
      id ? "Contact updated successfully." : "Contact created successfully.",
    );
  }

  return (
    <ModalContext.Provider value={{ openAddModal, openEditModal, refreshKey, notify: onAlert }}>
      {children}
      {open && (
        <ContactModal
          contact={contact}
          onClose={closeModal}
          onSave={handleSave}
          key={contact ? getContactId(contact) : "new"}
        />
      )}
    </ModalContext.Provider>
  );
}