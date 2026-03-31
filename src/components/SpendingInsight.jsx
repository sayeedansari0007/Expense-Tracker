export default function SpendingInsight({ items }) {

  /* ======================
     FILTER EXPENSES
  ====================== */

  const expenses = items.filter((i) => i.type === "expense");

  /* ======================
     CURRENCY FORMAT
  ====================== */

  const formatCurrency = (value) =>
    "₹" + Number(value).toLocaleString("en-IN");

  if (expenses.length === 0) {
    return (
      <section className="card insight-card">
        <h2>Spending insights</h2>
        <p className="empty">No expense data yet.</p>
      </section>
    );
  }

  /* ======================
     TOTAL EXPENSE
  ====================== */

  const totalExpense = expenses.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  /* ======================
     BIGGEST EXPENSE
  ====================== */

  const biggest = expenses.reduce((max, item) =>
    item.amount > max.amount ? item : max
  , expenses[0]);

  /* ======================
     CATEGORY COUNTS
  ====================== */

  const categoryCount = {};

  expenses.forEach((item) => {
    const category = item.category || "Other";

    categoryCount[category] =
      (categoryCount[category] || 0) + 1;
  });

  const maxCount = Math.max(...Object.values(categoryCount));

  const mostUsed = Object.entries(categoryCount)
    .filter(([cat, count]) => count === maxCount)
    .map(([cat]) => cat)
    .join(" / ");

  /* ======================
     AVERAGE EXPENSE
  ====================== */

  const average =
    expenses.length === 0
      ? 0
      : totalExpense / expenses.length;

  return (
    <section className="card insight-card">

      <h2>Spending insights</h2>

      <div className="insight-grid">

        {/* BIGGEST EXPENSE */}

        <div className="insight-item">

          <div className="insight-icon">⚠️</div>

          <div>
            <span className="insight-label">
              Biggest expense
            </span>

            <strong>
              {formatCurrency(biggest.amount)}
            </strong>

            <small>
              {biggest.category}
            </small>
          </div>

        </div>

        {/* TOTAL EXPENSE */}

        <div className="insight-item">

          <div className="insight-icon">📊</div>

          <div>
            <span className="insight-label">
              Total expense
            </span>

            <strong>
              {formatCurrency(totalExpense)}
            </strong>

            <small>
              {expenses.length} transactions
            </small>
          </div>

        </div>

        {/* MOST USED CATEGORY */}

        <div className="insight-item">

          <div className="insight-icon">🏆</div>

          <div>
            <span className="insight-label">
              Most used category
            </span>

            <strong>
              {mostUsed}
            </strong>

            <small>
              top category
            </small>
          </div>

        </div>

        {/* AVERAGE EXPENSE */}

        <div className="insight-item">

          <div className="insight-icon">📉</div>

          <div>
            <span className="insight-label">
              Average expense
            </span>

            <strong>
              {formatCurrency(average)}
            </strong>

            <small>
              per transaction
            </small>
          </div>

        </div>

      </div>

    </section>
  );
}