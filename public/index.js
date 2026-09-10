const API_URL = "/api/v1/contacts";

let contacts = [];
let editingContactId = null;
let showFavorites = false;

const contactsContainer = document.getElementById("contactsContainer");
const emptyState = document.getElementById("emptyState");
const emptyTitle = document.getElementById("emptyTitle");
const emptyDescription = document.getElementById("emptyDescription");
const alertBox = document.getElementById("alert");
const contactCount = document.getElementById("contactCount");
const resultsLabel = document.getElementById("resultsLabel");

const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const tagFilter = document.getElementById("tagFilter");
const favoriteFilterBtn = document.getElementById("favoriteFilterBtn");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");

const modal = document.getElementById("contactModal");
const modalTitle = document.getElementById("modalTitle");
const contactForm = document.getElementById("contactForm");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelBtn");
const addContactBtn = document.getElementById("addContactBtn");
const addContactBtnDesktop = document.getElementById("addContactBtnDesktop");
const emptyAddBtn = document.getElementById("emptyAddBtn");

const contactIdInput = document.getElementById("contactId");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const addressInput = document.getElementById("address");
const tagsInput = document.getElementById("tags");
const favoriteInput = document.getElementById("favorite");

const formError = document.getElementById("formError");
const saveBtn = document.getElementById("saveBtn");

const navLinks = document.querySelectorAll(".nav-link");
const pageTitle = document.getElementById("pageTitle");
const pageDescription = document.getElementById("pageDescription");
const pageEyebrow = document.getElementById("pageEyebrow");

let alertTimeout;

function refreshIcons() {
  if (window.lucide) {
    lucide.createIcons();
  }
}

function escapeHTML(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getContactId(contact) {
  return contact._id || contact.id;
}

function getContactName(contact) {
  const firstName = contact.firstName || "";
  const lastName = contact.lastName || "";

  return `${firstName} ${lastName}`.trim() || "Unnamed Contact";
}

function getContactInitials(contact) {
  const firstName = contact.firstName || "";
  const lastName = contact.lastName || "";

  const firstInitial = firstName.charAt(0);
  const lastInitial = lastName.charAt(0);

  return `${firstInitial}${lastInitial}`.toUpperCase() || "C";
}

function isFavorite(contact) {
  return contact.favorite === true;
}

function normalizeTags(tags) {
  if (!tags) {
    return [];
  }

  if (Array.isArray(tags)) {
    return tags;
  }

  return String(tags)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function showAlert(message, type = "success") {
  clearTimeout(alertTimeout);

  alertBox.textContent = message;
  alertBox.className = `alert ${type}`;

  alertTimeout = setTimeout(() => {
    alertBox.classList.add("hidden");
  }, 4500);
}

function hideAlert() {
  clearTimeout(alertTimeout);
  alertBox.classList.add("hidden");
}

function showFormError(message) {
  formError.textContent = message;
  formError.classList.remove("hidden");
}

function hideFormError() {
  formError.textContent = "";
  formError.classList.add("hidden");
}

function renderContactCard(contact) {
  const id = getContactId(contact);
  const name = getContactName(contact);
  const email = contact.email || "";
  const phone = contact.phone || "";
  const address = contact.address || "";
  const tags = normalizeTags(contact.tags);
  const favorite = isFavorite(contact);

  return `
        <article class="contact-card">
            <div class="contact-card-top">
                <div class="contact-avatar">
                    ${escapeHTML(getContactInitials(contact))}
                </div>

                <button
                    type="button"
                    class="favorite-button ${favorite ? "active" : ""}"
                    data-action="favorite"
                    data-id="${escapeHTML(id)}"
                    aria-label="${favorite ? "Remove from favorites" : "Add to favorites"}"
                    title="${favorite ? "Remove from favorites" : "Add to favorites"}"
                >
                    <i data-lucide="star"></i>
                </button>
            </div>

            <div class="contact-card-content">
                <div class="contact-name">
                    <h3>${escapeHTML(name)}</h3>

                    ${
                      favorite
                        ? `
                                <span class="favorite-badge">
                                    <i data-lucide="star"></i>
                                    Favorite
                                </span>
                            `
                        : ""
                    }
                </div>

                <div class="contact-details">
                    ${
                      email
                        ? `
                                <a href="mailto:${escapeHTML(email)}" class="contact-detail">
                                    <i data-lucide="mail"></i>
                                    <span>${escapeHTML(email)}</span>
                                </a>
                            `
                        : ""
                    }

                    ${
                      phone
                        ? `
                                <a href="tel:${escapeHTML(phone)}" class="contact-detail">
                                    <i data-lucide="phone"></i>
                                    <span>${escapeHTML(phone)}</span>
                                </a>
                            `
                        : ""
                    }

                    ${
                      address
                        ? `
                                <div class="contact-detail">
                                    <i data-lucide="map-pin"></i>
                                    <span>${escapeHTML(address)}</span>
                                </div>
                            `
                        : ""
                    }
                </div>

                ${
                  tags.length
                    ? `
                            <div class="contact-tags">
                                ${tags
                                  .map(
                                    (tag) => `
                                            <span class="contact-tag">
                                                ${escapeHTML(tag)}
                                            </span>
                                        `,
                                  )
                                  .join("")}
                            </div>
                        `
                    : ""
                }
            </div>

            <div class="contact-card-footer">
                <button
                    type="button"
                    class="card-action"
                    data-action="edit"
                    data-id="${escapeHTML(id)}"
                >
                    <i data-lucide="pencil"></i>
                    <span>Edit</span>
                </button>

                <button
                    type="button"
                    class="card-action danger"
                    data-action="delete"
                    data-id="${escapeHTML(id)}"
                >
                    <i data-lucide="trash-2"></i>
                    <span>Delete</span>
                </button>
            </div>
        </article>
    `;
}

function renderContacts() {
  if (!contacts.length) {
    contactsContainer.innerHTML = "";
    contactsContainer.classList.add("hidden");
    emptyState.classList.remove("hidden");

    emptyTitle.textContent = showFavorites
      ? "No favorite contacts"
      : "No contacts found";

    emptyDescription.textContent = showFavorites
      ? "Contacts you mark as favorites will appear here."
      : "Try changing your search or filters, or add a new contact.";

    contactCount.textContent = "0";
    resultsLabel.textContent = "contacts";

    refreshIcons();
    return;
  }

  emptyState.classList.add("hidden");
  contactsContainer.classList.remove("hidden");

  contactsContainer.innerHTML = contacts.map(renderContactCard).join("");

  contactCount.textContent = contacts.length;
  resultsLabel.textContent = contacts.length === 1 ? "contact" : "contacts";

  refreshIcons();
}

function updateTagFilter() {
  const currentValue = tagFilter.value;

  const tags = contacts.flatMap((contact) => normalizeTags(contact.tags));

  const uniqueTags = [...new Set(tags)].sort((a, b) => a.localeCompare(b));

  tagFilter.innerHTML = `
        <option value="">All tags</option>
        ${uniqueTags
          .map(
            (tag) =>
              `<option value="${escapeHTML(tag)}">${escapeHTML(tag)}</option>`,
          )
          .join("")}
    `;

  if (uniqueTags.includes(currentValue)) {
    tagFilter.value = currentValue;
  }
}

function updateClearFilters() {
  const hasSearch = searchInput.value.trim() !== "";
  const hasTag = tagFilter.value !== "";

  clearSearchBtn.classList.toggle("hidden", !hasSearch);
  clearFiltersBtn.classList.toggle("hidden", !hasSearch && !hasTag);
}

function updateViewUI() {
  navLinks.forEach((link) => {
    link.classList.toggle(
      "active",
      link.dataset.view === (showFavorites ? "favorites" : "contacts"),
    );
  });

  if (showFavorites) {
    pageEyebrow.textContent = "FAVORITES";
    pageTitle.textContent = "Favorite Contacts";
    pageDescription.textContent =
      "Quick access to the people you care about most.";

    favoriteFilterBtn.classList.add("active");

    favoriteFilterBtn.innerHTML = `
            <i data-lucide="users"></i>
            <span>All Contacts</span>
        `;
  } else {
    pageEyebrow.textContent = "CONTACT MANAGEMENT";
    pageTitle.textContent = "My Contacts";
    pageDescription.textContent =
      "Manage and organize all your contacts in one place.";

    favoriteFilterBtn.classList.remove("active");

    favoriteFilterBtn.innerHTML = `
            <i data-lucide="star"></i>
            <span>Favorites</span>
        `;
  }

  refreshIcons();
}

function switchView(view) {
  showFavorites = view === "favorites";

  searchInput.value = "";
  tagFilter.value = "";

  updateViewUI();
  updateClearFilters();

  window.history.replaceState(
    null,
    "",
    showFavorites ? "#favorites" : "#contacts",
  );

  loadContacts();
}

async function loadContacts() {
  try {
    const params = new URLSearchParams();

    const searchTerms = searchInput.value.trim();
    const tag = tagFilter.value;

    if (searchTerms) {
      params.set("searchTerms", searchTerms);
    }

    if (tag) {
      params.set("tag", tag);
    }

    if (showFavorites) {
      params.set("favorite", "true");
    }

    const query = params.toString();
    const url = query ? `${API_URL}?${query}` : API_URL;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch contacts.");
    }

    contacts = Array.isArray(result.data) ? result.data : [];

    updateTagFilter();
    renderContacts();
    updateClearFilters();
  } catch (error) {
    console.error("Load contacts error:", error);

    contacts = [];
    renderContacts();

    showAlert(error.message || "Unable to load contacts.", "error");
  }
}

async function createContact(contactData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(contactData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create contact.");
  }

  return result.data;
}

async function updateContact(id, contactData) {
  const response = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(contactData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update contact.");
  }

  return result.data;
}

async function deleteContact(id) {
  const response = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete contact.");
  }

  return result;
}

function openModal(contact = null) {
  hideFormError();

  editingContactId = contact ? getContactId(contact) : null;

  contactIdInput.value = editingContactId || "";

  modalTitle.textContent = contact ? "Edit Contact" : "Add Contact";

  firstNameInput.value = contact?.firstName || "";
  lastNameInput.value = contact?.lastName || "";
  emailInput.value = contact?.email || "";
  phoneInput.value = contact?.phone || "";
  addressInput.value = contact?.address || "";

  tagsInput.value = normalizeTags(contact?.tags).join(", ");

  favoriteInput.checked = contact ? isFavorite(contact) : false;

  modal.classList.remove("hidden");
  document.body.classList.add("modal-open");

  setTimeout(() => {
    firstNameInput.focus();
  }, 50);
}

function closeModal() {
  modal.classList.add("hidden");
  document.body.classList.remove("modal-open");

  editingContactId = null;
  contactForm.reset();
  hideFormError();
}

function getFormData() {
  return {
    firstName: firstNameInput.value.trim(),
    lastName: lastNameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    address: addressInput.value.trim(),
    tags: tagsInput.value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    favorite: favoriteInput.checked,
  };
}

async function handleFormSubmit(event) {
  event.preventDefault();

  hideFormError();
  hideAlert();

  const contactData = getFormData();

  if (!contactData.firstName) {
    showFormError("First name is required.");
    firstNameInput.focus();
    return;
  }

  if (!contactData.lastName) {
    showFormError("Last name is required.");
    lastNameInput.focus();
    return;
  }

  if (!contactData.phone) {
    showFormError("Phone number is required.");
    phoneInput.focus();
    return;
  }

  const isEditing = Boolean(editingContactId);
  const originalContent = saveBtn.innerHTML;

  saveBtn.disabled = true;
  saveBtn.innerHTML = `
        <span>Saving...</span>
    `;

  try {
    if (isEditing) {
      await updateContact(editingContactId, contactData);
    } else {
      await createContact(contactData);
    }

    closeModal();

    await loadContacts();

    showAlert(
      isEditing
        ? "Contact updated successfully."
        : "Contact created successfully.",
      "success",
    );
  } catch (error) {
    console.error("Save contact error:", error);

    showFormError(error.message || "Unable to save contact.");
  } finally {
    saveBtn.disabled = false;
    saveBtn.innerHTML = originalContent;
    refreshIcons();
  }
}

async function handleDeleteContact(id) {
  const contact = contacts.find(
    (item) => String(getContactId(item)) === String(id),
  );

  if (!contact) {
    return;
  }

  const name = getContactName(contact);

  const confirmed = window.confirm(`Are you sure you want to delete ${name}?`);

  if (!confirmed) {
    return;
  }

  try {
    await deleteContact(id);

    await loadContacts();

    showAlert("Contact deleted successfully.", "success");
  } catch (error) {
    console.error("Delete contact error:", error);

    showAlert(error.message || "Unable to delete contact.", "error");
  }
}

async function handleFavoriteToggle(id) {
  const contact = contacts.find(
    (item) => String(getContactId(item)) === String(id),
  );

  if (!contact) {
    return;
  }

  const favorite = !isFavorite(contact);

  const updatedData = {
    firstName: contact.firstName || "",
    lastName: contact.lastName || "",
    email: contact.email || "",
    phone: contact.phone || "",
    address: contact.address || "",
    tags: normalizeTags(contact.tags),
    favorite,
  };

  try {
    await updateContact(id, updatedData);

    await loadContacts();

    showAlert(
      favorite
        ? "Contact added to favorites."
        : "Contact removed from favorites.",
      "success",
    );
  } catch (error) {
    console.error("Favorite update error:", error);

    showAlert(error.message || "Unable to update favorite status.", "error");
  }
}

function handleContactAction(event) {
  const button = event.target.closest("[data-action]");

  if (!button) {
    return;
  }

  const { action, id } = button.dataset;

  if (!id) {
    return;
  }

  if (action === "edit") {
    const contact = contacts.find(
      (item) => String(getContactId(item)) === String(id),
    );

    if (contact) {
      openModal(contact);
    }

    return;
  }

  if (action === "delete") {
    handleDeleteContact(id);
    return;
  }

  if (action === "favorite") {
    handleFavoriteToggle(id);
  }
}

function handleSearch() {
  updateClearFilters();

  clearTimeout(handleSearch.timer);

  handleSearch.timer = setTimeout(() => {
    loadContacts();
  }, 300);
}

function clearFilters() {
  searchInput.value = "";
  tagFilter.value = "";

  updateClearFilters();
  loadContacts();
}

function handleNavigation(event) {
  event.preventDefault();

  switchView(event.currentTarget.dataset.view);
}

addContactBtn.addEventListener("click", () => openModal());

addContactBtnDesktop.addEventListener("click", () => openModal());

emptyAddBtn.addEventListener("click", () => openModal());

closeModalBtn.addEventListener("click", closeModal);

cancelBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

contactForm.addEventListener("submit", handleFormSubmit);

contactsContainer.addEventListener("click", handleContactAction);

searchInput.addEventListener("input", handleSearch);

tagFilter.addEventListener("change", () => {
  updateClearFilters();
  loadContacts();
});

clearSearchBtn.addEventListener("click", () => {
  searchInput.value = "";
  updateClearFilters();
  loadContacts();
  searchInput.focus();
});

clearFiltersBtn.addEventListener("click", clearFilters);

favoriteFilterBtn.addEventListener("click", () => {
  switchView(showFavorites ? "contacts" : "favorites");
});

navLinks.forEach((link) => {
  link.addEventListener("click", handleNavigation);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

window.addEventListener("hashchange", () => {
  const favorites = window.location.hash === "#favorites";

  if (favorites !== showFavorites) {
    showFavorites = favorites;
    updateViewUI();
    loadContacts();
  }
});

function initialize() {
  showFavorites = window.location.hash === "#favorites";

  updateViewUI();
  updateClearFilters();
  refreshIcons();
  loadContacts();
}

initialize();
