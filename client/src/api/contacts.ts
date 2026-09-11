import type { Contact, ContactFilters, ContactFormData } from "../types/contact";

const API_URL = "/api/v1/contacts";

interface ApiResponse<T> {
  message?: string;
  data: T;
}

async function request<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    headers: { Accept: "application/json", ...options.headers },
    ...options,
  });

  const result: ApiResponse<T> = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Request failed.");
  }

  return result;
}

function buildFormData(data: ContactFormData, photo: File): FormData {
  const formData = new FormData();
  formData.append("firstName", data.firstName);
  formData.append("lastName", data.lastName);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  formData.append("address", data.address);
  formData.append("favorite", String(data.favorite));
  data.tags.forEach((tag) => formData.append("tags", tag));
  formData.append("photo", photo);
  return formData;
}

export async function getContacts({ searchTerms, tag, favorite }: ContactFilters = {}): Promise<Contact[]> {
  const params = new URLSearchParams();

  if (searchTerms) params.set("searchTerms", searchTerms);
  if (tag) params.set("tag", tag);
  if (favorite) params.set("favorite", "true");

  const query = params.toString();
  const url = query ? `${API_URL}?${query}` : API_URL;

  const result = await request<Contact[]>(url, { method: "GET" });
  return Array.isArray(result.data) ? result.data : [];
}

export async function getContact(id: string): Promise<Contact> {
  const result = await request<Contact>(`${API_URL}/${encodeURIComponent(id)}`, {
    method: "GET",
  });
  return result.data;
}

export async function createContact(data: ContactFormData, photo?: File | null): Promise<Contact> {
  // Only switch to multipart/form-data when there's actually a file to send.
  // Plain field edits (including the favorite toggle) stay as JSON so
  // express.json() keeps parsing them correctly on the backend.
  const result = photo
    ? await request<Contact>(API_URL, {
        method: "POST",
        body: buildFormData(data, photo),
      })
    : await request<Contact>(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

  return result.data;
}

export async function updateContact(
  id: string,
  data: ContactFormData,
  photo?: File | null,
): Promise<Contact> {
  const url = `${API_URL}/${encodeURIComponent(id)}`;

  const result = photo
    ? await request<Contact>(url, {
        method: "PATCH",
        body: buildFormData(data, photo),
      })
    : await request<Contact>(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

  return result.data;
}

export async function deleteContact(id: string): Promise<ApiResponse<null>> {
  return request<null>(`${API_URL}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}