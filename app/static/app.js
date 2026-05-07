const state = {
  token: localStorage.getItem("summerToken") || "",
  user: JSON.parse(localStorage.getItem("summerUser") || "null"),
  authMode: "login",
  lists: [],
  activeListId: localStorage.getItem("summerActiveList") || "",
  catalog: [],
  selectedItems: [],
};

const els = {
  authPanel: document.querySelector("#authPanel"),
  dashboard: document.querySelector("#dashboard"),
  authForm: document.querySelector("#authForm"),
  loginMode: document.querySelector("#loginMode"),
  signupMode: document.querySelector("#signupMode"),
  authSubmit: document.querySelector("#authSubmit"),
  authMessage: document.querySelector("#authMessage"),
  username: document.querySelector("#username"),
  password: document.querySelector("#password"),
  currentUser: document.querySelector("#currentUser"),
  logoutButton: document.querySelector("#logoutButton"),
  newListForm: document.querySelector("#newListForm"),
  newListName: document.querySelector("#newListName"),
  lists: document.querySelector("#lists"),
  activeListName: document.querySelector("#activeListName"),
  deleteListButton: document.querySelector("#deleteListButton"),
  progressText: document.querySelector("#progressText"),
  progressPercent: document.querySelector("#progressPercent"),
  progressBar: document.querySelector("#progressBar"),
  selectedItems: document.querySelector("#selectedItems"),
  searchInput: document.querySelector("#searchInput"),
  categoryFilter: document.querySelector("#categoryFilter"),
  catalogItems: document.querySelector("#catalogItems"),
  toast: document.querySelector("#toast"),
};

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${state.token}`,
  };
}

async function api(path, options = {}) {
  const response = await fetch(path, options);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Something went sideways near the shoreline.");
  }

  return payload;
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.remove("hidden");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => els.toast.classList.add("hidden"), 2600);
}

function setAuthMode(mode) {
  state.authMode = mode;
  els.loginMode.classList.toggle("active", mode === "login");
  els.signupMode.classList.toggle("active", mode === "signup");
  els.authSubmit.textContent = mode === "login" ? "Ride the wave" : "Start planning";
  els.password.autocomplete = mode === "login" ? "current-password" : "new-password";
  els.authMessage.textContent = "";
}

function saveSession(user, token) {
  state.user = user;
  state.token = token;
  localStorage.setItem("summerUser", JSON.stringify(user));
  localStorage.setItem("summerToken", token);
}

function clearSession() {
  state.user = null;
  state.token = "";
  state.lists = [];
  state.activeListId = "";
  state.selectedItems = [];
  localStorage.removeItem("summerUser");
  localStorage.removeItem("summerToken");
  localStorage.removeItem("summerActiveList");
}

function renderShell() {
  const signedIn = Boolean(state.token && state.user);
  els.authPanel.classList.toggle("hidden", signedIn);
  els.dashboard.classList.toggle("hidden", !signedIn);
  els.logoutButton.classList.toggle("hidden", !signedIn);
  els.currentUser.textContent = signedIn ? `Hi, ${state.user.username}` : "";
}

function renderLists() {
  if (!state.lists.length) {
    els.lists.innerHTML = '<div class="empty-state">Make your first list.</div>';
    return;
  }

  els.lists.innerHTML = state.lists
    .map(
      (list) => `
        <button class="list-button ${list.id === state.activeListId ? "active" : ""}" data-list-id="${list.id}" type="button">
          ${escapeHtml(list.name)}
        </button>
      `
    )
    .join("");
}

function renderProgress() {
  const total = state.selectedItems.length;
  const done = state.selectedItems.filter((item) => item.completed).length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  els.progressText.textContent = `${done} of ${total} complete`;
  els.progressPercent.textContent = `${percent}%`;
  els.progressBar.style.width = `${percent}%`;
}

function renderSelectedItems() {
  const activeList = state.lists.find((list) => list.id === state.activeListId);
  els.activeListName.textContent = activeList ? activeList.name : "Choose a list";
  els.deleteListButton.classList.toggle("hidden", !activeList);

  if (!activeList) {
    els.selectedItems.className = "selected-items empty-state";
    els.selectedItems.textContent = "Create or choose a list to start planning.";
    renderProgress();
    return;
  }

  if (!state.selectedItems.length) {
    els.selectedItems.className = "selected-items empty-state";
    els.selectedItems.textContent = "Add a catalog idea to this list.";
    renderProgress();
    return;
  }

  els.selectedItems.className = "selected-items";
  els.selectedItems.innerHTML = state.selectedItems
    .map(
      (item) => `
        <article class="todo-card ${item.completed ? "completed" : ""}">
          <input type="checkbox" data-complete-id="${item.id}" ${item.completed ? "checked" : ""} aria-label="Mark ${escapeHtml(item.name)} complete" />
          <div>
            <span class="todo-title">${escapeHtml(item.name)}</span>
            <div class="todo-meta">
              <span class="tag">${escapeHtml(item.category || "Summer")}</span>
              <span class="tag">${formatDate(item.due_date)}</span>
            </div>
          </div>
          <button class="danger-icon" data-remove-id="${item.id}" type="button" aria-label="Remove ${escapeHtml(item.name)}">x</button>
        </article>
      `
    )
    .join("");
  renderProgress();
}

function renderCategories() {
  const categories = [...new Set(state.catalog.map((item) => item.category).filter(Boolean))].sort();
  els.categoryFilter.innerHTML = '<option value="">All categories</option>';
  els.categoryFilter.insertAdjacentHTML(
    "beforeend",
    categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join("")
  );
}

function renderCatalog() {
  const search = els.searchInput.value.trim().toLowerCase();
  const category = els.categoryFilter.value;
  const selectedIds = new Set(state.selectedItems.map((item) => item.id));

  const items = state.catalog.filter((item) => {
    const matchesSearch = !search || item.name.toLowerCase().includes(search);
    const matchesCategory = !category || item.category === category;
    return matchesSearch && matchesCategory;
  });

  if (!items.length) {
    els.catalogItems.innerHTML = '<div class="empty-state">No matching activities.</div>';
    return;
  }

  els.catalogItems.innerHTML = items
    .map((item) => {
      const alreadyAdded = selectedIds.has(item.id);
      return `
        <article class="catalog-card">
          <div>
            <h3>${escapeHtml(item.name)}</h3>
            <div class="catalog-meta">
              <span class="tag">${escapeHtml(item.category || "Summer")}</span>
              <span class="tag">${formatDate(item.due_date)}</span>
            </div>
          </div>
          <button class="primary-button" data-add-id="${item.id}" type="button" ${alreadyAdded || !state.activeListId ? "disabled" : ""}>
            ${alreadyAdded ? "Added" : "Add to list"}
          </button>
        </article>
      `;
    })
    .join("");
}

async function loadCatalog() {
  const payload = await api("/items");
  state.catalog = payload.items || [];
  renderCategories();
  renderCatalog();
}

async function loadLists() {
  const payload = await api("/lists", { headers: authHeaders() });
  state.lists = payload.lists || [];

  if (!state.lists.some((list) => list.id === state.activeListId)) {
    state.activeListId = state.lists[0]?.id || "";
  }

  if (state.activeListId) {
    localStorage.setItem("summerActiveList", state.activeListId);
    await loadSelectedItems();
  } else {
    state.selectedItems = [];
  }

  renderLists();
  renderSelectedItems();
  renderCatalog();
}

async function loadSelectedItems() {
  if (!state.activeListId) {
    state.selectedItems = [];
    return;
  }
  const payload = await api(`/lists/${state.activeListId}/items`, { headers: authHeaders() });
  state.selectedItems = payload.items || [];
}

async function boot() {
  renderShell();
  await loadCatalog();
  if (state.token && state.user) {
    try {
      await loadLists();
    } catch (error) {
      clearSession();
      renderShell();
      showToast(error.message);
    }
  }
}

function formatDate(value) {
  if (!value) return "Anytime";
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

els.loginMode.addEventListener("click", () => setAuthMode("login"));
els.signupMode.addEventListener("click", () => setAuthMode("signup"));

els.authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  els.authMessage.textContent = "";

  try {
    const payload = await api(state.authMode === "login" ? "/auth/login" : "/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: els.username.value.trim(),
        password: els.password.value,
      }),
    });
    saveSession(payload.user, payload.token);
    els.password.value = "";
    renderShell();
    await loadLists();
    showToast("Welcome to the shore.");
  } catch (error) {
    els.authMessage.textContent = error.message;
  }
});

els.logoutButton.addEventListener("click", () => {
  clearSession();
  renderShell();
  renderLists();
  renderSelectedItems();
  renderCatalog();
});

els.newListForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = els.newListName.value.trim();
  if (!name) return;

  try {
    const payload = await api("/lists", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ name }),
    });
    state.lists.push(payload.list);
    state.activeListId = payload.list.id;
    localStorage.setItem("summerActiveList", state.activeListId);
    state.selectedItems = [];
    els.newListName.value = "";
    renderLists();
    renderSelectedItems();
    renderCatalog();
  } catch (error) {
    showToast(error.message);
  }
});

els.lists.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-list-id]");
  if (!button) return;

  state.activeListId = button.dataset.listId;
  localStorage.setItem("summerActiveList", state.activeListId);
  await loadSelectedItems();
  renderLists();
  renderSelectedItems();
  renderCatalog();
});

els.deleteListButton.addEventListener("click", async () => {
  const activeList = state.lists.find((list) => list.id === state.activeListId);
  if (!activeList) return;

  try {
    await api(`/lists/${state.activeListId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    state.lists = state.lists.filter((list) => list.id !== state.activeListId);
    state.activeListId = state.lists[0]?.id || "";
    if (state.activeListId) {
      localStorage.setItem("summerActiveList", state.activeListId);
      await loadSelectedItems();
    } else {
      localStorage.removeItem("summerActiveList");
      state.selectedItems = [];
    }
    renderLists();
    renderSelectedItems();
    renderCatalog();
    showToast(`${activeList.name} was deleted.`);
  } catch (error) {
    showToast(error.message);
  }
});

els.catalogItems.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-add-id]");
  if (!button || !state.activeListId) return;

  try {
    await api(`/lists/${state.activeListId}/items`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ item_id: button.dataset.addId }),
    });
    await loadSelectedItems();
    renderSelectedItems();
    renderCatalog();
  } catch (error) {
    showToast(error.message);
  }
});

els.selectedItems.addEventListener("change", async (event) => {
  const checkbox = event.target.closest("[data-complete-id]");
  if (!checkbox) return;

  try {
    await api(`/lists/${state.activeListId}/items/${checkbox.dataset.completeId}`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ completed: checkbox.checked }),
    });
    await loadSelectedItems();
    renderSelectedItems();
  } catch (error) {
    showToast(error.message);
  }
});

els.selectedItems.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-remove-id]");
  if (!button) return;

  try {
    await api(`/lists/${state.activeListId}/items/${button.dataset.removeId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    await loadSelectedItems();
    renderSelectedItems();
    renderCatalog();
  } catch (error) {
    showToast(error.message);
  }
});

els.searchInput.addEventListener("input", renderCatalog);
els.categoryFilter.addEventListener("change", renderCatalog);

boot();
