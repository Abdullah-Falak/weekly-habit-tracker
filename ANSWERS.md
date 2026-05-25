# Assessment Strategy & System Profile

### 1. Project Run Sequence
* **Local Run Execution:** Open the root `index.html` directly in any web browser, or launch via an extension such as VS Code Live Server. No NPM installs or compilation bundles are needed.
* **Live Deployment Link:** *(Pasted during Netlify deployment mapping step)*

### 2. Architecture & Design Choices
* **Stack Choice Strategy:** I purposefully selected a pure vanilla combination (HTML5, Native CSS variables, and ES6 JavaScript) to isolate assessment evaluation. Avoiding structural web overhead (like React or Vue) ensures near-instant rendering speeds and low compilation profiles.
* **Visual Decision A - The Grid:** I selected a native CSS Grid map instead of standard lists to frame clear temporal comparisons. Placing habits on the Y-axis and weekdays on the X-axis mimics classic physical calendars, improving immediate scannability.
* **Visual Decision B - Checkmark Scaling Feedback:** Custom-styled action checkboxes were constructed instead of basic browser controls. When clicked, a custom CSS spring animation is triggered (`transform: scale(1.05)`). This provides micro-satisfaction to reward regular completions.

### 3. Responsiveness, Architecture Boundaries, and Accessibility
* **Viewport Scaling Metrics:** On desktop screens (1440px), the structure populates a beautiful wide dashboard. On tiny layouts (360px), instead of compressing layout columns into an illegible size, the grid container utilizes an elegant `overflow-x: auto` setting. This allows users to swipe smoothly across their week while keeping typography readable.
* **Calendar Foundation Selection:** The week is hard-coded to begin explicitly on **Monday**. This conforms to industrial habit models, aligning personal tracking with standardized business and school weekly work patterns.
* **Streak Formulation Choice:** Current streaks calculate sequentially backward starting from today if completed, or starting from yesterday if today remains unchecked. This logic encourages consistency, avoiding immediate streak break punishments early in the morning before users have a chance to complete their tasks.
* **Accessibility Matrix Addressed:** All interactive buttons contain explicit `aria-label` elements to guarantee clear context for screen-readers.
* **Accessibility Matrix Omitted:** Keyboard focus rings were left as browser defaults instead of fully personalized custom focuses. This compromise was accepted to focus effort on cross-device testing within the strict timeframe.

### 4. AI Tools Usage Log
* **Usage Instance:** Copied structural baseline setup vectors for HTML/CSS layouts.
* **Human Adjustments Overrides:** The original code scaffold was completely altered to introduce custom context highlights (`.today-col`), dynamic dynamic element rendering bindings via Javascript template templates, and strict functional parameters blocking clicks on future days.

### 5. Identified System Gaps
* **Current Limitation:** The application does not handle reordering or sorting habits.
* **Proposed Roadmap Fix:** If given an additional day, I would integrate native HTML5 Drag-and-Drop APIs. This would allow users to re-order habit lines and group tasks by category or priority level.
