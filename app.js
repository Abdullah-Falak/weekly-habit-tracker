// Global State
let habits = JSON.parse(localStorage.getItem('glance_habits')) || [];
let historyData = JSON.parse(localStorage.getItem('glance_history')) || {};
let currentViewDate = new Date(); // Tracks the week currently being viewed

// DOM Elements
const habitGrid = document.getElementById('habit-grid');
const emptyState = document.getElementById('empty-state');
const trackerWrapper = document.getElementById('tracker-wrapper');
const currentWeekRangeLabel = document.getElementById('current-week-range');

const prevWeekBtn = document.getElementById('prev-week-btn');
const nextWeekBtn = document.getElementById('next-week-btn');
const todayShortcutBtn = document.getElementById('today-shortcut-btn');

const addModal = document.getElementById('add-modal');
const openAddModalBtn = document.getElementById('open-add-modal-btn');
const emptyAddBtn = document.getElementById('empty-add-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const addHabitForm = document.getElementById('add-habit-form');
const habitNameInput = document.getElementById('habit-name-input');

// --- Date Utilities ---
function getWeekDays(date) {
    const tempDate = new Date(date);
    const day = tempDate.getDay();
    // Force week to start on Monday
    const diff = tempDate.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(tempDate.setDate(diff));
    
    const days = [];
    for (let i = 0; i < 7; i++) {
        const nextDay = new Date(monday);
        nextDay.setDate(monday.getDate() + i);
        days.push(nextDay);
    }
    return days;
}

function formatDateKey(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

// --- Streak Calculation Logic ---
function calculateStreak(habitId) {
    let streak = 0;
    let checkDate = new Date();
    
    const todayKey = formatDateKey(checkDate);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = formatDateKey(yesterday);
    
    // If neither today nor yesterday is checked, the current streak is dead
    if (!historyData[`${habitId}_${todayKey}`] && !historyData[`${habitId}_${yesterdayKey}`]) {
        return 0;
    }
    
    // If today is unchecked but yesterday is checked, start tracking backward from yesterday
    if (!historyData[`${habitId}_${todayKey}`] && historyData[`${habitId}_${yesterdayKey}`]) {
        checkDate = yesterday;
    }
    
    while (true) {
        const key = `${habitId}_${formatDateKey(checkDate)}`;
        if (historyData[key]) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1); // Move 1 day back
        } else {
            break;
        }
    }
    return streak;
}

// --- Render UI Layout ---
function render() {
    // Save to local storage
    localStorage.setItem('glance_habits', JSON.stringify(habits));
    localStorage.setItem('glance_history', JSON.stringify(historyData));

    // Handle Empty State Toggle
    if (habits.length === 0) {
        emptyState.classList.remove('hidden');
        trackerWrapper.classList.add('hidden');
        return;
    } else {
        emptyState.classList.add('hidden');
        trackerWrapper.classList.remove('hidden');
    }

    // Clear previous elements
    habitGrid.innerHTML = '';

    const weekDays = getWeekDays(currentViewDate);
    
    // Update Header Text Date Range Label
    const options = { month: 'short', day: 'numeric' };
    currentWeekRangeLabel.textContent = `${weekDays[0].toLocaleDateString('en-US', options)} - ${weekDays[6].toLocaleDateString('en-US', options)}`;

    // 1. Build Header Row Grid Cells
    const cornerCell = document.createElement('div');
    cornerCell.className = 'grid-cell header-cell';
    cornerCell.style.justifyContent = 'flex-start';
    cornerCell.style.fontWeight = 'bold';
    cornerCell.textContent = 'Habits';
    habitGrid.appendChild(cornerCell);

    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    weekDays.forEach((date, index) => {
        const headerCell = document.createElement('div');
        headerCell.className = 'grid-cell header-cell';
        if (isToday(date)) headerCell.classList.add('today-col');
        
        headerCell.innerHTML = `
            <div>${dayNames[index]}</div>
            <div class="date-num">${date.getDate()}</div>
        `;
        habitGrid.appendChild(headerCell);
    });

    // 2. Build Rows for Each Habit Item
    habits.forEach(habit => {
        // Habit Meta Title Column
        const nameCell = document.createElement('div');
        nameCell.className = 'grid-cell habit-name-cell';
        
        const currentStreak = calculateStreak(habit.id);
        nameCell.innerHTML = `
            <div class="habit-meta">
                <span>${habit.name}</span>
                <span class="streak-badge">${currentStreak}🔥 streak</span>
            </div>
            <button class="delete-btn" data-id="${habit.id}" aria-label="Delete habit">&times;</button>
        `;
        habitGrid.appendChild(nameCell);

        // Seven Day Column Toggles for Current Row Habit
        weekDays.forEach(date => {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            if (isToday(date)) cell.classList.add('today-col');

            const dateKey = formatDateKey(date);
            const historyKey = `${habit.id}_${dateKey}`;
            const isChecked = !!historyData[historyKey];

            const toggleBtn = document.createElement('button');
            toggleBtn.className = `checkmark-toggle ${isChecked ? 'checked' : ''}`;
            toggleBtn.innerHTML = '✓';
            toggleBtn.setAttribute('aria-label', `Toggle ${habit.name} for ${dateKey}`);
            
            // Disable interactions into future dates
            const todayStart = new Date();
            todayStart.setHours(0,0,0,0);
            const targetDate = new Date(date);
            targetDate.setHours(0,0,0,0);
            if (targetDate > todayStart) {
                toggleBtn.disabled = true;
                toggleBtn.style.opacity = '0.2';
                toggleBtn.style.cursor = 'not-allowed';
            } else {
                toggleBtn.addEventListener('click', () => {
                    historyData[historyKey] = !historyData[historyKey];
                    render();
                });
            }

            cell.appendChild(toggleBtn);
            habitGrid.appendChild(cell);
        });
    });

    // Attach Event Listeners to New Dynamic Delete Buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idToKill = e.target.getAttribute('data-id');
            habits = habits.filter(h => h.id !== idToKill);
            // Clean up old storage keys belonging to deleted habits
            Object.keys(historyData).forEach(key => {
                if (key.startsWith(`${idToKill}_`)) delete historyData[key];
            });
            render();
        });
    });
}

// --- Modal Controls Event Routing ---
function showModal() { addModal.classList.remove('hidden'); habitNameInput.focus(); }
function hideModal() { addModal.classList.add('hidden'); addHabitForm.reset(); }

openAddModalBtn.addEventListener('click', showModal);
emptyAddBtn.addEventListener('click', showModal);
closeModalBtn.addEventListener('click', hideModal);

addHabitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameStr = habitNameInput.value.trim();
    if (!nameStr) return;

    habits.push({
        id: Date.now().toString(),
        name: nameStr
    });

    hideModal();
    render();
});

// --- Timeline Navigation Actions ---
prevWeekBtn.addEventListener('click', () => {
    currentViewDate.setDate(currentViewDate.getDate() - 7);
    render();
});

nextWeekBtn.addEventListener('click', () => {
    currentViewDate.setDate(currentViewDate.getDate() + 7);
    render();
});

todayShortcutBtn.addEventListener('click', () => {
    currentViewDate = new Date();
    render();
});

// Run Application Execution Init
render();

