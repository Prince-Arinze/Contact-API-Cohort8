import { Star, Mail, Phone, MapPin, Pencil, Trash2 } from "lucide-react";
import type { Contact } from "../types/contact";
import {
  getContactId,
  getContactName,
  getContactInitials,
  isFavorite,
  normalizeTags,
} from "../utils/contactHelpers";

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
  onToggleFavorite: (id: string) => void;
  onView?: (contact: Contact) => void;
}

export default function ContactCard({
  contact,
  onEdit,
  onDelete,
  onToggleFavorite,
  onView,
}: ContactCardProps) {
  const id = getContactId(contact);
  const name = getContactName(contact);
  const favorite = isFavorite(contact);
  const tags = normalizeTags(contact.tags);

  return (
    <article
      className="contact-card"
      onClick={() => onView?.(contact)}
      style={onView ? { cursor: "pointer" } : undefined}
    >
      <div className="contact-card-top">
        <div className="contact-avatar">
          {contact.photo ? (
            <img src={contact.photo} alt={name} className="contact-avatar-img" />
          ) : (
            getContactInitials(contact)
          )}
        </div>

        <button
          type="button"
          className={`favorite-button ${favorite ? "active" : ""}`}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          title={favorite ? "Remove from favorites" : "Add to favorites"}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(id);
          }}
        >
          <Star size={16} />
        </button>
      </div>

      <div className="contact-card-content">
        <div className="contact-name">
          <h3>{name}</h3>
          {favorite && (
            <span className="favorite-badge">
              <Star size={14} />
              Favorite
            </span>
          )}
        </div>

        <div className="contact-details">
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="contact-detail"
              onClick={(e) => e.stopPropagation()}
            >
              <Mail size={15} />
              <span>{contact.email}</span>
            </a>
          )}

          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="contact-detail"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone size={15} />
              <span>{contact.phone}</span>
            </a>
          )}

          {contact.address && (
            <div className="contact-detail">
              <MapPin size={15} />
              <span>{contact.address}</span>
            </div>
          )}
        </div>

        {tags.length > 0 && (
          <div className="contact-tags">
            {tags.map((tag) => (
              <span className="contact-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="contact-card-footer">
        <button
          type="button"
          className="card-action"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(contact);
          }}
        >
          <Pencil size={15} />
          <span>Edit</span>
        </button>

        <button
          type="button"
          className="card-action danger"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(contact);
          }}
        >
          <Trash2 size={15} />
          <span>Delete</span>
        </button>
      </div>
    </article>
  );
}