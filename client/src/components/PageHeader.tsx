import { Plus } from "lucide-react";
import type { View } from "../types/contact";

interface PageHeaderProps {
  view: View;
  onAddContact: () => void;
}

export default function PageHeader({ view, onAddContact }: PageHeaderProps) {
  const isFavorites = view === "favorites";

  return (
    <section className="page-header">
      <div className="page-heading">
        <p className="eyebrow">
          {isFavorites ? "FAVORITES" : "CONTACT MANAGEMENT"}
        </p>
        <h1>{isFavorites ? "Favorite Contacts" : "My Contacts"}</h1>
        <p className="page-description">
          {isFavorites
            ? "Quick access to the people you care about most."
            : "Manage and organize all your contacts in one place."}
        </p>
      </div>

      <button className="btn btn-primary desktop-add" onClick={onAddContact}>
        <Plus size={16} />
        <span>Add Contact</span>
      </button>
    </section>
  );
}