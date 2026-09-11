import { useCallback, useEffect, useState } from "react";
import { getContacts } from "../api/contacts";
import type { Contact, ContactFilters } from "../types/contact";

interface UseContactsResult {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export function useContacts({ searchTerms, tag, favorite }: ContactFilters): UseContactsResult {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getContacts({ searchTerms, tag, favorite });
      setContacts(data);
    } catch (err) {
      setContacts([]);
      setError(err instanceof Error ? err.message : "Unable to load contacts.");
    } finally {
      setLoading(false);
    }
  }, [searchTerms, tag, favorite]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { contacts, loading, error, reload };
}