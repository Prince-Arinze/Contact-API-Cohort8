import { UsersRound, Plus } from "lucide-react";
import ContactCard from "./ContactCard";
import { getContactId } from "../utils/contactHelpers";
import type { Contact, View } from "../types/contact";

interface ContactsGridProps {
  contacts: Contact[];
  view: View;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
  onToggleFavorite: (id: string) => void;
  onAddContact: () => void;
  onView?: (contact: Contact) => void;
}

export default function ContactsGrid({
  contacts,
  view,
  onEdit,
  onDelete,
  onToggleFavorite,
  onAddContact,
  onView,
}: ContactsGridProps) {
  if (!contacts.length) {
    const isFavorites = view === "favorites";

    return (
      <section className="empty-state">
        <div className="empty-icon">
          <UsersRound size={32} />
        </div>
        <h2>{isFavorites ? "No favorite contacts" : "No contacts found"}</h2>
        <p>
          {isFavorites
            ? "Contacts you mark as favorites will appear here."
            : "Try changing your search or filters, or add a new contact."}
        </p>
        <button className="btn btn-primary" onClick={onAddContact}>
          <Plus size={16} />
          <span>Add Contact</span>
        </button>
      </section>
    );
  }

  return (
    <section className="contacts-grid">
      {contacts.map((contact) => (
        <ContactCard
          key={getContactId(contact)}
          contact={contact}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
          onView={onView}
        />
      ))}
    </section>
  );
}