import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Toolbar from "../components/Toolbar";
import ResultsBar from "../components/ResultsBar";
import ContactsGrid from "../components/ContactsGrid";
import { useContacts } from "../hooks/useContacts";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useModal } from "../context/ModalContext";
import { useConfirm } from "../context/ConfirmContext";
import { deleteContact, updateContact } from "../api/contacts";
import { getContactId, getContactName, normalizeTags } from "../utils/contactHelpers";
import type { Contact } from "../types/contact";

interface ContactsListPageProps {
  favoritesOnly: boolean;
}

export default function ContactsListPage({ favoritesOnly }: ContactsListPageProps) {
  const navigate = useNavigate();
  const { openAddModal, openEditModal, refreshKey, notify } = useModal();
  const confirm = useConfirm();

  const [searchTerm, setSearchTerm] = useState("");
  const [tag, setTag] = useState("");
  const debouncedSearch = useDebouncedValue(searchTerm, 300);

  const { contacts, reload } = useContacts({
    searchTerms: debouncedSearch,
    tag,
    favorite: favoritesOnly,
  });

  // Refetch whenever the shared modal signals a create/update happened —
  // but skip the mount-time value. We compare against a captured baseline
  // (not a boolean flag) because StrictMode replays this effect once on
  // mount to check for missing cleanups; a mutable flag would get flipped
  // by that replay and misfire an extra fetch.
  const mountRefreshKey = useRef(refreshKey);
  useEffect(() => {
    if (refreshKey === mountRefreshKey.current) return;
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  // Reset filters when switching between Contacts and Favorites.
  useEffect(() => {
    setSearchTerm("");
    setTag("");
  }, [favoritesOnly]);

  const tags = useMemo(() => {
    const all = contacts.flatMap((c) => normalizeTags(c.tags));
    return [...new Set(all)].sort((a, b) => a.localeCompare(b));
  }, [contacts]);

  async function handleDelete(contact: Contact) {
    const name = getContactName(contact);
    const confirmed = await confirm({
      title: "Delete contact",
      message: `Are you sure you want to delete ${name}? This can't be undone.`,
      confirmLabel: "Delete",
      danger: true,
    });
    if (!confirmed) return;

    try {
      await deleteContact(getContactId(contact));
      await reload();
      notify("success", "Contact deleted successfully.");
    } catch (err) {
      notify("error", err instanceof Error ? err.message : "Unable to delete contact.");
    }
  }

  async function handleToggleFavorite(id: string) {
    const contact = contacts.find((c) => String(getContactId(c)) === String(id));
    if (!contact) return;

    const favorite = !contact.favorite;

    try {
      await updateContact(id, {
        firstName: contact.firstName || "",
        lastName: contact.lastName || "",
        email: contact.email || "",
        phone: contact.phone || "",
        address: contact.address || "",
        tags: normalizeTags(contact.tags),
        favorite,
      });
      await reload();
      notify(
        "success",
        favorite ? "Contact added to favorites." : "Contact removed from favorites.",
      );
    } catch (err) {
      notify("error", err instanceof Error ? err.message : "Unable to update favorite status.");
    }
  }

  function handleView(contact: Contact) {
    navigate(`/contacts/${getContactId(contact)}`);
  }

  const hasFilters = Boolean(searchTerm.trim() || tag);

  return (
    <main className="container">
      <PageHeader view={favoritesOnly ? "favorites" : "contacts"} onAddContact={openAddModal} />

      <Toolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onClearSearch={() => setSearchTerm("")}
        tag={tag}
        onTagChange={setTag}
        tags={tags}
        view={favoritesOnly ? "favorites" : "contacts"}
        onToggleFavorites={() => navigate(favoritesOnly ? "/contacts" : "/favorites")}
      />

      <ResultsBar
        count={contacts.length}
        hasFilters={hasFilters}
        onClearFilters={() => {
          setSearchTerm("");
          setTag("");
        }}
      />

      <ContactsGrid
        contacts={contacts}
        view={favoritesOnly ? "favorites" : "contacts"}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onToggleFavorite={handleToggleFavorite}
        onAddContact={openAddModal}
        onView={handleView}
      />
    </main>
  );
}