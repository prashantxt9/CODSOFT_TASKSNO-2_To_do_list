/**
 * Todoist — Simple, Clean & Practical To-Do List Application
 * CodSoft Frontend Development Internship — Task 2
 *
 * Implements:
 * - Clean Todoist design matching screenshot
 * - Simple flat buttons across the entire UI
 * - Smart sidebar views: Inbox, Today, Upcoming, Filters & Labels, Completed, Projects
 * - Full CRUD: Add, inline composer, edit modal, delete confirmation, toggle completion
 * - Search, sort, and status filter
 * - Setup progress tracker (0/3 complete)
 * - Required Task 2 Stats (Total, Pending, Completed)
 * - Dark & Light mode with LocalStorage persistence
 */

(() => {
  'use strict';

  // =========================================================================
  // Storage Keys & State
  // =========================================================================
  const STORAGE_KEY_TASKS = 'todoist_tasks_v2';
  const STORAGE_KEY_THEME = 'todoist_theme_v2';
  const STORAGE_KEY_SETUP_DISMISSED = 'todoist_setup_dismissed';
  const STORAGE_KEY_USER = 'todoist_user_v2';

  let currentUser = {
    name: 'Ngkygt4434',
    email: 'ngkygt4434@todoist.me',
    isLoggedIn: true
  };

  let tasks = [];
  let currentNav = 'inbox'; // 'inbox' | 'today' | 'upcoming' | 'filters' | 'completed' | 'project'
  let currentProject = null; // null | 'Work' | 'Personal' | 'Study'
  let currentStatusFilter = 'all'; // 'all' | 'pending' | 'completed'
  let currentSort = 'date-asc';
  let searchQuery = '';

  // =========================================================================
  // DOM Elements
  // =========================================================================
  // Profile & Auth Elements
  const profileDropdownBtn = document.getElementById('profile-dropdown-btn');
  const sidebarAvatar = document.getElementById('sidebar-avatar');
  const profileName = document.getElementById('profile-name');
  const profilePopover = document.getElementById('profile-popover');
  const popoverAvatar = document.getElementById('popover-avatar');
  const popoverName = document.getElementById('popover-name');
  const popoverEmail = document.getElementById('popover-email');
  const btnSwitchAccount = document.getElementById('btn-switch-account');
  const btnLogout = document.getElementById('btn-logout');

  // Auth Modal Elements
  const authModal = document.getElementById('auth-modal');
  const authForm = document.getElementById('auth-form');
  const authUsernameInput = document.getElementById('auth-username-input');
  const authEmailInput = document.getElementById('auth-email-input');
  const authInputError = document.getElementById('auth-input-error');
  const closeAuthModalBtn = document.getElementById('close-auth-modal-btn');
  const cancelAuthBtn = document.getElementById('cancel-auth-btn');

  const appSidebar = document.getElementById('app-sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const sidebarCollapseBtn = document.getElementById('sidebar-collapse-btn');
  const sidebarAddBtn = document.getElementById('sidebar-add-btn');
  const sidebarVoiceBtn = document.getElementById('sidebar-voice-btn');

  const setupCard = document.getElementById('setup-card');
  const closeSetupBtn = document.getElementById('close-setup-btn');
  const setupProgressText = document.getElementById('setup-progress-text');
  const seg1 = document.getElementById('seg-1');
  const seg2 = document.getElementById('seg-2');
  const seg3 = document.getElementById('seg-3');

  const currentViewTitle = document.getElementById('current-view-title');
  const sidebarTodayNum = document.getElementById('sidebar-today-num');

  // Sidebar Badges
  const badgeInbox = document.getElementById('badge-inbox');
  const badgeToday = document.getElementById('badge-today');
  const badgeUpcoming = document.getElementById('badge-upcoming');
  const badgeCalendar = document.getElementById('badge-calendar');
  const badgeCompleted = document.getElementById('badge-completed');
  const badgeCatWork = document.getElementById('badge-cat-work');
  const badgeCatPersonal = document.getElementById('badge-cat-personal');
  const badgeCatStudy = document.getElementById('badge-cat-study');

  // Projects Toggle
  const projectsToggleBtn = document.getElementById('projects-toggle-btn');
  const projectsSection = projectsToggleBtn ? projectsToggleBtn.closest('.projects-section') : null;

  // Header Actions
  const displayBtn = document.getElementById('display-btn');
  const displayPopover = document.getElementById('display-popover');
  const closeDisplayPopover = document.getElementById('close-display-popover');
  const sortSelect = document.getElementById('sort-select');
  const popoverTabPills = document.querySelectorAll('.filter-tab-pills .tab-pill');

  // Focus Mode Elements
  const focusModeBtn = document.getElementById('focus-mode-btn');
  const focusModeOverlay = document.getElementById('focus-mode-overlay');
  const focusExitBtn = document.getElementById('focus-exit-btn');
  const focusFullscreenBtn = document.getElementById('focus-fullscreen-btn');
  const focusTaskSelect = document.getElementById('focus-task-select');
  const focusClockDigits = document.getElementById('focus-clock-digits');
  const focusClockDate = document.getElementById('focus-clock-date');
  const focusTimerDigits = document.getElementById('focus-timer-digits');
  const focusTimerToggleBtn = document.getElementById('focus-timer-toggle-btn');
  const focusPlayIcon = document.getElementById('focus-play-icon');
  const focusPauseIcon = document.getElementById('focus-pause-icon');
  const focusToggleLabel = document.getElementById('focus-toggle-label');
  const focusTimerResetBtn = document.getElementById('focus-timer-reset-btn');
  const focusActiveTaskBanner = document.getElementById('focus-active-task-banner');
  const focusActiveTaskTitle = document.getElementById('focus-active-task-title');
  const focusCompleteTaskBtn = document.getElementById('focus-complete-task-btn');

  // Calendar View Elements
  const calendarView = document.getElementById('calendar-view');
  const calendarMonthTitle = document.getElementById('calendar-month-title');
  const calendarPrevBtn = document.getElementById('calendar-prev-btn');
  const calendarNextBtn = document.getElementById('calendar-next-btn');
  const calendarTodayBtn = document.getElementById('calendar-today-btn');
  const calendarGrid = document.getElementById('calendar-grid');

  // Theme Toggles
  const themeToggle = document.getElementById('theme-toggle');
  const sidebarThemeBtn = document.getElementById('sidebar-theme-btn');
  const toastContainer = document.getElementById('toast-container');

  // Search Bar Elements
  const searchBarContainer = document.getElementById('search-bar-container');
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const closeSearchBtn = document.getElementById('close-search-btn');

  // Stats Counters & Clean Bar
  const cleanStatsBar = document.getElementById('clean-stats-bar');
  const barStatTotal = document.getElementById('bar-stat-total');
  const barStatPending = document.getElementById('bar-stat-pending');
  const barStatCompleted = document.getElementById('bar-stat-completed');
  const statTotal = document.getElementById('stat-total');
  const statPending = document.getElementById('stat-pending');
  const statCompleted = document.getElementById('stat-completed');
  const clearCompletedBtn = document.getElementById('clear-completed-btn');

  // Task List & Empty State
  const taskListEl = document.getElementById('task-list');
  const emptyStateEl = document.getElementById('empty-state');
  const emptyAddBtn = document.getElementById('empty-add-btn');
  const emptySearchStateEl = document.getElementById('empty-search-state');
  const resetFiltersBtn = document.getElementById('reset-filters-btn');

  // Inline Composer Elements
  const inlineComposerWrapper = document.getElementById('inline-composer-wrapper');
  const listAddTaskBtn = document.getElementById('list-add-task-btn');
  const taskForm = document.getElementById('task-form');
  const taskTitleInput = document.getElementById('task-title-input');
  const taskDescInput = document.getElementById('task-desc-input');
  const taskDueDateInput = document.getElementById('task-due-date-input');
  const taskDueTimeInput = document.getElementById('task-due-time-input');
  const taskPrioritySelect = document.getElementById('task-priority-select');
  const taskCategorySelect = document.getElementById('task-category-select');
  const cancelComposerBtn = document.getElementById('cancel-composer-btn');
  const inputErrorEl = document.getElementById('input-error');

  // Edit Modal Elements
  const editModal = document.getElementById('edit-modal');
  const editForm = document.getElementById('edit-form');
  const editTaskIdInput = document.getElementById('edit-task-id');
  const editTitleInput = document.getElementById('edit-title-input');
  const editCategorySelect = document.getElementById('edit-category-select');
  const editPrioritySelect = document.getElementById('edit-priority-select');
  const editDueDateInput = document.getElementById('edit-due-date-input');
  const editDueTimeInput = document.getElementById('edit-due-time-input');
  const editInputError = document.getElementById('edit-input-error');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');

  // Delete Modal Elements
  const deleteModal = document.getElementById('delete-modal');
  const deleteTaskIdInput = document.getElementById('delete-task-id');
  const closeDeleteModalBtn = document.getElementById('close-delete-modal-btn');
  const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

  // Reminder Modal Elements
  const reminderModal = document.getElementById('reminder-modal');
  const reminderTaskId = document.getElementById('reminder-task-id');
  const reminderTaskTitle = document.getElementById('reminder-task-title');
  const reminderTaskDesc = document.getElementById('reminder-task-desc');
  const reminderTimeLabel = document.getElementById('reminder-time-label');
  const reminderProjectBadge = document.getElementById('reminder-project-badge');
  const reminderPriorityBadge = document.getElementById('reminder-priority-badge');
  const reminderDismissBtn = document.getElementById('reminder-dismiss-btn');
  const reminderSnoozeBtn = document.getElementById('reminder-snooze-btn');
  const reminderCompleteBtn = document.getElementById('reminder-complete-btn');

  // =========================================================================
  // Initialize
  // =========================================================================
  function init() {
    initTheme();
    loadUser();
    loadTasks();
    initSetupWidget();
    setTodayIconNumber();
    initReminderEngine();
    attachEventListeners();
    render();
  }

  // =========================================================================
  // User Profile & Authentication Management
  // =========================================================================
  function loadUser() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      if (stored) {
        currentUser = JSON.parse(stored);
      }
    } catch {
      currentUser = {
        name: 'Ngkygt4434',
        email: 'ngkygt4434@todoist.me',
        isLoggedIn: true
      };
    }
    updateProfileUI();
  }

  function saveUser() {
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    } catch (e) {
      console.error('Error saving user to LocalStorage:', e);
    }
  }

  function updateProfileUI() {
    const isLoggedIn = Boolean(currentUser && currentUser.isLoggedIn && currentUser.name && currentUser.name.trim());

    if (isLoggedIn) {
      const name = currentUser.name.trim();
      const initial = name.charAt(0).toUpperCase() || 'U';
      const email = currentUser.email || `${name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'user'}@todoist.me`;

      if (sidebarAvatar) {
        sidebarAvatar.classList.remove('is-guest');
        sidebarAvatar.textContent = initial;
      }
      if (profileName) profileName.textContent = name;
      if (popoverAvatar) {
        popoverAvatar.classList.remove('is-guest');
        popoverAvatar.textContent = initial;
      }
      if (popoverName) popoverName.textContent = name;
      if (popoverEmail) popoverEmail.textContent = email;

      if (btnLogout) btnLogout.classList.remove('hidden');
      if (btnSwitchAccount) {
        const span = btnSwitchAccount.querySelector('span');
        if (span) span.textContent = 'Switch account';
      }
    } else {
      if (sidebarAvatar) {
        sidebarAvatar.classList.add('is-guest');
        sidebarAvatar.innerHTML = `
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        `;
      }
      if (profileName) profileName.textContent = 'Sign in';
      if (popoverAvatar) {
        popoverAvatar.classList.add('is-guest');
        popoverAvatar.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        `;
      }
      if (popoverName) popoverName.textContent = 'Not signed in';
      if (popoverEmail) popoverEmail.textContent = 'Click to sign in';

      if (btnLogout) btnLogout.classList.add('hidden');
      if (btnSwitchAccount) {
        const span = btnSwitchAccount.querySelector('span');
        if (span) span.textContent = 'Sign in';
      }
    }
  }

  function toggleProfilePopover(e) {
    if (e) e.stopPropagation();
    // If user is not logged in, clicking the profile header directly opens the sign in modal
    if (!currentUser || !currentUser.isLoggedIn || !currentUser.name) {
      openAuthModal('', true);
      return;
    }
    if (!profilePopover) return;
    const isHidden = profilePopover.classList.contains('hidden');
    if (isHidden) {
      profilePopover.classList.remove('hidden');
      if (profileDropdownBtn) profileDropdownBtn.setAttribute('aria-expanded', 'true');
    } else {
      closeProfilePopover();
    }
  }

  function closeProfilePopover() {
    if (profilePopover) {
      profilePopover.classList.add('hidden');
      if (profileDropdownBtn) profileDropdownBtn.setAttribute('aria-expanded', 'false');
    }
  }

  function openAuthModal(prefill = '', isBlank = false) {
    clearInputError(authUsernameInput, authInputError);
    if (isBlank) {
      authUsernameInput.value = '';
      authEmailInput.value = '';
    } else {
      authUsernameInput.value = prefill || (currentUser && currentUser.isLoggedIn ? currentUser.name : '');
      authEmailInput.value = (currentUser && currentUser.isLoggedIn && currentUser.email) ? currentUser.email : '';
    }
    authModal.classList.remove('hidden');
    setTimeout(() => {
      if (authUsernameInput) authUsernameInput.focus();
    }, 60);
  }

  function closeAuthModal() {
    authModal.classList.add('hidden');
    clearInputError(authUsernameInput, authInputError);
  }

  function handleAuthSubmit(e) {
    e.preventDefault();
    const username = authUsernameInput.value.trim();
    if (!username) {
      showInputError(authUsernameInput, authInputError, 'Please enter a user name.');
      return;
    }

    const email = authEmailInput.value.trim() || `${username.toLowerCase().replace(/[^a-z0-9]/g, '') || 'user'}@todoist.me`;

    currentUser = {
      name: username,
      email: email,
      isLoggedIn: true
    };

    saveUser();
    updateProfileUI();
    loadTasks();
    render();
    closeAuthModal();
    showToast(`Signed in as ${username}`);
  }

  function handleLogout(e) {
    if (e) e.stopPropagation();
    closeProfilePopover();
    currentUser = {
      name: '',
      email: '',
      isLoggedIn: false
    };
    saveUser();
    updateProfileUI();
    loadTasks();
    render();
    showToast('Logged out successfully');
    openAuthModal('', true);
  }

  // =========================================================================
  // Theme Management
  // =========================================================================
  function initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem(STORAGE_KEY_THEME, nextTheme);
  }

  // =========================================================================
  // Toast Notification
  // =========================================================================
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>${escapeHTML(message)}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-leave');
      setTimeout(() => toast.remove(), 250);
    }, 2600);
  }

  // =========================================================================
  // LocalStorage Persistence
  // =========================================================================
  function getTaskStorageKey() {
    const userKey = (currentUser && currentUser.isLoggedIn && currentUser.name && currentUser.name.trim())
      ? currentUser.name.trim().toLowerCase().replace(/[^a-z0-9]/g, '_')
      : 'guest';
    return `todoist_tasks_v2_${userKey}`;
  }

  function loadTasks() {
    try {
      const key = getTaskStorageKey();
      const stored = localStorage.getItem(key);
      if (stored) {
        tasks = JSON.parse(stored);
      } else {
        // First time fallback: check general storage
        const legacyStored = localStorage.getItem(STORAGE_KEY_TASKS);
        if (legacyStored && (!currentUser || currentUser.name === 'Ngkygt4434' || currentUser.name === 'Prashant Kumar')) {
          tasks = JSON.parse(legacyStored);
          localStorage.setItem(key, JSON.stringify(tasks));
        } else {
          tasks = [];
        }
      }
      if (!Array.isArray(tasks)) tasks = [];
    } catch {
      tasks = [];
    }
  }

  function saveTasks() {
    try {
      const key = getTaskStorageKey();
      localStorage.setItem(key, JSON.stringify(tasks));
    } catch (e) {
      console.error('Error saving tasks to LocalStorage:', e);
    }
  }

  // =========================================================================
  // Setup Widget Progress Tracker
  // =========================================================================
  function initSetupWidget() {
    const isDismissed = localStorage.getItem(STORAGE_KEY_SETUP_DISMISSED);
    if (isDismissed === 'true' && setupCard) {
      setupCard.classList.add('hidden');
    }
    updateSetupProgress();
  }

  function updateSetupProgress() {
    if (!setupCard || setupCard.classList.contains('hidden')) return;

    // 3 milestones:
    // 1: Created at least 1 task
    const milestone1 = tasks.length > 0;
    // 2: Set priority or due date on any task
    const milestone2 = tasks.some(t => t.dueDate || (t.priority && t.priority !== 'Normal'));
    // 3: Completed at least 1 task
    const milestone3 = tasks.some(t => t.completed);

    let completedMilestones = 0;
    if (milestone1) completedMilestones++;
    if (milestone2) completedMilestones++;
    if (milestone3) completedMilestones++;

    setupProgressText.textContent = `${completedMilestones}/3 complete`;

    seg1.classList.toggle('filled', milestone1);
    seg2.classList.toggle('filled', milestone2);
    seg3.classList.toggle('filled', milestone3);
  }

  function dismissSetupWidget() {
    if (setupCard) {
      setupCard.classList.add('hidden');
      localStorage.setItem(STORAGE_KEY_SETUP_DISMISSED, 'true');
    }
  }

  // =========================================================================
  // Today Icon Calendar Date
  // =========================================================================
  function setTodayIconNumber() {
    if (sidebarTodayNum) {
      const todayDate = new Date().getDate();
      sidebarTodayNum.textContent = todayDate;
    }
  }

  // =========================================================================
  // Inline Task Composer Management
  // =========================================================================
  function openTaskComposer() {
    taskForm.classList.remove('hidden');
    listAddTaskBtn.classList.add('hidden');
    
    // Default project to current category if in a project view
    if (currentProject) {
      taskCategorySelect.value = currentProject;
    } else {
      taskCategorySelect.value = 'Inbox';
    }

    // Default date to today if in Today view
    if (currentNav === 'today') {
      taskDueDateInput.value = getTodayDateString();
    }

    taskTitleInput.focus();
    taskForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function closeTaskComposer() {
    taskForm.classList.add('hidden');
    listAddTaskBtn.classList.remove('hidden');
    taskTitleInput.value = '';
    taskDescInput.value = '';
    taskDueDateInput.value = '';
    if (taskDueTimeInput) taskDueTimeInput.value = '';
    taskPrioritySelect.value = 'Medium';
    taskCategorySelect.value = 'Inbox';
    clearInputError(taskTitleInput, inputErrorEl);
  }

  function handleAddTask(e) {
    e.preventDefault();

    const title = taskTitleInput.value.trim();
    if (!title) {
      showInputError(taskTitleInput, inputErrorEl, 'Task name cannot be empty.');
      return;
    }

    clearInputError(taskTitleInput, inputErrorEl);

    const newTask = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      title: title,
      description: taskDescInput.value.trim(),
      category: taskCategorySelect.value || 'Inbox',
      priority: taskPrioritySelect.value || 'Medium',
      dueDate: taskDueDateInput.value || '',
      dueTime: taskDueTimeInput ? taskDueTimeInput.value : '',
      completed: false,
      createdAt: Date.now()
    };

    tasks.unshift(newTask);
    saveTasks();
    showToast('Task added');

    closeTaskComposer();
    render();
  }

  // =========================================================================
  // Task Actions: Toggle, Edit, Delete
  // =========================================================================
  function toggleTaskStatus(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    task.completed = !task.completed;
    saveTasks();

    if (task.completed) {
      showToast('1 task completed');
    }

    render();
  }

  function openEditModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    clearInputError(editTitleInput, editInputError);
    editTaskIdInput.value = task.id;
    editTitleInput.value = task.title;
    editCategorySelect.value = task.category || 'Inbox';
    editPrioritySelect.value = task.priority || 'Medium';
    editDueDateInput.value = task.dueDate || '';
    if (editDueTimeInput) editDueTimeInput.value = task.dueTime || '';

    editModal.classList.remove('hidden');
    editTitleInput.focus();
  }

  function closeEditModal() {
    editModal.classList.add('hidden');
    clearInputError(editTitleInput, editInputError);
  }

  function handleSaveEdit(e) {
    e.preventDefault();

    const taskId = editTaskIdInput.value;
    const updatedTitle = editTitleInput.value.trim();

    if (!updatedTitle) {
      showInputError(editTitleInput, editInputError, 'Task name cannot be empty.');
      return;
    }

    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.title = updatedTitle;
      task.category = editCategorySelect.value;
      task.priority = editPrioritySelect.value;
      task.dueDate = editDueDateInput.value;
      task.dueTime = editDueTimeInput ? editDueTimeInput.value : '';
      saveTasks();
      showToast('Task updated');
    }

    closeEditModal();
    render();
  }

  function openDeleteModal(taskId) {
    deleteTaskIdInput.value = taskId;
    deleteModal.classList.remove('hidden');
  }

  function closeDeleteModal() {
    deleteModal.classList.add('hidden');
    deleteTaskIdInput.value = '';
  }

  function handleConfirmDelete() {
    const taskId = deleteTaskIdInput.value;
    if (taskId) {
      tasks = tasks.filter(t => t.id !== taskId);
      saveTasks();
      showToast('Task deleted');
      render();
    }
    closeDeleteModal();
  }

  function handleClearCompleted() {
    const count = tasks.filter(t => t.completed).length;
    if (count === 0) return;

    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    showToast(`Cleared ${count} completed task${count > 1 ? 's' : ''}`);
    render();
  }

  // =========================================================================
  // Navigation & Views
  // =========================================================================
  function handleNavSelection(navType, projectName = null) {
    currentNav = navType;
    currentProject = projectName;

    // Reset active nav item styling
    document.querySelectorAll('.sidebar-nav .nav-item, .projects-list .project-item').forEach(item => {
      item.classList.remove('active');
    });

    if (projectName) {
      const projectBtn = document.querySelector(`[data-category="${projectName}"]`);
      if (projectBtn) projectBtn.classList.add('active');
      currentViewTitle.textContent = projectName;
    } else {
      const activeBtn = document.getElementById(`nav-${navType}`);
      if (activeBtn) activeBtn.classList.add('active');

      const titleMap = {
        inbox: 'Inbox',
        today: 'Today',
        upcoming: 'Upcoming',
        calendar: 'Calendar',
        filters: 'Filters & Labels',
        completed: 'Completed'
      };
      currentViewTitle.textContent = titleMap[navType] || 'Inbox';
    }

    closeMobileSidebar();
    render();
  }

  function openMobileSidebar() {
    appSidebar.classList.add('is-open');
    sidebarBackdrop.classList.remove('hidden');
  }

  function closeMobileSidebar() {
    appSidebar.classList.remove('is-open');
    sidebarBackdrop.classList.add('hidden');
  }

  // =========================================================================
  // Filtering & Sorting
  // =========================================================================
  function getFilteredTasks() {
    const todayStr = getTodayDateString();

    let filtered = tasks.filter(task => {
      // 1. Navigation View Filtering
      if (currentNav === 'inbox') {
        // Inbox shows tasks marked for Inbox, or all active tasks
        if (task.completed && currentStatusFilter !== 'completed' && currentStatusFilter !== 'all') return false;
      } else if (currentNav === 'today') {
        if (task.dueDate !== todayStr) return false;
      } else if (currentNav === 'upcoming') {
        if (!task.dueDate || task.dueDate <= todayStr) return false;
      } else if (currentNav === 'completed') {
        if (!task.completed) return false;
      }

      // 2. Project Filtering
      if (currentProject) {
        if (task.category !== currentProject) return false;
      }

      // 3. Status Filter (All / Pending / Done)
      if (currentNav !== 'completed') {
        if (currentStatusFilter === 'pending' && task.completed) return false;
        if (currentStatusFilter === 'completed' && !task.completed) return false;
      }

      // 4. Search Filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(q);
        const matchDesc = task.description && task.description.toLowerCase().includes(q);
        const matchCat = task.category && task.category.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchCat) return false;
      }

      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      if (currentSort === 'date-asc') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      } else if (currentSort === 'priority-desc') {
        const rank = { High: 3, Medium: 2, Low: 1 };
        const rankA = rank[a.priority] || 2;
        const rankB = rank[b.priority] || 2;
        return rankB - rankA;
      } else if (currentSort === 'created-desc') {
        return (b.createdAt || 0) - (a.createdAt || 0);
      } else if (currentSort === 'alpha-asc') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return filtered;
  }

  function resetAllFilters() {
    searchQuery = '';
    currentStatusFilter = 'all';
    searchInput.value = '';
    clearSearchBtn.classList.add('hidden');
    searchBarContainer.classList.add('hidden');

    popoverTabPills.forEach(p => {
      const isAll = p.dataset.filter === 'all';
      p.classList.toggle('active', isAll);
    });

    handleNavSelection('inbox');
  }

  // =========================================================================
  // Rendering
  // =========================================================================
  function render() {
    updateBadges();
    renderStats();
    updateSetupProgress();

    if (currentNav === 'calendar') {
      if (calendarView) calendarView.classList.remove('hidden');
      if (taskListEl) taskListEl.classList.add('hidden');
      if (inlineComposerWrapper) inlineComposerWrapper.classList.add('hidden');
      if (emptyStateEl) emptyStateEl.classList.add('hidden');
      if (emptySearchStateEl) emptySearchStateEl.classList.add('hidden');
      if (cleanStatsBar) cleanStatsBar.classList.add('hidden');
      renderCalendarGrid();
    } else {
      if (calendarView) calendarView.classList.add('hidden');
      if (taskListEl) taskListEl.classList.remove('hidden');
      if (inlineComposerWrapper) inlineComposerWrapper.classList.remove('hidden');
      if (cleanStatsBar) cleanStatsBar.classList.remove('hidden');
      renderTaskList();
    }
  }

  function updateBadges() {
    const todayStr = getTodayDateString();

    const inboxCount = tasks.filter(t => !t.completed).length;
    const todayCount = tasks.filter(t => !t.completed && t.dueDate === todayStr).length;
    const upcomingCount = tasks.filter(t => !t.completed && t.dueDate && t.dueDate > todayStr).length;
    const calendarCount = tasks.filter(t => !t.completed && t.dueDate).length;
    const completedCount = tasks.filter(t => t.completed).length;

    if (badgeInbox) badgeInbox.textContent = inboxCount;
    if (badgeToday) badgeToday.textContent = todayCount;
    if (badgeUpcoming) badgeUpcoming.textContent = upcomingCount;
    if (badgeCalendar) badgeCalendar.textContent = calendarCount;
    if (badgeCompleted) badgeCompleted.textContent = completedCount;

    if (badgeCatWork) badgeCatWork.textContent = tasks.filter(t => t.category === 'Work' && !t.completed).length;
    if (badgeCatPersonal) badgeCatPersonal.textContent = tasks.filter(t => t.category === 'Personal' && !t.completed).length;
    if (badgeCatStudy) badgeCatStudy.textContent = tasks.filter(t => t.category === 'Study' && !t.completed).length;
  }

  function renderStats() {
    const totalCount = tasks.length;
    const completedCount = tasks.filter(t => t.completed).length;
    const pendingCount = totalCount - completedCount;

    // Popover Stats
    statTotal.textContent = totalCount;
    statPending.textContent = pendingCount;
    statCompleted.textContent = completedCount;

    // Clean Minimalist Bar Stats
    barStatTotal.textContent = totalCount;
    barStatPending.textContent = pendingCount;
    barStatCompleted.textContent = completedCount;

    clearCompletedBtn.classList.toggle('hidden', completedCount === 0);
  }

  function renderTaskList() {
    const filteredTasks = getFilteredTasks();
    taskListEl.innerHTML = '';

    const hasAnyTasks = tasks.length > 0;

    if (!hasAnyTasks) {
      // Empty state matching the screenshot!
      emptyStateEl.classList.remove('hidden');
      emptySearchStateEl.classList.add('hidden');
      listAddTaskBtn.classList.add('hidden');
      return;
    }

    emptyStateEl.classList.add('hidden');

    if (filteredTasks.length === 0) {
      emptySearchStateEl.classList.remove('hidden');
      listAddTaskBtn.classList.add('hidden');
      return;
    }

    emptySearchStateEl.classList.add('hidden');
    listAddTaskBtn.classList.toggle('hidden', !taskForm.classList.contains('hidden'));

    const fragment = document.createDocumentFragment();
    filteredTasks.forEach(task => {
      const li = createTaskElement(task);
      fragment.appendChild(li);
    });

    taskListEl.appendChild(fragment);
  }

  function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `todoist-task-item ${task.completed ? 'is-completed' : ''}`;
    li.dataset.id = task.id;

    const todayStr = getTodayDateString();
    const isOverdue = !task.completed && task.dueDate && task.dueDate < todayStr;
    const isDueToday = !task.completed && task.dueDate && task.dueDate === todayStr;

    const priorityClass = task.priority ? `tag-priority-${task.priority.toLowerCase()}` : '';

    li.innerHTML = `
      <div class="task-item-main">
        <label class="task-checkbox-wrap" aria-label="Mark task as ${task.completed ? 'uncompleted' : 'completed'}">
          <input type="checkbox" class="task-checkbox-input" ${task.completed ? 'checked' : ''} data-action="toggle" />
          <span class="task-checkbox-circle">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
        </label>

        <div class="task-info-block">
          <div class="task-title-line">${escapeHTML(task.title)}</div>
          ${task.description ? `<div class="task-desc-line">${escapeHTML(task.description)}</div>` : ''}

          <div class="task-meta-tags">
            ${task.dueDate ? `
              <span class="task-meta-tag is-due ${isOverdue ? 'is-overdue' : ''}">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                ${formatDate(task.dueDate)}${task.dueTime ? ' at ' + formatTime(task.dueTime) : ''} ${isOverdue ? '(Overdue)' : ''} ${isDueToday ? '(Today)' : ''}
              </span>
            ` : ''}

            ${task.priority ? `
              <span class="task-meta-tag ${priorityClass}">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                  <line x1="4" y1="22" x2="4" y2="15"></line>
                </svg>
                ${escapeHTML(task.priority)}
              </span>
            ` : ''}

            ${task.category && task.category !== 'Inbox' ? `
              <span class="task-meta-tag task-meta-project">
                # ${escapeHTML(task.category)}
              </span>
            ` : ''}
          </div>
        </div>
      </div>

      <div class="task-item-actions">
        <button class="btn-task-action btn-task-check" data-action="toggle" title="${task.completed ? 'Mark as incomplete' : 'Mark as complete'}" aria-label="${task.completed ? 'Mark as incomplete' : 'Mark as complete'}">
          ${task.completed ? `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="3" fill="#16a34a" stroke="#16a34a"></rect>
              <polyline points="7 12 10 15 17 8" stroke="#ffffff" stroke-width="2.5"></polyline>
            </svg>
          ` : `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="3"></rect>
            </svg>
          `}
        </button>
        <button class="btn-task-action" data-action="edit" title="Edit task" aria-label="Edit task">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button class="btn-task-action btn-task-delete" data-action="delete" title="Delete task" aria-label="Delete task">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    `;

    return li;
  }

  // =========================================================================
  // Helpers & Formatters
  // =========================================================================
  function getTodayDateString() {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function formatDate(dateString) {
    if (!dateString) return '';
    try {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const date = new Date(year, month, day);
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      }
      return dateString;
    } catch {
      return dateString;
    }
  }

  function formatTime(timeString) {
    if (!timeString) return '';
    try {
      const parts = timeString.split(':');
      if (parts.length >= 2) {
        let h = parseInt(parts[0], 10);
        const m = parts[1];
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return `${h}:${m} ${ampm}`;
      }
      return timeString;
    } catch {
      return timeString;
    }
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function showInputError(inputEl, errorEl, message) {
    inputEl.style.borderBottom = '1.5px solid #dc4c3e';
    errorEl.textContent = message;
    inputEl.focus();
  }

  function clearInputError(inputEl, errorEl) {
    inputEl.style.borderBottom = '';
    errorEl.textContent = '';
  }

  // =========================================================================
  // Event Listeners
  // =========================================================================
  function attachEventListeners() {
    // Theme Toggles
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (sidebarThemeBtn) sidebarThemeBtn.addEventListener('click', toggleTheme);

    // Mobile Sidebar & Actions
    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileSidebar);
    if (sidebarCollapseBtn) sidebarCollapseBtn.addEventListener('click', openMobileSidebar);
    if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeMobileSidebar);

    const sidebarBellBtn = document.getElementById('sidebar-bell-btn');
    if (sidebarBellBtn) {
      sidebarBellBtn.addEventListener('click', () => {
        checkTaskReminders();
        const todayStr = getTodayDateString();
        const count = tasks.filter(t => !t.completed && t.dueDate === todayStr && t.dueTime).length;
        showToast(count > 0 ? `${count} task reminder${count > 1 ? 's' : ''} scheduled for today` : 'No upcoming reminders scheduled for today');
      });
    }

    // Setup Widget
    if (closeSetupBtn) closeSetupBtn.addEventListener('click', dismissSetupWidget);

    // Projects Section Collapsible
    if (projectsToggleBtn) {
      projectsToggleBtn.addEventListener('click', () => {
        projectsSection.classList.toggle('collapsed');
      });
    }

    // Add Task Triggers
    if (sidebarAddBtn) {
      sidebarAddBtn.addEventListener('click', () => {
        closeMobileSidebar();
        openTaskComposer();
      });
    }

    if (sidebarVoiceBtn) {
      sidebarVoiceBtn.addEventListener('click', () => {
        showToast('Quick audio capture ready');
        openTaskComposer();
      });
    }

    if (listAddTaskBtn) listAddTaskBtn.addEventListener('click', openTaskComposer);
    if (emptyAddBtn) emptyAddBtn.addEventListener('click', openTaskComposer);
    if (cancelComposerBtn) cancelComposerBtn.addEventListener('click', closeTaskComposer);

    // Task Form Submit
    if (taskForm) taskForm.addEventListener('submit', handleAddTask);
    if (taskTitleInput) {
      taskTitleInput.addEventListener('input', () => {
        if (taskTitleInput.value.trim()) clearInputError(taskTitleInput, inputErrorEl);
      });
    }

    // Sidebar Navigation
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const nav = item.dataset.nav;
        const action = item.dataset.action;

        if (action === 'open-search') {
          searchBarContainer.classList.toggle('hidden');
          if (!searchBarContainer.classList.contains('hidden')) {
            searchInput.focus();
          }
          closeMobileSidebar();
          return;
        }

        if (nav) {
          handleNavSelection(nav);
        }
      });
    });

    // Project Items
    document.querySelectorAll('.projects-list .project-item').forEach(item => {
      item.addEventListener('click', () => {
        const cat = item.dataset.category;
        if (cat) handleNavSelection('project', cat);
      });
    });

    // Display Popover
    if (displayBtn) {
      displayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        displayPopover.classList.toggle('hidden');
      });
    }

    if (closeDisplayPopover) {
      closeDisplayPopover.addEventListener('click', () => {
        displayPopover.classList.add('hidden');
      });
    }

    // Profile Dropdown & Auth Events
    if (profileDropdownBtn) {
      profileDropdownBtn.addEventListener('click', toggleProfilePopover);
    }

    if (btnSwitchAccount) {
      btnSwitchAccount.addEventListener('click', (e) => {
        if (e) e.stopPropagation();
        closeProfilePopover();
        openAuthModal(currentUser ? currentUser.name : '');
      });
    }

    if (btnLogout) {
      btnLogout.addEventListener('click', (e) => {
        if (e) e.stopPropagation();
        handleLogout(e);
      });
    }

    if (authForm) authForm.addEventListener('submit', handleAuthSubmit);
    if (closeAuthModalBtn) closeAuthModalBtn.addEventListener('click', closeAuthModal);
    if (cancelAuthBtn) cancelAuthBtn.addEventListener('click', closeAuthModal);
    if (authUsernameInput) {
      authUsernameInput.addEventListener('input', () => {
        if (authUsernameInput.value.trim()) clearInputError(authUsernameInput, authInputError);
      });
    }

    document.addEventListener('click', (e) => {
      if (displayPopover && !displayPopover.contains(e.target) && e.target !== displayBtn) {
        displayPopover.classList.add('hidden');
      }
      if (profilePopover && !profilePopover.contains(e.target) && profileDropdownBtn && !profileDropdownBtn.contains(e.target)) {
        closeProfilePopover();
      }
    });

    // Sort Select
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderTaskList();
      });
    }

    // Status Filter Pills in Popover
    popoverTabPills.forEach(pill => {
      pill.addEventListener('click', () => {
        popoverTabPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentStatusFilter = pill.dataset.filter;
        renderTaskList();
      });
    });

    // Search Box
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        clearSearchBtn.classList.toggle('hidden', searchQuery.length === 0);
        renderTaskList();
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.classList.add('hidden');
        searchInput.focus();
        renderTaskList();
      });
    }

    if (closeSearchBtn) {
      closeSearchBtn.addEventListener('click', () => {
        searchBarContainer.classList.add('hidden');
        searchQuery = '';
        searchInput.value = '';
        clearSearchBtn.classList.add('hidden');
        renderTaskList();
      });
    }

    // Reset Filters Button
    if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetAllFilters);

    // Clear Completed Button
    if (clearCompletedBtn) clearCompletedBtn.addEventListener('click', handleClearCompleted);

    // Delegated actions on Task List
    if (taskListEl) {
      taskListEl.addEventListener('click', (e) => {
        const target = e.target;
        const taskItem = target.closest('.todoist-task-item');
        if (!taskItem) return;

        const taskId = taskItem.dataset.id;

        if (target.matches('[data-action="toggle"]') || target.closest('[data-action="toggle"]')) {
          toggleTaskStatus(taskId);
          return;
        }

        if (target.closest('[data-action="edit"]')) {
          openEditModal(taskId);
          return;
        }

        if (target.closest('[data-action="delete"]')) {
          openDeleteModal(taskId);
          return;
        }
      });
    }

    // Edit Modal Events
    if (editForm) editForm.addEventListener('submit', handleSaveEdit);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeEditModal);
    if (cancelEditBtn) cancelEditBtn.addEventListener('click', closeEditModal);
    if (editTitleInput) {
      editTitleInput.addEventListener('input', () => {
        if (editTitleInput.value.trim()) clearInputError(editTitleInput, editInputError);
      });
    }

    // Delete Modal Events
    if (confirmDeleteBtn) confirmDeleteBtn.addEventListener('click', handleConfirmDelete);
    if (closeDeleteModalBtn) closeDeleteModalBtn.addEventListener('click', closeDeleteModal);
    if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', closeDeleteModal);

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (focusModeOverlay && !focusModeOverlay.classList.contains('hidden')) {
          closeFocusMode();
          return;
        }
        if (reminderModal && !reminderModal.classList.contains('hidden')) {
          dismissReminder();
          return;
        }
        closeProfilePopover();
        if (authModal && !authModal.classList.contains('hidden')) closeAuthModal();
        if (!editModal.classList.contains('hidden')) closeEditModal();
        if (!deleteModal.classList.contains('hidden')) closeDeleteModal();
        if (!searchBarContainer.classList.contains('hidden')) {
          searchBarContainer.classList.add('hidden');
          searchQuery = '';
          searchInput.value = '';
          renderTaskList();
        }
        if (!taskForm.classList.contains('hidden')) closeTaskComposer();
        closeMobileSidebar();
      }

      // Quick search shortcut (when not focusing on input)
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchBarContainer.classList.remove('hidden');
        searchInput.focus();
      }
    });

    // Close modals on backdrop click
    if (authModal) {
      authModal.addEventListener('click', (e) => {
        if (e.target === authModal) closeAuthModal();
      });
    }

    if (editModal) {
      editModal.addEventListener('click', (e) => {
        if (e.target === editModal) closeEditModal();
      });
    }

    if (deleteModal) {
      deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) closeDeleteModal();
      });
    }

    if (reminderModal) {
      reminderModal.addEventListener('click', (e) => {
        if (e.target === reminderModal) dismissReminder();
      });
    }

    // Focus Mode Listeners
    if (focusModeBtn) focusModeBtn.addEventListener('click', openFocusMode);
    if (focusExitBtn) focusExitBtn.addEventListener('click', closeFocusMode);
    if (focusFullscreenBtn) focusFullscreenBtn.addEventListener('click', toggleFocusFullscreen);
    if (focusTimerToggleBtn) focusTimerToggleBtn.addEventListener('click', toggleFocusTimer);
    if (focusTimerResetBtn) focusTimerResetBtn.addEventListener('click', resetFocusTimer);
    if (focusTaskSelect) {
      focusTaskSelect.addEventListener('change', () => {
        selectedFocusTaskId = focusTaskSelect.value;
        updateFocusActiveTaskBanner();
      });
    }
    if (focusCompleteTaskBtn) {
      focusCompleteTaskBtn.addEventListener('click', () => {
        if (selectedFocusTaskId) {
          toggleTaskStatus(selectedFocusTaskId);
          selectedFocusTaskId = '';
          populateFocusTaskSelector();
          showToast('Focus task completed! Keep going!');
        }
      });
    }

    document.querySelectorAll('.focus-timer-presets .preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mins = btn.dataset.minutes;
        if (mins === 'custom') {
          const userMins = prompt('Enter focus time in minutes:', '25');
          const parsed = parseInt(userMins, 10);
          if (!isNaN(parsed) && parsed > 0 && parsed <= 360) {
            setFocusPreset(parsed);
            btn.textContent = `${parsed}m`;
            document.querySelectorAll('.focus-timer-presets .preset-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
          }
        } else {
          setFocusPreset(parseInt(mins, 10));
        }
      });
    });

    // Calendar Listeners
    if (calendarPrevBtn) {
      calendarPrevBtn.addEventListener('click', () => {
        calendarMonth--;
        if (calendarMonth < 0) {
          calendarMonth = 11;
          calendarYear--;
        }
        renderCalendarGrid();
      });
    }

    if (calendarNextBtn) {
      calendarNextBtn.addEventListener('click', () => {
        calendarMonth++;
        if (calendarMonth > 11) {
          calendarMonth = 0;
          calendarYear++;
        }
        renderCalendarGrid();
      });
    }

    if (calendarTodayBtn) {
      calendarTodayBtn.addEventListener('click', () => {
        calendarYear = new Date().getFullYear();
        calendarMonth = new Date().getMonth();
        renderCalendarGrid();
      });
    }

    if (calendarGrid) {
      calendarGrid.addEventListener('click', (e) => {
        const taskChip = e.target.closest('.cal-task-chip');
        if (taskChip) {
          const taskId = taskChip.dataset.taskId;
          if (taskId) openEditModal(taskId);
          return;
        }

        const cell = e.target.closest('.calendar-day-cell');
        if (cell) {
          const dateStr = cell.dataset.date;
          if (dateStr) {
            handleNavSelection('inbox');
            openTaskComposer();
            taskDueDateInput.value = dateStr;
            showToast(`Scheduling task for ${formatDate(dateStr)}`);
          }
        }
      });
    }

    // Reminder Modal Listeners
    if (reminderDismissBtn) reminderDismissBtn.addEventListener('click', dismissReminder);
    if (reminderSnoozeBtn) reminderSnoozeBtn.addEventListener('click', snoozeReminder);
    if (reminderCompleteBtn) reminderCompleteBtn.addEventListener('click', completeReminderTask);
  }

  // =========================================================================
  // Focus Mode Controller
  // =========================================================================
  let focusClockInterval = null;
  let focusTimerInterval = null;
  let focusTimerTotalSeconds = 25 * 60;
  let focusTimerRemainingSeconds = 25 * 60;
  let isFocusTimerRunning = false;
  let selectedFocusTaskId = '';

  function openFocusMode() {
    focusModeOverlay.classList.remove('hidden');
    updateFocusClock();
    if (!focusClockInterval) {
      focusClockInterval = setInterval(updateFocusClock, 1000);
    }
    populateFocusTaskSelector();
    updateFocusTimerDisplay();

    try {
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch {}
  }

  function closeFocusMode() {
    focusModeOverlay.classList.add('hidden');
    if (focusClockInterval) {
      clearInterval(focusClockInterval);
      focusClockInterval = null;
    }
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }

  function toggleFocusFullscreen() {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }

  function updateFocusClock() {
    if (!focusClockDigits || !focusClockDate) return;
    const now = new Date();

    let h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    const hStr = String(h).padStart(2, '0');
    focusClockDigits.textContent = `${hStr}:${m}:${s} ${ampm}`;

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    focusClockDate.textContent = now.toLocaleDateString(undefined, options);
  }

  function populateFocusTaskSelector() {
    if (!focusTaskSelect) return;
    const uncompleted = tasks.filter(t => !t.completed);
    focusTaskSelect.innerHTML = '<option value="">-- Free Focus (No task linked) --</option>';
    uncompleted.forEach(task => {
      const opt = document.createElement('option');
      opt.value = task.id;
      opt.textContent = task.title;
      if (task.id === selectedFocusTaskId) opt.selected = true;
      focusTaskSelect.appendChild(opt);
    });
    updateFocusActiveTaskBanner();
  }

  function updateFocusActiveTaskBanner() {
    if (!focusActiveTaskBanner || !focusActiveTaskTitle) return;
    if (selectedFocusTaskId) {
      const task = tasks.find(t => t.id === selectedFocusTaskId);
      if (task && !task.completed) {
        focusActiveTaskTitle.textContent = task.title;
        focusActiveTaskBanner.classList.remove('hidden');
        return;
      }
    }
    focusActiveTaskBanner.classList.add('hidden');
  }

  function updateFocusTimerDisplay() {
    if (!focusTimerDigits) return;
    const mins = Math.floor(focusTimerRemainingSeconds / 60);
    const secs = focusTimerRemainingSeconds % 60;
    focusTimerDigits.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function toggleFocusTimer() {
    if (isFocusTimerRunning) {
      pauseFocusTimer();
    } else {
      startFocusTimer();
    }
  }

  function startFocusTimer() {
    if (isFocusTimerRunning) return;
    isFocusTimerRunning = true;
    focusPlayIcon.classList.add('hidden');
    focusPauseIcon.classList.remove('hidden');
    focusToggleLabel.textContent = 'Pause';

    focusTimerInterval = setInterval(() => {
      if (focusTimerRemainingSeconds > 0) {
        focusTimerRemainingSeconds--;
        updateFocusTimerDisplay();
      } else {
        completeFocusSession();
      }
    }, 1000);
  }

  function pauseFocusTimer() {
    isFocusTimerRunning = false;
    clearInterval(focusTimerInterval);
    focusPlayIcon.classList.remove('hidden');
    focusPauseIcon.classList.add('hidden');
    focusToggleLabel.textContent = 'Resume';
  }

  function resetFocusTimer() {
    pauseFocusTimer();
    focusTimerRemainingSeconds = focusTimerTotalSeconds;
    updateFocusTimerDisplay();
    focusToggleLabel.textContent = 'Start Focus';
  }

  function setFocusPreset(minutes) {
    pauseFocusTimer();
    focusTimerTotalSeconds = minutes * 60;
    focusTimerRemainingSeconds = focusTimerTotalSeconds;
    updateFocusTimerDisplay();
    focusToggleLabel.textContent = 'Start Focus';

    document.querySelectorAll('.focus-timer-presets .preset-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.minutes == minutes);
    });
  }

  function completeFocusSession() {
    pauseFocusTimer();
    focusTimerRemainingSeconds = focusTimerTotalSeconds;
    updateFocusTimerDisplay();
    focusToggleLabel.textContent = 'Start Focus';

    playChime('focus');
    showToast('Focus session complete! Outstanding work!');
  }

  // =========================================================================
  // Calendar View Controller
  // =========================================================================
  let calendarYear = new Date().getFullYear();
  let calendarMonth = new Date().getMonth();

  function renderCalendarGrid() {
    if (!calendarGrid || !calendarMonthTitle) return;

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    calendarMonthTitle.textContent = `${monthNames[calendarMonth]} ${calendarYear}`;

    const todayStr = getTodayDateString();
    calendarGrid.innerHTML = '';

    const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(calendarYear, calendarMonth, 0).getDate();
    const totalCells = Math.ceil((firstDayIndex + daysInMonth) / 7) * 7;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < totalCells; i++) {
      const cell = document.createElement('div');
      cell.className = 'calendar-day-cell';

      let cellDateStr = '';
      let displayDay = 0;

      if (i < firstDayIndex) {
        displayDay = daysInPrevMonth - (firstDayIndex - i - 1);
        const prevMonth = calendarMonth === 0 ? 11 : calendarMonth - 1;
        const prevYear = calendarMonth === 0 ? calendarYear - 1 : calendarYear;
        cellDateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(displayDay).padStart(2, '0')}`;
        cell.classList.add('is-other-month');
      } else if (i >= firstDayIndex + daysInMonth) {
        displayDay = i - (firstDayIndex + daysInMonth) + 1;
        const nextMonth = calendarMonth === 11 ? 0 : calendarMonth + 1;
        const nextYear = calendarMonth === 11 ? calendarYear + 1 : calendarYear;
        cellDateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(displayDay).padStart(2, '0')}`;
        cell.classList.add('is-other-month');
      } else {
        displayDay = i - firstDayIndex + 1;
        cellDateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(displayDay).padStart(2, '0')}`;
      }

      if (cellDateStr === todayStr) {
        cell.classList.add('is-today');
      }

      cell.dataset.date = cellDateStr;

      const dayTasks = tasks.filter(t => t.dueDate === cellDateStr);

      cell.innerHTML = `
        <div class="calendar-day-header">
          <span class="calendar-day-num">${displayDay}</span>
          <button type="button" class="calendar-cell-add-btn" data-date="${cellDateStr}" title="Add task on ${cellDateStr}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
        <div class="calendar-cell-tasks">
          ${dayTasks.map(t => {
            const prio = (t.priority || 'medium').toLowerCase();
            return `
              <div class="cal-task-chip ${t.completed ? 'is-completed' : ''}" data-task-id="${t.id}" title="${escapeHTML(t.title)} (${t.priority || 'Medium'})">
                <span class="cal-task-dot priority-${prio}"></span>
                <span class="cal-task-title">${escapeHTML(t.title)}</span>
              </div>
            `;
          }).join('')}
        </div>
      `;

      fragment.appendChild(cell);
    }

    calendarGrid.appendChild(fragment);
  }

  // =========================================================================
  // Task Reminder Engine
  // =========================================================================
  const acknowledgedReminders = new Set();
  const snoozedReminders = new Map();
  let reminderCheckInterval = null;

  function initReminderEngine() {
    if (!reminderCheckInterval) {
      reminderCheckInterval = setInterval(checkTaskReminders, 10000);
    }
    setTimeout(checkTaskReminders, 1200);
  }

  function checkTaskReminders() {
    const now = new Date();
    const todayStr = getTodayDateString();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const nowMs = now.getTime();

    const pendingTasks = tasks.filter(t => !t.completed && t.dueDate === todayStr && t.dueTime);

    for (const task of pendingTasks) {
      if (acknowledgedReminders.has(task.id)) continue;

      if (snoozedReminders.has(task.id)) {
        const snoozeUntil = snoozedReminders.get(task.id);
        if (nowMs < snoozeUntil) {
          continue;
        } else {
          snoozedReminders.delete(task.id);
        }
      }

      const [th, tm] = task.dueTime.split(':').map(Number);
      const taskMinutes = th * 60 + tm;
      const currentMinutes = currentHour * 60 + currentMin;

      if (currentMinutes >= taskMinutes && currentMinutes <= taskMinutes + 30) {
        showReminderPopup(task);
        break;
      }
    }
  }

  function showReminderPopup(task) {
    if (!reminderModal || !reminderTaskTitle) return;

    reminderTaskId.value = task.id;
    reminderTaskTitle.textContent = task.title;
    if (task.description) {
      reminderTaskDesc.textContent = task.description;
      reminderTaskDesc.classList.remove('hidden');
    } else {
      reminderTaskDesc.classList.add('hidden');
    }

    reminderTimeLabel.textContent = `Scheduled for ${formatTime(task.dueTime)} today`;
    reminderProjectBadge.textContent = `# ${task.category || 'Inbox'}`;
    reminderPriorityBadge.textContent = `${task.priority || 'Medium'} Priority`;
    reminderPriorityBadge.className = `task-meta-tag tag-priority-${(task.priority || 'medium').toLowerCase()}`;

    reminderModal.classList.remove('hidden');
    playChime('reminder');

    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`Todoist Reminder: ${task.title}`, {
          body: `Due at ${formatTime(task.dueTime)} | Project: ${task.category || 'Inbox'}`
        });
      } catch {}
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().catch(() => {});
    }
  }

  function dismissReminder() {
    const taskId = reminderTaskId.value;
    if (taskId) {
      acknowledgedReminders.add(taskId);
    }
    reminderModal.classList.add('hidden');
  }

  function snoozeReminder() {
    const taskId = reminderTaskId.value;
    if (taskId) {
      snoozedReminders.set(taskId, Date.now() + 5 * 60 * 1000);
      showToast('Reminder snoozed for 5 minutes');
    }
    reminderModal.classList.add('hidden');
  }

  function completeReminderTask() {
    const taskId = reminderTaskId.value;
    if (taskId) {
      toggleTaskStatus(taskId);
      acknowledgedReminders.add(taskId);
      showToast('Task marked as complete!');
    }
    reminderModal.classList.add('hidden');
  }

  // =========================================================================
  // Synthetic Sound Chime (Web Audio API)
  // =========================================================================
  function playChime(type = 'chime') {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      if (type === 'reminder') {
        [880, 1108.73, 1318.51].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.12);
          gain.gain.setValueAtTime(0.18, now + i * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.12);
          osc.stop(now + i * 0.12 + 0.35);
        });
      } else {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.15);
          gain.gain.setValueAtTime(0.2, now + i * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.15);
          osc.stop(now + i * 0.15 + 0.6);
        });
      }
    } catch {}
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
