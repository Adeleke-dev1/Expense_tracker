"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Set Default Date to Today in Form
  const dateInput = document.getElementById("tx-date");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
  }

  // 3. Interactive Tag Chip Visuals
  const tagsContainer = document.getElementById("tags-container");
  const tagInput = document.getElementById("tx-tag-input");

  tagInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagInput.value.trim().replace(/^,+|,+$/g, "");
      if (val) {
        createTagChip(val);
        tagInput.value = "";
      }
    }
  });

  function createTagChip(text) {
    const chip = document.createElement("span");
    chip.className = "tag-chip";
    chip.innerHTML = `${text} <button type="button" class="tag-chip__close" aria-label="Remove tag">×</button>`;
    chip
      .querySelector(".tag-chip__close")
      .addEventListener("click", () => chip.remove());
    tagsContainer.insertBefore(chip, tagInput);
  }

  tagsContainer?.querySelectorAll(".tag-chip__close").forEach((btn) => {
    btn.addEventListener("click", (e) =>
      e.target.closest(".tag-chip").remove(),
    );
  });

  // 4. Dialog & Modal Handlers (Accessible ESC & Backdrop)
  const importModal = document.getElementById("modal-import");
  const deleteModal = document.getElementById("modal-delete");
  const openImportBtn = document.getElementById("btn-open-import");

  function openModal(modal) {
    modal.classList.add("is-open");
    const focusable = modal.querySelector('button, input, [tabindex="0"]');
    focusable?.focus();
  }

  function closeModal(modal) {
    modal.classList.remove("is-open");
  }

  openImportBtn?.addEventListener("click", () => openModal(importModal));

  document.querySelectorAll('[data-action="close-dialog"]').forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const modal = e.target.closest(".dialog-backdrop");
      if (modal) closeModal(modal);
    });
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal(importModal);
      closeModal(deleteModal);
      closeMobileSheet();
    }
  });

  // Dropzone interaction
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("file-import-input");
  dropzone?.addEventListener("click", () => fileInput?.click());

  // 5. Mobile Bottom Sheet for Add Form
  const mobileFab = document.getElementById("mobile-fab-add");
  const formPanel = document.getElementById("panel-transaction-form");
  const sheetBackdrop = document.getElementById("mobile-sheet-backdrop");

  function openMobileSheet() {
    formPanel.classList.add("is-open");
    sheetBackdrop.classList.add("is-open");
  }

  function closeMobileSheet() {
    formPanel.classList.remove("is-open");
    sheetBackdrop.classList.remove("is-open");
  }

  mobileFab?.addEventListener("click", openMobileSheet);
  sheetBackdrop?.addEventListener("click", closeMobileSheet);

  // 6. Toast Notification Helper
  function showToast(
    message,
    type = "info",
    actionText = null,
    onAction = null,
  ) {
    const container = document.getElementById("toast-container");
    const template = document.getElementById("toast-template");
    if (!container || !template) return;

    const clone = template.content.cloneNode(true);
    const toast = clone.querySelector(".toast");
    toast.classList.add(`toast--${type}`);
    toast.querySelector(".toast__msg").textContent = message;

    const actionBtn = toast.querySelector(".toast__action");
    if (actionText && onAction) {
      actionBtn.textContent = actionText;
      actionBtn.style.display = "inline-block";
      actionBtn.addEventListener("click", () => {
        onAction();
        toast.remove();
      });
    }

    toast
      .querySelector('[data-action="dismiss-toast"]')
      .addEventListener("click", () => {
        toast.remove();
      });

    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4500);
  }

  // Hook confirm delete button - shared for all transaction deletions
  window.currentItemToDelete = null;

  document
    .getElementById("btn-confirm-delete")
    ?.addEventListener("click", () => {
      if (window.currentItemToDelete) {
        const row = window.currentItemToDelete;
        row.classList.add("tx-row--removing");
        setTimeout(() => {
          row.style.display = "none";
          showToast("Transaction deleted", "success", "Undo", () => {
            row.style.display = "flex";
            row.classList.remove("tx-row--removing");
            row.classList.add("tx-row--entering");
          });
        }, 200);
      }
      closeModal(deleteModal);
    });

  // Make modal references globally accessible for dynamic event handlers
  window.deleteModal = deleteModal;
  window.openModal = openModal;
  window.closeModal = closeModal;
  window.openMobileSheet = openMobileSheet;

  document.getElementById("btn-cancel-edit")?.addEventListener("click", () => {
    document.getElementById("tx-form-heading").textContent = "Add Transaction";
    document.getElementById("btn-submit-tx-text").textContent =
      "Save Transaction";
    document.getElementById("btn-cancel-edit").style.display = "none";
    document.getElementById("tx-form").reset();
  });

  // Export stub notification
  document.getElementById("btn-export-data")?.addEventListener("click", () => {
    showToast("Exporting Spendly backup data as JSON...", "info");
  });
});

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

/**
 *
 * Month Selector :)
 *
 */
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; // prettier-ignore

//
const btnNextMonth = document.getElementById("btn-next-month");
const btnPrevMonth = document.getElementById("btn-prev-month");
const currentMonthDisplay = document.getElementById("current-month-display");

const date = new Date();
let currentTrackingMonth = date.getMonth();
let currentTrackingYear = date.getFullYear();

function setCalender(y, m) {
  let monthInText;
  let year;

  if (y && m) {
    year = y;
    monthInText = m;
  } else {
    year = date.getFullYear();
    const month = date.getMonth();
    monthInText = months[month];
  }

  currentMonthDisplay.textContent = `${monthInText} ${year}`;
}

setCalender();

btnNextMonth.addEventListener("click", function () {
  if (currentTrackingMonth >= 11) {
    currentTrackingMonth = 0;
    currentTrackingYear = currentTrackingYear + 1;
  } else {
    currentTrackingMonth = currentTrackingMonth + 1;
  }

  const nextMonth = months[currentTrackingMonth];

  setCalender(currentTrackingYear, nextMonth);

  console.log(currentTrackingYear);
});

btnPrevMonth.addEventListener("click", function () {
  if (currentTrackingMonth <= 0) {
    currentTrackingMonth = 11;
    currentTrackingYear = currentTrackingYear - 1;
  } else {
    currentTrackingMonth = currentTrackingMonth - 1;
  }

  const prevMonth = months[currentTrackingMonth];

  setCalender(currentTrackingYear, prevMonth);
  console.log(currentTrackingYear);
});

/**
 *
 * Theme Toggling :)
 *
 */
const themeToggleBtn = document.getElementById("theme-toggle-btn");
const root = document.documentElement;

const getPreferredTheme = function () {
  const preferredSystem = window.matchMedia("(prefers-color-scheme: dark)")
    .matches
    ? "dark"
    : "light";

  return preferredSystem;
};

const setTheme = function (theme) {
  root.setAttribute("data-theme", theme);
};

themeToggleBtn.addEventListener("click", () => {
  const initialTheme = root.getAttribute("data-theme"); // system | light | dark

  let currentTheme; // dark | light

  if (initialTheme === "system") {
    currentTheme = getPreferredTheme(); // dark | light
  } else {
    currentTheme = initialTheme;
  }

  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
});

// TX Lists
const txEl = document.getElementById("tx-list");

// Transaction Data
const transactions = [
  {
    id: "tx-101",
    type: "income",
    category: "salary",
    icon: "💼",
    iconClass: "icon-salary",
    title: "TechCorp Monthly Salary",
    tags: ["Work"],
    categoryLabel: "Salary",
    date: "Oct 25, 2024",
    amount: 350000.0,
    paymentMethod: "Direct deposit",
    note: null,
  },
  {
    id: "tx-102",
    type: "expense",
    category: "housing",
    icon: "🏠",
    iconClass: "icon-housing",
    title: "Yaba Apartment Service Charge",
    tags: ["Rent", "Fixed"],
    categoryLabel: "Housing & Rent",
    date: "Oct 24, 2024",
    amount: 65000.0,
    paymentMethod: "Transfer",
    note: null,
  },
  {
    id: "tx-103",
    type: "expense",
    category: "data",
    icon: "📡",
    iconClass: "icon-data",
    title: "MTN Broadband 5G Renewal",
    tags: ["Internet", "Utility"],
    categoryLabel: "Data & Utility",
    date: "Oct 22, 2024",
    amount: 25000.0,
    paymentMethod: "Card",
    note: null,
  },
  {
    id: "tx-104",
    type: "income",
    category: "freelance",
    icon: "🎨",
    iconClass: "icon-freelance",
    title: "Fintech Landing Page Milestone",
    tags: ["Side-gig"],
    categoryLabel: "Freelance",
    date: "Oct 19, 2024",
    amount: 100000.0,
    paymentMethod: "Transfer",
    note: null,
  },
  {
    id: "tx-105",
    type: "expense",
    category: "food",
    icon: "🛒",
    iconClass: "icon-food",
    title: "Shoprite Ikeja Groceries",
    tags: ["Foodstuff"],
    categoryLabel: "Food & Dining",
    date: "Oct 16, 2024",
    amount: 42600.0,
    paymentMethod: "POS Card",
    note: "Monthly provisions, grains, vegetables, and pantry restocking",
  },
  {
    id: "tx-106",
    type: "expense",
    category: "transport",
    icon: "🚗",
    iconClass: "icon-transport",
    title: "Bolt Commute to Victoria Island",
    tags: ["Transit"],
    categoryLabel: "Transport",
    date: "Oct 12, 2024",
    amount: 18400.0,
    paymentMethod: "In-app",
    note: null,
  },
  {
    id: "tx-107",
    type: "expense",
    category: "data",
    icon: "📱",
    iconClass: "icon-data",
    title: "Airtel Airtime & Talk Time",
    tags: ["Airtime"],
    categoryLabel: "Data & Utility",
    date: "Oct 08, 2024",
    amount: 5000.0,
    paymentMethod: "Bank App",
    note: null,
  },
  {
    id: "tx-108",
    type: "expense",
    category: "health",
    icon: "💊",
    iconClass: "icon-health",
    title: "Medplus Pharmacy Vitamins",
    tags: ["Health"],
    categoryLabel: "Healthcare",
    date: "Oct 04, 2024",
    amount: 29200.0,
    paymentMethod: "POS Card",
    note: null,
  },
];

function renderTransactions(tx = []) {
  tx.forEach((t) => {
    const type = t.type === "income" ? "income" : "expense";
    const isIncome = t.type === "income";

    const html = `
      <li class="tx-row" data-id="${t.id}" data-type="${t.type}" data-category="${t.category}">
        <div class="tx-row__icon-wrap icon-${t.category}" aria-hidden="true">
         ${t.icon}
        </div>
        <div class="tx-row__info">
          <div class="tx-row__title-wrap">
            <h3 class="tx-row__title">${t.title}</h3>
            ${t.tags?.map((tag) => `<span class="tx-row__tag">${tag}</span>`).join("")}
          </div>
          <div class="tx-row__subtitle">
            <span>${t.category}</span> • <span>${t.date}</span>
          </div>
        </div>
        <div class="tx-row__amount-wrap">
          <span class="tx-row__amount tx-row__amount--${t.type} num"
            >${isIncome ? "+" : "-"}₦${t.amount}</span
          >
          <span class="text-xs" style="color: var(--text-muted)"
            >${t.paymentMethod}</span
          >
        </div>
        <div class="tx-row__actions">
          <button type="button" class="action-icon-btn" data-action="edit" data-id="tx-101" aria-label="Edit ${t.title}" title="Edit">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          </button>
          <button type="button" class="action-icon-btn action-icon-btn--delete" data-action="delete" data-id="tx-101" aria-label="Delete ${t.title}" title="Delete">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
          </button>
        </div>
      </li>
    `;

    txEl.insertAdjacentHTML("beforeend", html);
  });
}

renderTransactions(transactions);
