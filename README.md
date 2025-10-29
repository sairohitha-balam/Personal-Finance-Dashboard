# Personal Finance Dashboard

## About This Project

**Personal Finance Dashboard** is a client-side web application for managing your personal finances. It provides a clean and intuitive dashboard to track **income**, **expenses**, and **investments** — all securely stored in your browser's `localStorage`.

> **Privacy First:** All your financial data stays on your device. Nothing is uploaded or shared online.

The interface is fully responsive and supports both **light** and **dark** themes with a persistent theme toggle.

---

## Tech Stack

This project is built entirely with **vanilla web technologies** — no frameworks!

| Technology | Purpose |
|-------------|----------|
| **HTML5** | Core structure of the application |
| **Tailwind CSS** | Styling, layout, and dark/light mode system (via CDN) |
| **JavaScript (ES6+)** | Application logic, DOM manipulation, and state management |
| **Chart.js** | For interactive charts and data visualizations |
| **Lucide Icons** | Lightweight, modern icon set |
| **localStorage** | For client-side data persistence |

---

## Features & Functionalities

### Dual Theme
- Toggle between **light** and **dark** modes.  
- App remembers your last selected theme.

### Responsive Design
- Optimized for **mobile**, **tablet**, and **desktop** devices.

### Interactive Charts
1. **Expense Breakdown** – Doughnut chart showing expenses by category.  
2. **Income vs. Expenses** – Bar chart comparing monthly totals.  
3. **Spending Trend** – Line chart showing spending over time.

### Transaction Management (CRUD)
- **Add:** Add new income or expense transactions.  
- **View:** Filterable and sortable transaction list (most recent first).  
- **Delete:** Remove any transaction with a confirmation popup.

### Investment Management (CRUD)
- **Add:** Simple form to add new investments.  
- **View:** See your investment portfolio at a glance.  
- **Delete:** Remove investments with confirmation.

### Real-time Summary
- Dynamic summary cards for **Total Balance**, **Total Income**, **Total Expenses**, etc.  
- Updates instantly when new transactions are added.

### Data Reset
- A **Reset All Data** button to clear `localStorage` and start fresh.

### Animations
- Smooth entry animations on page load.  
- Animated counters for better visual experience.

---

## How to Run

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git
```
### 2. Navigate to the Project Directory

```bash
cd YOUR_REPOSITORY_NAME
```

## 3. Run the Application

### 🅰 Option A: Simple (Open the File)

Simply open the `index.html` file in your default web browser.

---

### 🅱 Option B: Recommended (Run a Local Server)

Running a local server avoids potential browser security restrictions with `localStorage`.

#### If you have Node.js installed:

```bash
# 1. Install serve (if you don't have it)
npm install -g serve

# 2. Run the local server
serve
```
Then open the URL provided in your terminal (usually http://localhost:3000).

Or, if you have Python 3:
```bash
python3 -m http.server
```
Then, open http://localhost:8000 (for Python) in your browser.


## Future Enhancements

### Cloud Database
Integrate with **Firebase Firestore** to sync data across multiple devices in real time.

### User Authentication
Add **login** and **sign-up** functionality, enabling personalized user data when cloud sync is implemented.

### Budgeting Feature
Allow users to **set monthly budgets** by category and visually track their spending against those budgets.

### Data Export
Add the ability to **export transaction and investment history** as a `.csv` file for backups or analysis.
