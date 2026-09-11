import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Pencil, Trash2, Star } from "lucide-react";
import { getContact, deleteContact } from "../api/contacts";
import { useModal } from "../context/ModalContext";
import { useConfirm } from "../context/ConfirmContext";
import {
  getContactInitials,
  getContactName,
  isFavorite,
  normalizeTags,
} from "../utils/contactHelpers";
import type { Contact } from "../types/contact";

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { openEditModal, refreshKey, notify } = useModal();
  const confirm = useConfirm();

  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setNotFound(false);

    getContact(id)
      .then(setContact)
      .catch((err) => {
        setNotFound(true);
        notify("error", err instanceof Error ? err.message : "Unable to load contact.");
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, refreshKey]);

  async function handleDelete() {
    if (!contact || !id) return;
    const confirmed = await confirm({
      title: "Delete contact",
      message: `Are you sure you want to delete ${getContactName(contact)}? This can't be undone.`,
      confirmLabel: "Delete",
      danger: true,
    });
    if (!confirmed) return;

    try {
      await deleteContact(id);
      notify("success", "Contact deleted successfully.");
      navigate("/contacts");
    } catch (err) {
      notify("error", err instanceof Error ? err.message : "Unable to delete contact.");
    }
  }

  if (loading) {
    return (
      <main className="container">
        <p>Loading...</p>
      </main>
    );
  }

  if (notFound || !contact) {
    return (
      <main className="container">
        <Link to="/contacts" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to contacts</span>
        </Link>
        <p>Contact not found.</p>
      </main>
    );
  }

  const tags = normalizeTags(contact.tags);
  const favorite = isFavorite(contact);

  return (
    <main className="container">
      <Link to="/contacts" className="back-link">
        <ArrowLeft size={16} />
        <span>Back to contacts</span>
      </Link>

      <div className="detail-card">
        <div className="detail-header">
          <div className="contact-avatar large">
            {contact.photo ? (
              <img src={contact.photo} alt={getContactName(contact)} className="contact-avatar-img" />
            ) : (
              getContactInitials(contact)
            )}
          </div>
          <div>
            <h1>{getContactName(contact)}</h1>
            {favorite && (
              <span className="favorite-badge">
                <Star size={14} />
                Favorite
              </span>
            )}
          </div>
        </div>

        <div className="detail-body">
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="contact-detail">
              <Mail size={16} />
              <span>{contact.email}</span>
            </a>
          )}

          {contact.phone && (
            <a href={`tel:${contact.phone}`} className="contact-detail">
              <Phone size={16} />
              <span>{contact.phone}</span>
            </a>
          )}

          {contact.address && (
            <div className="contact-detail">
              <MapPin size={16} />
              <span>{contact.address}</span>
            </div>
          )}

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

        <div className="detail-actions">
          <button className="btn btn-secondary" onClick={() => openEditModal(contact)}>
            <Pencil size={16} />
            <span>Edit</span>
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </main>
  );
}