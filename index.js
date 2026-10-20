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

  // Hook static delete buttons to open delete modal as a demonstration
  let currentItemToDelete = null;
  document.querySelectorAll('[data-action="delete"]').forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const row = e.target.closest(".tx-row");
      currentItemToDelete = row;
      openModal(deleteModal);
    });
  });

  document
    .getElementById("btn-confirm-delete")
    ?.addEventListener("click", () => {
      if (currentItemToDelete) {
        const row = currentItemToDelete;
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

  // Hook edit buttons to populate form header as a demonstration
  document.querySelectorAll('[data-action="edit"]').forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const row = e.target.closest(".tx-row");
      const title = row.querySelector(".tx-row__title").textContent;
      document.getElementById("tx-form-heading").textContent =
        "Edit Transaction";
      document.getElementById("btn-submit-tx-text").textContent =
        "Update Transaction";
      document.getElementById("btn-cancel-edit").style.display = "inline-flex";
      document.getElementById("tx-title").value = title;

      if (window.innerWidth < 640) openMobileSheet();
      document.getElementById("tx-amount").focus();
    });
  });

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
