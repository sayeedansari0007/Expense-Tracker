export default function SummaryCard({
  items,
  monthFilter,
  setMonthFilter,
  MONTH_FILTERS,
  onClearAll,
  onExportExcel,
  onExportPDF,
  children
}) {

  /* ======================
     CALCULATIONS
  ====================== */

  const incomeItems = items.filter(i => i.type === "income");
  const expenseItems = items.filter(i => i.type === "expense");

  const income = incomeItems.reduce((sum, item) => sum + item.amount, 0);
  const expense = expenseItems.reduce((sum, item) => sum + item.amount, 0);
  const balance = income - expense;

  /* ======================
     CURRENCY FORMAT
  ====================== */

  const formatCurrency = (value) =>
    "₹" + Number(value).toLocaleString("en-IN");

  return (
    <section className="card main-card">

      {/* ======================
         HEADER
      ====================== */}

      <div className="main-card-header">

        <div>
          <h1>My Personal Expense Tracker</h1>

          <p className="subtitle">
            Track your daily income & expenses in one clean dashboard.
          </p>
        </div>

        <div className="filter-group">

          {/* MONTH FILTER */}

          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="chip-select"
          >
            {MONTH_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>

          {/* CLEAR ALL */}

          <button
            className="ghost-btn small"
            onClick={onClearAll}
            disabled={items.length === 0}
          >
            Clear all
          </button>

          {/* EXPORT EXCEL */}

          <button
            className="ghost-btn small"
            onClick={onExportExcel}
            disabled={items.length === 0}
          >
            Export Excel
          </button>

          {/* EXPORT PDF */}

          <button
            className="ghost-btn small"
            onClick={onExportPDF}
            disabled={items.length === 0}
          >
            Export PDF
          </button>

        </div>

      </div>

      {/* ======================
         SUMMARY CARDS
      ====================== */}

      <div className="summary">

        {/* INCOME */}

        <div className="summary-item">

          <div className="summary-label">
            💰 Income
          </div>

          <strong className="income">
            {formatCurrency(income)}
          </strong>

        </div>

        {/* EXPENSE */}

        <div className="summary-item">

          <div className="summary-label">
            💸 Expense
          </div>

          <strong className="expense">
            {formatCurrency(expense)}
          </strong>

        </div>

        {/* BALANCE */}

        <div className="summary-item">

          <div className="summary-label">
            📊 Balance
          </div>

          <strong className={balance >= 0 ? "income" : "expense"}>
            {formatCurrency(balance)}
          </strong>

        </div>

      </div>

      {/* ======================
         QUICK STATS
      ====================== */}

      <div className="summary-quick">

        <div className="stat-chip">
          <span>Total entries</span>
          <strong>{items.length}</strong>
        </div>

        <div className="stat-chip">
          <span>Income entries</span>
          <strong>{incomeItems.length}</strong>
        </div>

        <div className="stat-chip">
          <span>Expense entries</span>
          <strong>{expenseItems.length}</strong>
        </div>

      </div>

      {/* ======================
         ADD FORM
      ====================== */}

      {children}

    </section>
  );
}