document.addEventListener('DOMContentLoaded', () => {

  const getInitialTransactions = () => [
    { id: 1, type: 'income', description: 'Monthly Salary', amount: 85000, category: 'Income', date: '2025-10-01' },
    { id: 2, type: 'expense', description: 'Groceries', amount: 5000, category: 'Groceries', date: '2025-10-05' },
    { id: 3, type: 'expense', description: 'Rent', amount: 20000, category: 'Rent', date: '2025-10-01' },
    { id: 4, type: 'expense', description: 'Electric Bill', amount: 1500, category: 'Utilities', date: '2025-10-10' },
    { id: 5, type: 'expense', description: 'Dinner Out', amount: 1200, category: 'Entertainment', date: '2025-10-12' },
    { id: 6, type: 'expense', description: 'Groceries', amount: 3000, category: 'Groceries', date: '2025-10-15' },
    { id: 7, type: 'expense', description: 'Petrol', amount: 2000, category: 'Other', date: '2025-10-18' },
    { id: 8, type: 'expense', description: 'Movie Tickets', amount: 800, category: 'Entertainment', date: '2025-10-22' },
    { id: 9, type: 'income', description: 'Freelance Project', amount: 15000, category: 'Income', date: '2025-10-25' },
    { id: 10, type: 'income', description: 'Property Sale', amount: 15000000, category: 'Income', date: '2025-10-26' },
  ];
  
  const getInitialInvestments = () => [
    { id: 1, name: 'Mutual Funds', value: 150000 },
    { id: 2, name: 'Stocks (TATA, RELIANCE)', value: 30000000 },
    { id: 3, name: 'Bonds', value: 50000 }
  ];

  let transactions = JSON.parse(localStorage.getItem('transactions')) || getInitialTransactions();
  let investments = JSON.parse(localStorage.getItem('investments')) || getInitialInvestments();

  let expensePieChart, incomeExpenseBarChart, spendingLineChart;
  
  const chartColors = {
      Groceries: 'rgba(234, 179, 8, 0.9)',
      Utilities: 'rgba(59, 130, 246, 0.9)',
      Rent: 'rgba(239, 68, 68, 0.9)',
      Entertainment: 'rgba(139, 92, 246, 0.9)',
      Other: 'rgba(107, 114, 128, 0.9)',
      Income: 'rgba(34, 197, 94, 0.9)',
  };

  const totalBalanceEl = document.getElementById('total-balance');
  const monthlyIncomeEl = document.getElementById('monthly-income');
  const totalExpensesEl = document.getElementById('total-expenses');
  const investmentTotalEl = document.getElementById('investment-total');
  const transactionTableBody = document.getElementById('transaction-table-body');
  const transactionForm = document.getElementById('transaction-form');
  const transactionTypeSelect = document.getElementById('transaction-type');
  const transactionCategorySelect = document.getElementById('transaction-category');
  const categoryFilterSelect = document.getElementById('category-filter');
  const investmentListEl = document.getElementById('investment-list');
  const formErrorEl = document.getElementById('form-error');
  const resetAllBtn = document.getElementById('reset-all-btn');
  
  const investmentForm = document.getElementById('investment-form');
  const investmentFormErrorEl = document.getElementById('investment-form-error');
  
  const messageModal = document.getElementById('message-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalMessage = document.getElementById('modal-message');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalOkBtn = document.getElementById('modal-ok-btn');
  
  const confirmModal = document.getElementById('confirm-modal');
  const confirmModalTitle = document.getElementById('confirm-modal-title');
  const confirmModalMessage = document.getElementById('confirm-modal-message');
  const confirmYesBtn = document.getElementById('confirm-yes-btn');
  const confirmNoBtn = document.getElementById('confirm-no-btn');
  
  const themeToggleBtn = document.getElementById('theme-toggle-btn');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };
  
  const saveToLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('investments', JSON.stringify(investments));
  };

  const animateCounter = (el, target) => {
      const duration = 1000;
      const startValue = parseFloat(el.dataset.value || 0);
      const range = target - startValue;
      let startTime = null;
      if (range === 0) { el.textContent = formatCurrency(target); return; }
      const step = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const current = startValue + (range * progress);
          el.textContent = formatCurrency(current);
          if (progress < 1) {
              window.requestAnimationFrame(step);
          } else {
              el.textContent = formatCurrency(target);
              el.dataset.value = target;
          }
      };
      window.requestAnimationFrame(step);
  };
  
  const showMessage = (title, message) => {
      modalTitle.textContent = title;
      modalMessage.textContent = message;
      messageModal.classList.remove('hidden');
  };
  
  const hideMessage = () => {
      messageModal.classList.add('hidden');
  };

  const showConfirmModal = (title, message, confirmText, onConfirm) => {
      confirmModalTitle.textContent = title;
      confirmModalMessage.textContent = message;
      confirmYesBtn.textContent = confirmText;
      confirmModal.classList.remove('hidden');
  
      const confirmHandler = () => {
          onConfirm();
          confirmModal.classList.add('hidden');
          confirmNoBtn.removeEventListener('click', cancelHandler);
      };
      const cancelHandler = () => {
          confirmModal.classList.add('hidden');
          confirmYesBtn.removeEventListener('click', confirmHandler);
      };

      confirmYesBtn.addEventListener('click', confirmHandler, { once: true });
      confirmNoBtn.addEventListener('click', cancelHandler, { once: true });
  };

  const updateSummaryCards = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
    });
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const monthlyIncome = monthlyTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const monthlyExpenses = monthlyTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const totalBalance = income - expenses;
    const investmentTotal = investments.reduce((sum, i) => sum + i.value, 0);

    animateCounter(totalBalanceEl, totalBalance); 
    monthlyIncomeEl.textContent = formatCurrency(monthlyIncome);
    totalExpensesEl.textContent = formatCurrency(monthlyExpenses);
    animateCounter(investmentTotalEl, investmentTotal);
    
    investmentTotalEl.dataset.value = investmentTotal;
    monthlyIncomeEl.dataset.value = monthlyIncome;
    totalExpensesEl.dataset.value = monthlyExpenses;
  };

  const renderTransactionHistory = (filteredTransactions = transactions) => {
    transactionTableBody.innerHTML = ''; 
    if (filteredTransactions.length === 0) {
        transactionTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="p-4 text-center text-gray-500 dark:text-gray-400">
                    No transactions found.
                </td>
            </tr>
        `;
        return;
    }

    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateB > dateA) return 1;
        if (dateB < dateA) return -1;
        return b.id - a.id;
    });

    sortedTransactions.forEach(t => {
      const isExpense = t.type === 'expense';
      const amountClass = isExpense ? 'text-negative' : 'text-positive';
      const amountPrefix = isExpense ? '-' : '+';
      
      const row = `
        <tr class="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/[0.5]">
          <td class="p-4 font-medium break-words">${t.description}</td>
          <td class="p-4 text-gray-600 dark:text-gray-400">${t.category}</td>
          <td class="p-4 text-gray-600 dark:text-gray-400">${t.date}</td>
          <td class="p-4 text-right ${amountClass} font-semibold">
            ${amountPrefix}${formatCurrency(t.amount)}
          </td>
          <td class="p-4 text-right">
            <button class="p-1 text-negative opacity-60 hover:opacity-100 transition-opacity" data-id="${t.id}" title="Delete Transaction">
              <i data-lucide="trash-2" class="w-4 h-4 pointer-events-none"></i>
            </button>
          </td>
        </tr>
      `;
      transactionTableBody.insertAdjacentHTML('beforeend', row);
    });
  };

  const renderInvestmentList = () => {
    investmentListEl.innerHTML = '';
    if (investments.length === 0) {
        investmentListEl.innerHTML = `<li class="text-center text-gray-500 dark:text-gray-400 text-sm">No investments added yet.</li>`;
        return;
    }
    const sortedInvestments = [...investments].sort((a, b) => b.value - a.value);
    
    sortedInvestments.forEach(item => {
        const li = `
            <li class="flex justify-between items-center py-2 border-b dark:border-slate-700 last:border-b-0 group">
              <span class="font-medium text-gray-700 dark:text-gray-200 break-words pr-2">${item.name}</span>
              <div class="flex items-center gap-2">
                <span class="font-bold text-gray-900 dark:text-gray-100 text-right">${formatCurrency(item.value)}</span>
                <button class="p-1 text-negative opacity-0 group-hover:opacity-60 hover:opacity-100 transition-opacity" data-id="${item.id}" title="Delete Investment">
                  <i data-lucide="x-circle" class="w-4 h-4 pointer-events-none"></i>
                </button>
              </div>
            </li>
        `;
        investmentListEl.insertAdjacentHTML('beforeend', li);
    });
  };
  
  const updateCategoryOptions = () => {
      const type = transactionTypeSelect.value;
      const incomeOptions = '<option value="Income">Income</option><option value="Other">Other</option>';
      const expenseOptions = `
          <option value="Groceries">Groceries</option>
          <option value="Utilities">Utilities</option>
          <option value="Rent">Rent</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>
      `;
      if (type === 'income') {
          transactionCategorySelect.innerHTML = incomeOptions;
      } else {
          transactionCategorySelect.innerHTML = expenseOptions;
      }
  };

  const getChartData = () => {
      const expenseData = {};
      const monthlySpending = {};
      const monthlyIncomeVsExpense = {}; 
      transactions.forEach(t => {
          const monthYear = t.date.substring(0, 7);
          if (!monthlyIncomeVsExpense[monthYear]) { monthlyIncomeVsExpense[monthYear] = { income: 0, expense: 0 }; }
          if (!monthlySpending[monthYear]) { monthlySpending[monthYear] = 0; }
          if (t.type === 'expense') {
              expenseData[t.category] = (expenseData[t.category] || 0) + t.amount;
              monthlySpending[monthYear] += t.amount;
              monthlyIncomeVsExpense[monthYear].expense += t.amount;
          } else if (t.type === 'income') {
              monthlyIncomeVsExpense[monthYear].income += t.amount;
          }
      });
      const sortedMonths = Object.keys(monthlyIncomeVsExpense).sort();
      const barChartLabels = sortedMonths.map(month => new Date(month + '-02').toLocaleString('default', { month: 'short', year: 'numeric' }));
      const barChartIncomeData = sortedMonths.map(month => monthlyIncomeVsExpense[month].income);
      const barChartExpenseData = sortedMonths.map(month => monthlyIncomeVsExpense[month].expense);
      const lineChartLabels = Object.keys(monthlySpending).sort().map(month => new Date(month + '-02').toLocaleString('default', { month: 'short' }));
      const lineChartData = Object.keys(monthlySpending).sort().map(month => monthlySpending[month]);
      const pieChartLabels = Object.keys(expenseData);
      const pieChartData = Object.values(expenseData);
      const pieChartColors = pieChartLabels.map(label => chartColors[label] || chartColors['Other']);
      return {
          pie: { labels: pieChartLabels, data: pieChartData, colors: pieChartColors },
          bar: { labels: barChartLabels, incomeData: barChartIncomeData, expenseData: barChartExpenseData },
          line: { labels: lineChartLabels, data: lineChartData }
      };
  };

  const updateCharts = () => {
      const data = getChartData();
      
      const isDarkMode = document.documentElement.classList.contains('dark');
      const chartTextColor = isDarkMode ? '#94a3b8' : '#6b7280'; // slate-400 or gray-500
      const chartGridColor = isDarkMode ? 'rgba(100, 116, 139, 0.2)' : 'rgba(0, 0, 0, 0.1)';
      const pieBorderColor = isDarkMode ? '#1e293b' : '#ffffff'; // slate-800 or white

      Chart.defaults.color = chartTextColor;
      
      const chartTooltipCallbacks = {
          label: (context) => {
              let label = context.dataset.label || context.label || '';
              if (label) label += ': ';
              if (context.parsed.y !== null) label += formatCurrency(context.parsed.y);
              else if (context.parsed !== null) label += formatCurrency(context.parsed);
              return label;
          }
      };
      
      const gridOptions = {
        grid: {
          color: chartGridColor,
          borderColor: chartGridColor
        }
      };
      
      // --- Pie Chart ---
      const pieCtx = document.getElementById('expensePieChart').getContext('2d');
      if (expensePieChart) expensePieChart.destroy();
      expensePieChart = new Chart(pieCtx, {
          type: 'doughnut',
          data: {
              labels: data.pie.labels,
              datasets: [{
                  label: 'Expenses', data: data.pie.data,
                  backgroundColor: data.pie.colors,
                  borderColor: pieBorderColor,
                  borderWidth: 2
              }]
          },
          options: {
              responsive: true, maintainAspectRatio: false,
              plugins: {
                  legend: { position: 'bottom', labels: { color: chartTextColor } },
                  tooltip: { callbacks: { label: chartTooltipCallbacks.label } }
              }
          }
      });
      
      // --- Bar Chart ---
      const barCtx = document.getElementById('incomeExpenseBarChart').getContext('2d');
      if (incomeExpenseBarChart) incomeExpenseBarChart.destroy();
      incomeExpenseBarChart = new Chart(barCtx, {
          type: 'bar',
          data: {
              labels: data.bar.labels,
              datasets: [
                  { label: 'Income', data: data.bar.incomeData, backgroundColor: 'rgba(34, 197, 94, 0.8)', borderRadius: 4 },
                  { label: 'Expenses', data: data.bar.expenseData, backgroundColor: 'rgba(239, 68, 68, 0.8)', borderRadius: 4 }
              ]
          },
          options: {
              responsive: true, maintainAspectRatio: false,
              scales: {
                  y: { beginAtZero: true, ticks: { callback: value => formatCurrency(value) }, ...gridOptions },
                  x: { grid: { display: false } }
              },
              plugins: { tooltip: { callbacks: { label: chartTooltipCallbacks.label } } }
          }
      });
      
      // --- Line Chart ---
      const lineCtx = document.getElementById('spendingLineChart').getContext('2d');
      if (spendingLineChart) spendingLineChart.destroy();
      spendingLineChart = new Chart(lineCtx, {
          type: 'line',
          data: {
              labels: data.line.labels,
              datasets: [{
                  label: 'Monthly Spending', data: data.line.data,
                  fill: true, backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderColor: 'rgba(239, 68, 68, 0.8)',
                  tension: 0.3, pointBackgroundColor: 'rgba(239, 68, 68, 1)'
              }]
          },
          options: {
              responsive: true, maintainAspectRatio: false,
              scales: { 
                y: { beginAtZero: true, ticks: { callback: value => formatCurrency(value) }, ...gridOptions },
                x: { ...gridOptions }
              },
              plugins: { legend: { display: false }, tooltip: { callbacks: { label: chartTooltipCallbacks.label } } }
          }
      });
  };

  const updateUI = () => {
    updateSummaryCards();
    renderTransactionHistory();
    renderInvestmentList();
    updateCharts();
    lucide.createIcons();
  };
  
  const handleAddTransaction = (e) => {
      e.preventDefault();
      const description = document.getElementById('transaction-description').value.trim();
      const amount = parseFloat(document.getElementById('transaction-amount').value);
      const date = document.getElementById('transaction-date').value;
      if (!description || !amount || !date || amount <= 0) {
          formErrorEl.classList.remove('hidden'); return;
      }
      formErrorEl.classList.add('hidden');
      const newTransaction = {
          id: Date.now(), type: transactionTypeSelect.value,
          description, amount, category: transactionCategorySelect.value, date
      };
      transactions.push(newTransaction);
      saveToLocalStorage();
      updateUI();
      transactionForm.reset();
      updateCategoryOptions();
      document.getElementById('transaction-date').value = new Date().toISOString().split('T')[0];
      showMessage('Success', 'Transaction added successfully!');
  };
  
  const handleAddInvestment = (e) => {
      e.preventDefault();
      const nameEl = document.getElementById('investment-name');
      const valueEl = document.getElementById('investment-value');
      const name = nameEl.value.trim();
      const value = parseFloat(valueEl.value);
      if (!name || !value || value <= 0) {
          investmentFormErrorEl.classList.remove('hidden'); return;
      }
      investmentFormErrorEl.classList.add('hidden');
      const newInvestment = { id: Date.now(), name: name, value: value };
      investments.push(newInvestment);
      saveToLocalStorage();
      updateSummaryCards();
      renderInvestmentList();
      lucide.createIcons();
      investmentForm.reset();
      showMessage('Success', 'Investment added successfully!');
  };

  const handleFilterTransactions = () => {
      const selectedCategory = categoryFilterSelect.value;
      let filtered = transactions;
      if (selectedCategory === 'all') { filtered = transactions; }
      else if (selectedCategory === 'Income') { filtered = transactions.filter(t => t.type === 'income'); }
      else { filtered = transactions.filter(t => t.category === selectedCategory); }
      renderTransactionHistory(filtered);
      lucide.createIcons();
  };
  
  const handleTransactionTableClick = (e) => {
      const deleteBtn = e.target.closest('button[data-id]');
      if (!deleteBtn) return;
      const transactionId = parseInt(deleteBtn.dataset.id, 10);
      showConfirmModal(
          'Delete Transaction', 'Are you sure you want to delete this transaction? This cannot be undone.', 'Yes, Delete',
          () => {
              transactions = transactions.filter(t => t.id !== transactionId);
              saveToLocalStorage();
              updateUI();
              showMessage('Success', 'Transaction has been deleted.');
          }
      );
  };
  
  const handleInvestmentListClick = (e) => {
      const deleteBtn = e.target.closest('button[data-id]');
      if (!deleteBtn) return;
      const investmentId = parseInt(deleteBtn.dataset.id, 10);
      showConfirmModal(
          'Delete Investment', 'Are you sure you want to delete this investment?', 'Yes, Delete',
          () => {
              investments = investments.filter(i => i.id !== investmentId);
              saveToLocalStorage();
              updateSummaryCards();
              renderInvestmentList();
              lucide.createIcons();
              showMessage('Success', 'Investment has been deleted.');
          }
      );
  };
  
  const handleResetAll = () => {
      showConfirmModal(
          'Reset All Data', 'Are you sure you want to permanently delete ALL transactions and investment data? This is a crucial step and cannot be undone.', 'Yes, Reset All',
          () => {
              transactions = getInitialTransactions();
              investments = getInitialInvestments();
              saveToLocalStorage();
              const initialIncome = getInitialTransactions().filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
              const initialExpense = getInitialTransactions().filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
              animateCounter(totalBalanceEl, initialIncome - initialExpense);
              animateCounter(investmentTotalEl, getInitialInvestments().reduce((sum, i) => sum + i.value, 0));
              updateUI();
              showMessage('Success', 'All data has been reset to the default state.');
          }
      );
  };
  
  const handleThemeToggle = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    if (isDark) {
      localStorage.theme = 'dark';
    } else {
      localStorage.theme = 'light';
    }
    updateCharts();
    lucide.createIcons();
  };
  
  transactionForm.addEventListener('submit', handleAddTransaction);
  investmentForm.addEventListener('submit', handleAddInvestment);
  categoryFilterSelect.addEventListener('change', handleFilterTransactions);
  transactionTypeSelect.addEventListener('change', updateCategoryOptions);
  modalCloseBtn.addEventListener('click', hideMessage);
  modalOkBtn.addEventListener('click', hideMessage);
  
  transactionTableBody.addEventListener('click', handleTransactionTableClick);
  investmentListEl.addEventListener('click', handleInvestmentListClick);
  resetAllBtn.addEventListener('click', handleResetAll);
  themeToggleBtn.addEventListener('click', handleThemeToggle);
  
  document.getElementById('transaction-date').value = new Date().toISOString().split('T')[0];
  
  updateCategoryOptions();
  updateUI();
  lucide.createIcons();

  try {
    const header = document.getElementById('dashboard-header');
    const summaryCards = document.querySelectorAll('#summary-cards > div');
    const mainContent = document.getElementById('main-content');
    const sidebar = document.getElementById('sidebar-content');

    if (header) { header.classList.add('fade-in'); }
    if (mainContent) {
      mainContent.classList.add('fade-in-up');
      mainContent.style.animationDelay = '300ms';
    }
    if (sidebar) {
      sidebar.classList.add('fade-in-right');
      sidebar.style.animationDelay = '400ms';
    }
    summaryCards.forEach((card, index) => {
      card.classList.add('fade-in-up');
      card.style.animationDelay = `${index * 100}ms`;
    });
  } catch (error) {
    console.error('Error applying load animations:', error);
  }

});

