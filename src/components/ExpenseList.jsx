export default function ExpenseList({
  items,
  searchTerm,
  setSearchTerm,
  minAmount,
  setMinAmount,
  maxAmount,
  setMaxAmount,
  setItems,
  setEditItem, // 🔥 NEW
}) {

  const formatCurrency = (value) =>
    "₹" + Number(value).toLocaleString("en-IN");

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Delete this transaction?");
    if (!confirmDelete) return;

    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <section className="card list-card">

      {/* HEADER */}
      <div className="list-header">
        <div>
          <h2>Recent activity</h2>
          <p className="list-subtitle">
            Search & filter to quickly find any transaction.
          </p>
        </div>
        <span>{items.length} items</span>
      </div>

      {/* FILTERS */}
      <div className="list-filters">
        <input
          placeholder="Search by title or category"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <input
          type="number"
          placeholder="Min ₹"
          value={minAmount}
          onChange={(e) => setMinAmount(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max ₹"
          value={maxAmount}
          onChange={(e) => setMaxAmount(e.target.value)}
        />
      </div>

      {/* LIST */}
      <div className="list-body">
        <ul className="list">

          {items.length === 0 && (
            <li className="empty">
              No entries for this filter. Try changing the search.
            </li>
          )}

          {items.map((item) => (

            <li key={item.id} className="expense-item">

              <div className="expense-left">
                <div className="expense-title">
                  {item.title}
                </div>

                <div className="expense-meta">
                  {item.type === "income" ? "Income" : "Expense"} · {item.category} · {item.date}
                </div>
              </div>

              <div className="expense-right">

                <span
                  className={`expense-amount ${
                    item.type === "income" ? "income" : "expense"
                  }`}
                >
                  {formatCurrency(item.amount)}
                </span>

                {/* 🔥 ACTION BUTTONS */}
                <div className="actions">

                  <button
                    className="edit-btn"
                    onClick={() => setEditItem(item)}
                  >
                    ✏
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item.id)}
                  >
                    ✕
                  </button>

                </div>

              </div>

            </li>

          ))}

        </ul>
      </div>

    </section>
  );
}