(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const STORAGE_KEYS = {
    tasks: "daymark.tasks.v1",
    links: "daymark.links.v1",
    name: "daymark.name.v1",
    theme: "daymark.theme.v1"
  };

  const safeRead = (key, fallback) => {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch {
      return fallback;
    }
  };
  const safeWrite = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage may be unavailable */ }
  };

  let tasks = safeRead(STORAGE_KEYS.tasks, []);
  let links = safeRead(STORAGE_KEYS.links, [
    { id: "starter-google", name: "Google", url: "https://www.google.com/" },
    { id: "starter-gmail", name: "Gmail", url: "https://mail.google.com/" },
    { id: "starter-calendar", name: "Calendar", url: "https://calendar.google.com/" }
  ]);
  if (!Array.isArray(tasks)) tasks = [];
  if (!Array.isArray(links)) links = [];
  let focusSeconds = 25 * 60;
  let remainingSeconds = focusSeconds;
  let timerInterval = null;
  let timerRunning = false;

  // Clock and greeting
  const twoDigits = (number) => String(number).padStart(2, "0");
  const updateClock = () => {
    const now = new Date();
    $("#clock").textContent = `${twoDigits(now.getHours())}:${twoDigits(now.getMinutes())}:${twoDigits(now.getSeconds())}`;
    $("#full-date").textContent = new Intl.DateTimeFormat("id-ID", {
      weekday: "long", day: "numeric", month: "long", year: "numeric"
    }).format(now);
    $("#top-date").textContent = new Intl.DateTimeFormat("id-ID", {
      day: "numeric", month: "short", year: "numeric"
    }).format(now).toUpperCase();
    const hour = now.getHours();
    const timeGreeting = hour >= 4 && hour < 11 ? "Selamat pagi" :
      hour >= 11 && hour < 15 ? "Selamat siang" :
      hour >= 15 && hour < 18 ? "Selamat sore" : "Selamat malam";
    const name = ($("#name-input").value || "").trim();
    $("#greeting").textContent = name ? `${timeGreeting}, ${name}.` : `${timeGreeting}.`;
  };
  $("#name-input").value = safeRead(STORAGE_KEYS.name, "");
  $("#name-input").addEventListener("input", () => {
    safeWrite(STORAGE_KEYS.name, $("#name-input").value.trim());
    updateClock();
  });
  updateClock();
  window.setInterval(updateClock, 1000);

  // Focus timer
  const renderTimer = () => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    $("#timer-display").textContent = `${twoDigits(minutes)}:${twoDigits(seconds)}`;
    $("#timer-ring").style.background = `conic-gradient(var(--gold) ${((focusSeconds - remainingSeconds) / focusSeconds) * 360}deg, var(--line) 0deg)`;
    $("#start-timer").disabled = timerRunning;
    $("#pause-timer").disabled = !timerRunning;
    $("#timer-status").textContent = timerRunning ? "BERJALAN" : (remainingSeconds === 0 ? "SELESAI" : "SIAP");
    $("#timer-caption").textContent = remainingSeconds === 0 ? "SESI SELESAI" : "WAKTU FOKUS";
  };
  const stopTimer = () => {
    if (timerInterval !== null) window.clearInterval(timerInterval);
    timerInterval = null;
    timerRunning = false;
  };
  $("#start-timer").addEventListener("click", () => {
    if (timerRunning || remainingSeconds <= 0) return;
    timerRunning = true;
    timerInterval = window.setInterval(() => {
      remainingSeconds -= 1;
      if (remainingSeconds <= 0) {
        remainingSeconds = 0;
        stopTimer();
        $("#timer-status").textContent = "SELESAI";
        $("#daily-quote").textContent = "Sesi fokus selesai. Tarik napas, lalu rayakan progres kecilmu.";
      }
      renderTimer();
    }, 1000);
    renderTimer();
  });
  $("#pause-timer").addEventListener("click", () => { stopTimer(); renderTimer(); });
  $("#reset-timer").addEventListener("click", () => {
    stopTimer();
    remainingSeconds = focusSeconds;
    renderTimer();
  });
  renderTimer();

  // Tasks: prevent duplicate active tasks and save every change locally.
  // editingId tracks which task (if any) is currently in inline-edit mode.
  let editingId = null;

  const renderTasks = () => {
    const list = $("#task-list");
    list.replaceChildren();
    tasks.forEach((task) => {
      const item = document.createElement("li");
      item.className = `task-item${task.completed ? " completed" : ""}`;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "task-checkbox";
      checkbox.checked = Boolean(task.completed);
      checkbox.setAttribute("aria-label", `Tandai "${task.text}" selesai`);
      checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        safeWrite(STORAGE_KEYS.tasks, tasks);
        renderTasks();
      });

      if (editingId === task.id) {
        // ── Inline edit mode ──────────────────────────────────────────────
        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.className = "task-edit-input";
        editInput.value = task.text;
        editInput.maxLength = 100;
        editInput.setAttribute("aria-label", "Edit teks tugas");

        const saveBtn = document.createElement("button");
        saveBtn.type = "button";
        saveBtn.className = "edit-save-btn";
        saveBtn.textContent = "✓";
        saveBtn.setAttribute("aria-label", "Simpan perubahan tugas");

        const cancelBtn = document.createElement("button");
        cancelBtn.type = "button";
        cancelBtn.className = "edit-cancel-btn";
        cancelBtn.textContent = "✕";
        cancelBtn.setAttribute("aria-label", "Batalkan pengeditan tugas");

        const commitEdit = () => {
          const newText = editInput.value.trim();
          if (!newText) { editInput.focus(); return; }
          // Duplicate check: ignore the task being edited itself
          const duplicate = tasks.some(
            (t) => t.id !== task.id && t.text.toLocaleLowerCase() === newText.toLocaleLowerCase() && !t.completed
          );
          if (duplicate) {
            editInput.setCustomValidity("Tugas aktif dengan nama itu sudah ada.");
            editInput.reportValidity();
            editInput.setCustomValidity("");
            editInput.focus();
            return;
          }
          task.text = newText;
          editingId = null;
          safeWrite(STORAGE_KEYS.tasks, tasks);
          renderTasks();
        };

        saveBtn.addEventListener("click", commitEdit);
        cancelBtn.addEventListener("click", () => { editingId = null; renderTasks(); });
        editInput.addEventListener("keydown", (e) => {
          if (e.key === "Enter") { e.preventDefault(); commitEdit(); }
          if (e.key === "Escape") { editingId = null; renderTasks(); }
        });

        item.append(checkbox, editInput, saveBtn, cancelBtn);
        list.append(item);
        editInput.focus();
        editInput.select();
        return; // skip normal rendering for this item
      }

      // ── Normal (view) mode ────────────────────────────────────────────
      const text = document.createElement("span");
      text.className = "task-text";
      text.textContent = task.text;

      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "edit-task";
      editBtn.textContent = "✎";
      editBtn.setAttribute("aria-label", `Edit tugas "${task.text}"`);
      editBtn.addEventListener("click", () => {
        editingId = task.id;
        renderTasks();
      });

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "delete-task";
      remove.textContent = "×";
      remove.setAttribute("aria-label", `Hapus tugas "${task.text}"`);
      remove.addEventListener("click", () => {
        tasks = tasks.filter((entry) => entry.id !== task.id);
        safeWrite(STORAGE_KEYS.tasks, tasks);
        renderTasks();
      });

      item.append(checkbox, text, editBtn, remove);
      list.append(item);
    });
    const pending = tasks.filter((task) => !task.completed).length;
    $("#task-count").textContent = `${tasks.length} ${tasks.length === 1 ? "tugas" : "tugas"}`;
    $("#remaining-count").textContent = pending === 0 ? "Semua tugas beres ✦" : `${pending} tugas belum selesai`;
    $("#empty-state").hidden = tasks.length > 0;
    $("#clear-completed").disabled = !tasks.some((task) => task.completed);
  };

  $("#task-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = $("#task-input");
    const text = input.value.trim();
    const message = $("#form-message");
    message.textContent = "";
    if (!text) {
      message.textContent = "Tulis tugas terlebih dahulu.";
      input.focus();
      return;
    }
    const duplicate = tasks.some((task) => task.text.toLocaleLowerCase() === text.toLocaleLowerCase() && !task.completed);
    if (duplicate) {
      message.textContent = "Tugas aktif dengan nama itu sudah ada.";
      input.focus();
      return;
    }
    tasks.unshift({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, text, completed: false });
    safeWrite(STORAGE_KEYS.tasks, tasks);
    input.value = "";
    renderTasks();
    input.focus();
  });
  $("#clear-completed").addEventListener("click", () => {
    tasks = tasks.filter((task) => !task.completed);
    safeWrite(STORAGE_KEYS.tasks, tasks);
    renderTasks();
  });
  renderTasks();

  // Quick links. Add https:// automatically when the user enters a bare domain.
  const normalizeUrl = (value) => {
    let url = value.trim();
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Skema URL tidak didukung.");
    return parsed.href;
  };
  const renderLinks = () => {
    const container = $("#quick-links");
    container.replaceChildren();
    links.forEach((link) => {
      const wrapper = document.createElement("div");
      wrapper.className = "quick-link";
      const anchor = document.createElement("a");
      anchor.href = link.url;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.style.cssText = "display:inline-flex;align-items:center;gap:8px;color:inherit;text-decoration:none;min-width:0";
      const monogram = document.createElement("span");
      monogram.className = "link-monogram";
      monogram.textContent = link.name.trim().charAt(0).toUpperCase() || "↗";
      const label = document.createElement("span");
      label.textContent = link.name;
      anchor.append(monogram, label);
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "remove-link";
      remove.textContent = "×";
      remove.setAttribute("aria-label", `Hapus tautan ${link.name}`);
      remove.addEventListener("click", () => {
        links = links.filter((entry) => entry.id !== link.id);
        safeWrite(STORAGE_KEYS.links, links);
        renderLinks();
      });
      wrapper.append(anchor, remove);
      container.append(wrapper);
    });
  };
  $("#link-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const nameInput = $("#link-name");
    const urlInput = $("#link-url");
    const message = $("#link-message");
    message.textContent = "";
    const name = nameInput.value.trim();
    if (!name || !urlInput.value.trim()) {
      message.textContent = "Isi nama dan alamat situs terlebih dahulu.";
      return;
    }
    try {
      const url = normalizeUrl(urlInput.value);
      if (links.some((link) => link.url === url || link.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
        message.textContent = "Nama atau alamat tautan itu sudah tersimpan.";
        return;
      }
      links.push({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, name, url });
      safeWrite(STORAGE_KEYS.links, links);
      nameInput.value = "";
      urlInput.value = "";
      renderLinks();
    } catch {
      message.textContent = "Alamat situs belum valid. Coba contoh: https://example.com";
    }
  });
  renderLinks();

  // Theme toggle is persisted across visits.
  const applyTheme = (theme) => {
    const isDark = theme === "dark";
    document.body.classList.toggle("dark-mode", isDark);
    $("#theme-icon").textContent = isDark ? "☀" : "☾";
    $("#theme-toggle").setAttribute("aria-label", isDark ? "Aktifkan tema terang" : "Aktifkan tema gelap");
    $("#theme-toggle").title = isDark ? "Aktifkan tema terang" : "Aktifkan tema gelap";
  };
  applyTheme(safeRead(STORAGE_KEYS.theme, "light"));
  $("#theme-toggle").addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
    safeWrite(STORAGE_KEYS.theme, nextTheme);
    applyTheme(nextTheme);
  });
})();