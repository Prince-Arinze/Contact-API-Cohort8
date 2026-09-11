export interface Contact {
  _id?: string;
  id?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  address?: string;
  tags?: string[] | string;
  favorite?: boolean;
  photo?: string;
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  tags: string[];
  favorite: boolean;
}

export interface ContactFilters {
  searchTerms?: string;
  tag?: string;
  favorite?: boolean;
}

export type View = "contacts" | "favorites";

export type AlertType = "success" | "error";

export interface AlertState {
  type: AlertType;
  message: string;
}