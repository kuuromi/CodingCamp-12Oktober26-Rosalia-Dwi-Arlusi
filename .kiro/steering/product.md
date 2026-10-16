# Daymark — Life Dashboard

Daymark is a personal productivity dashboard built as a single-page web app. It runs entirely in the browser with no backend or build step required.

## Core Features
- **Real-time clock & greeting** — time-aware greeting in Indonesian, personalized with a saved nickname
- **Focus timer** — 25-minute Pomodoro-style countdown with start, pause, and reset controls
- **To-do list** — add, inline-edit, complete, and delete tasks; duplicate active tasks are prevented (on both add and edit); data persists via `localStorage`
- **Quick links** — save and remove frequently visited URLs with auto-`https://` normalization
- **Light/dark theme** — toggleable, persisted across sessions
- **Fully responsive** — works on mobile (320px+) and desktop

## Audience & Language
The UI language is **Indonesian (Bahasa Indonesia)**. All user-facing strings, labels, and messages must remain in Indonesian unless the user explicitly requests otherwise.

## Data Persistence
All user data (tasks, links, nickname, theme) is stored in `localStorage` under namespaced keys (`daymark.*`). There is no server, database, or sync mechanism.
