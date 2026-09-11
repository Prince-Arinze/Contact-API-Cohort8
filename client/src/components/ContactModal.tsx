import { useEffect, useState, type FormEvent } from "react";
import {
  UserPlus,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Tags,
  Check,
  Star,
  Save,
  ImagePlus,
} from "lucide-react";
import { isFavorite, normalizeTags } from "../utils/contactHelpers";
import type { Contact, ContactFormData } from "../types/contact";

interface ContactModalProps {
  contact: Contact | null;
  onClose: () => void;
  onSave: (id: string | null, data: ContactFormData, photo?: File | null) => Promise<void>;
}

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  tags: string; // comma-separated string while editing
  favorite: boolean;
}

const emptyFormState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  tags: "",
  favorite: false,
};

export default function ContactModal({ contact, onClose, onSave }: ContactModalProps) {
  const [form, setForm] = useState<FormState>(emptyFormState);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const isEditing = Boolean(contact);

  useEffect(() => {
    if (contact) {
      setForm({
        firstName: contact.firstName || "",
        lastName: contact.lastName || "",
        email: contact.email || "",
        phone: contact.phone || "",
        address: contact.address || "",
        tags: normalizeTags(contact.tags).join(", "),
        favorite: isFavorite(contact),
      });
      setPreview(contact.photo || null);
    } else {
      setForm(emptyFormState);
      setPreview(null);
    }
    setPhotoFile(null);
    setError("");
  }, [contact]);

  // Clean up the object URL we create for local previews so it doesn't leak.
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeydown);
    document.body.classList.add("modal-open");

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.body.classList.remove("modal-open");
    };
  }, [onClose]);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    setError("");
    setPhotoFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const data: ContactFormData = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      favorite: form.favorite,
    };

    if (!data.firstName) return setError("First name is required.");
    if (!data.lastName) return setError("Last name is required.");
    if (!data.phone) return setError("Phone number is required.");

    setSaving(true);
    try {
      await onSave(isEditing && contact ? (contact._id || contact.id || null) : null, data, photoFile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save contact.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <div className="modal-icon">
              <UserPlus size={20} />
            </div>
            <p className="eyebrow">CONTACT</p>
            <h2>{isEditing ? "Edit Contact" : "Add Contact"}</h2>
            <p className="modal-description">
              Add someone's details to your contacts.
            </p>
          </div>
          <button
            className="close-modal"
            type="button"
            aria-label="Close modal"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} id="contactForm">
          <div className="form-grid">
            <div className="form-field full-width">
              <label htmlFor="photo">Photo</label>
              <label htmlFor="photo" className="photo-upload">
                {preview ? (
                  <img src={preview} alt="Preview" className="photo-preview" />
                ) : (
                  <span className="photo-placeholder">
                    <ImagePlus size={20} />
                    <span>Click to upload a photo</span>
                  </span>
                )}
              </label>
              <input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                hidden
              />
            </div>

            <div className="form-field">
              <label htmlFor="firstName">
                First Name <span>*</span>
              </label>
              <div className="input-wrapper">
                <User size={16} />
                <input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  required
                  value={form.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="lastName">
                Last Name <span>*</span>
              </label>
              <div className="input-wrapper">
                <User size={16} />
                <input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  required
                  value={form.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <Mail size={16} />
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="phone">
                Phone <span>*</span>
              </label>
              <div className="input-wrapper">
                <Phone size={16} />
                <input
                  id="phone"
                  type="text"
                  placeholder="08012345678"
                  required
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </div>
            </div>

            <div className="form-field full-width">
              <label htmlFor="address">Address</label>
              <div className="input-wrapper">
                <MapPin size={16} />
                <input
                  id="address"
                  type="text"
                  placeholder="Lagos, Nigeria"
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                />
              </div>
            </div>

            <div className="form-field full-width">
              <label htmlFor="tags">Tags</label>
              <div className="input-wrapper">
                <Tags size={16} />
                <input
                  id="tags"
                  type="text"
                  placeholder="work, friend, family"
                  value={form.tags}
                  onChange={(e) => updateField("tags", e.target.value)}
                />
              </div>
              <small>Separate multiple tags with commas.</small>
            </div>

            <label className="favorite-option full-width">
              <span className="favorite-checkbox">
                <input
                  id="favorite"
                  type="checkbox"
                  checked={form.favorite}
                  onChange={(e) => updateField("favorite", e.target.checked)}
                />
                <span className="custom-checkbox">
                  <Check size={14} />
                </span>
              </span>
              <span className="favorite-content">
                <strong>Add to favorites</strong>
                <small>Make this contact easier to find.</small>
              </span>
              <Star className="favorite-option-star" size={18} />
            </label>
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="modal-actions">
            <button className="btn btn-secondary" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Contact</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}