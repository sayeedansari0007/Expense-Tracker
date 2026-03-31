import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#facc15",
  "#f97316",
  "#a855f7",
  "#14b8a6",
  "#f43f5e"
];

export default function CategoryPieChart({ items }) {

  const formatCurrency = (value) =>
    "INR " + Number(value).toLocaleString("en-IN");

  /* ======================
     FILTER EXPENSES
  ====================== */

  const expenses = items.filter((i) => i.type === "expense");

  /* ======================
     GROUP BY CATEGORY
  ====================== */

  const data = Object.values(
    expenses.reduce((acc, item) => {

      const category = item.category || "Other";

      if (!acc[category]) {
        acc[category] = {
          name: category,
          value: 0
        };
      }

      acc[category].value += item.amount;

      return acc;

    }, {})
  );

  /* ======================
     SORT BY HIGHEST
  ====================== */

  data.sort((a, b) => b.value - a.value);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <section className="card" id="category-chart">

      <div className="category-header">

        <h2>Spending by category</h2>

        <p className="mini-sub">
          Breakdown of expenses by category
        </p>

      </div>

      {data.length === 0 ? (

        <p className="empty">
          No category data yet.
        </p>

      ) : (

        <div className="category-layout">

          {/* ======================
             DONUT CHART
          ====================== */}

          <div className="donut-wrapper">

            <ResponsiveContainer width="100%" height={260}>

              <PieChart>

                <Pie
                  data={data}
                  innerRadius={75}
                  outerRadius={105}
                  paddingAngle={4}
                  cornerRadius={8}
                  dataKey="value"
                  stroke="none"
                >

                  {data.map((entry, index) => (

                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />

                  ))}

                </Pie>

                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    background: "#020617",
                    border: "1px solid #1f2937",
                    borderRadius: "8px",
                    color: "#e5e7eb"
                  }}
                />

              </PieChart>

            </ResponsiveContainer>

            {/* CENTER TEXT */}

            <div className="donut-center">

              <div className="total">
                {formatCurrency(total)}
              </div>

              <div className="label">
                Total spent
              </div>

            </div>

          </div>

          {/* ======================
             CATEGORY LIST
          ====================== */}

          <div className="category-list">

            {data.map((cat, index) => {

              const percent =
                total === 0
                  ? 0
                  : ((cat.value / total) * 100).toFixed(1);

              return (

                <div
                  className="category-item"
                  key={cat.name}
                >

                  <div className="category-top">

                    <span className="category-name">

                      <span
                        className="color-dot"
                        style={{
                          background:
                            COLORS[index % COLORS.length]
                        }}
                      />

                      {cat.name}

                    </span>

                    <span className="category-value">
                      {formatCurrency(cat.value)} ({percent}%)
                    </span>

                  </div>

                  <div className="progress">

                    <div
                      className="progress-fill"
                      style={{
                        width: `${percent}%`,
                        background:
                          COLORS[index % COLORS.length]
                      }}
                    />

                  </div>

                </div>

              );

            })}

          </div>

        </div>

      )}

    </section>
  );
}