# Layouts and route groups

A folder in parentheses, like `(main)`, is a **route group**. It organizes files **without adding to the URL**.

This project has **two root layouts**:

- `(main)/layout.jsx` is the dark app shell with the nav.
- `(splash)/layout.jsx` has a transparent `<html>`/`<body>` for the frameless splash.

Each root layout renders its own `<html>` and `<body>`. To add another kind of window (for example a tray popup), create `app/(popup)/layout.jsx` plus `app/(popup)/popup/page.jsx`.
