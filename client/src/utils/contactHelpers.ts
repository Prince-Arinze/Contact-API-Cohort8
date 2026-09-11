import type { Contact } from "../types/contact";

export function getContactId(contact: Contact): string {
  return contact._id || contact.id || "";
}

export function getContactName(contact: Contact): string {
  const firstName = contact.firstName || "";
  const lastName = contact.lastName || "";
  return `${firstName} ${lastName}`.trim() || "Unnamed Contact";
}

export function getContactInitials(contact: Contact): string {
  const firstInitial = (contact.firstName || "").charAt(0);
  const lastInitial = (contact.lastName || "").charAt(0);
  return `${firstInitial}${lastInitial}`.toUpperCase() || "C";
}

export function isFavorite(contact: Contact): boolean {
  return contact.favorite === true;
}

export function normalizeTags(tags: Contact["tags"]): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;

  return String(tags)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}