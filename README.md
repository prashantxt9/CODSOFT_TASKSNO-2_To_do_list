# To-Do List Application

A minimalist, simple, and practical To-Do List application inspired by **Todoist**, built for the **CodSoft Frontend Development Internship (Task 2)**.

Designed with clean typography, distraction-free layouts, simple flat buttons, and intuitive task management.

---

## 🌟 Key Features

### 1. Minimalist & Intuitive Design (Todoist Interface)
- **User Profile & Navigation**: Header with user avatar, name (`Ngkygt4434`), notification bell, and sidebar collapse button.
- **Finish Your Setup Guide**: Dynamic 3-stage milestone tracker (`X/3 complete`) with progress segments.
- **Smart Sidebar Views**:
  - **Search**: Fast task search filter (keyboard shortcut: `/`).
  - **Inbox**: Default capture view for daily tasks.
  - **Today**: Auto-filtered view for tasks scheduled for the current date.
  - **Upcoming**: Future scheduled tasks.
  - **Filters & Labels**: Multi-criteria categorization.
  - **Reporting & Completed**: History of finished tasks.
- **Projects / Categories**: Collapsible **My Projects** section with **Work**, **Personal**, and **Study** categories.
- **Empty State Illustration**: Matching yellow inbox tray with soft foliage, sparkle stars, and the "Capture now, plan later" prompt.

### 2. Simple Flat Buttons & Inline Composer
- **All buttons are simple**: No heavy gradients or excessive 3D shadows; crisp, flat, rounded buttons with subtle hover feedback.
- **Inline Task Composer**: Clean expandable form with task name, description, date picker, priority dropdown, project picker, and simple "Cancel" / "Add task" buttons.

### 3. Core Task Operations (Task 2 Requirements)
- **Add Task**: Validates input to prevent blank submissions.
- **Edit Task**: Minimalist modal dialog for modifying title, project, priority, and due date.
- **Delete Task**: Safe confirmation dialog before permanent deletion.
- **Mark Complete**: Instant circular checkbox toggle with strike-through styling.
- **Live Statistics**: Counters for **Total Tasks**, **Pending Tasks**, and **Completed Tasks**.
- **Display View Options**: Popover for sorting by Due Date, Priority, Date Added, or Alphabetical order.
- **LocalStorage Persistence**: Tasks and theme preferences persist across reloads.
- **Light & Dark Theme**: Toggle between crisp white and sleek dark modes.

---

## 🛠️ Technology Stack

- **HTML5**: Semantic markup with SVG vector assets.
- **CSS3**: Modern CSS custom properties, flexbox, and responsive media queries.
- **Vanilla JavaScript**: Zero dependencies, clean event delegation, and LocalStorage synchronization.

---

## 🚀 How to Run Locally

1. Open `index.html` directly in your web browser.
2. Or run a local HTTP server:
   ```bash
   python -m http.server 5500
   ```
   Open `http://localhost:5500` in your browser.

---

## 📄 License & Attribution

Developed for **CodSoft Frontend Development Internship** — Task 2.
Built with Vanilla Web Technologies (HTML5, CSS3, JavaScript).
