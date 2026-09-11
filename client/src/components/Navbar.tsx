import { Link, NavLink } from "react-router-dom";
import { Contact, Users, Star, Plus } from "lucide-react";
import { useModal } from "../context/ModalContext";

export default function Navbar() {
  const { openAddModal } = useModal();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          <span className="logo-icon">
            <Contact size={18} />
          </span>
          <span>Contactly</span>
        </Link>

        <div className="nav-links">
          <NavLink
            to="/contacts"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <Users size={16} />
            <span>Contacts</span>
          </NavLink>
          <NavLink
            to="/favorites"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <Star size={16} />
            <span>Favorites</span>
          </NavLink>
        </div>

        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={16} />
          <span>Add Contact</span>
        </button>
      </div>
    </nav>
  );
}