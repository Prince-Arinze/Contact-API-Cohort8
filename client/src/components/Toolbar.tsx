import { Search, X, Tag, Star, Users } from "lucide-react";
import type { View } from "../types/contact";

interface ToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  tag: string;
  onTagChange: (value: string) => void;
  tags: string[];
  view: View;
  onToggleFavorites: () => void;
}

export default function Toolbar({
  searchTerm,
  onSearchChange,
  onClearSearch,
  tag,
  onTagChange,
  tags,
  view,
  onToggleFavorites,
}: ToolbarProps) {
  const isFavorites = view === "favorites";

  return (
    <section className="toolbar">
      <div className="search-container">
        <Search className="search-icon" size={16} />
        <input
          type="search"
          placeholder="Search contacts..."
          autoComplete="off"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button
            className="clear-search"
            type="button"
            aria-label="Clear search"
            onClick={onClearSearch}
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="filter-container">
        <div className="filter-label">
          <Tag size={14} />
          <span>Tag</span>
        </div>
        <select value={tag} onChange={(e) => onTagChange(e.target.value)}>
          <option value="">All tags</option>
          {tags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <button
        className={`favorite-filter ${isFavorites ? "active" : ""}`}
        type="button"
        onClick={onToggleFavorites}
      >
        {isFavorites ? <Users size={16} /> : <Star size={16} />}
        <span>{isFavorites ? "All Contacts" : "Favorites"}</span>
      </button>
    </section>
  );
}