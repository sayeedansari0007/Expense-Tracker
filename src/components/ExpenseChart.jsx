import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList
} from "recharts";

export default function ExpenseChart({ items }) {

  const formatCurrency = (value) =>
    "INR " + Number(value).toLocaleString("en-IN");

  /* ======================
     FILTER EXPENSES
  ====================== */

  const expenses = items.filter((i) => i.type === "expense");

  /* ======================
     GROUP BY MONTH
  ====================== */

  const data = expenses.reduce((acc, item) => {

    if (!item.date) return acc;

    const date = new Date(item.date);

    if (isNaN(date)) return acc;

    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const monthLabel = date.toLocaleString("default", {
      month: "short",
      year: "numeric"
    });

    const existing = acc.find(
      (d) => d.monthIndex === monthIndex && d.year === year
    );

    if (existing) {
      existing.amount += item.amount;
    } else {
      acc.push({
        month: monthLabel,
        monthIndex,
        year,
        amount: item.amount
      });
    }

    return acc;

  }, []);

  /* ======================
     SORT MONTHS
  ====================== */

  data.sort((a, b) => {
    if (a.year === b.year) return a.monthIndex - b.monthIndex;
    return a.year - b.year;
  });

  return (
    <section className="card" id="expense-chart">

      <div style={{ marginBottom: "14px" }}>
        <h2 style={{ margin: 0 }}>Expense Trend</h2>

        <p className="mini-sub">
          Monthly spending overview
        </p>
      </div>

      {data.length === 0 ? (
        <p className="empty">
          No expense data yet.
        </p>
      ) : (

        <div style={{ width: "100%", height: 280 }}>

          <ResponsiveContainer>

            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1f2937"
              />

              <XAxis
                dataKey="month"
                stroke="#9ca3af"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                stroke="#9ca3af"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => formatCurrency(v)}
              />

              <Tooltip
                cursor={{ fill: "rgba(34,197,94,0.08)" }}
                contentStyle={{
                  background: "#020617",
                  border: "1px solid #1f2937",
                  borderRadius: "10px",
                  color: "#e5e7eb"
                }}
                formatter={(value) => [formatCurrency(value), "Expense"]}
              />

              <Bar
                dataKey="amount"
                fill="#22c55e"
                radius={[8, 8, 0, 0]}
                barSize={42}
                animationDuration={700}
              >

                <LabelList
                  dataKey="amount"
                  position="top"
                  formatter={(v) => formatCurrency(v)}
                  style={{
                    fill: "#e5e7eb",
                    fontSize: 12
                  }}
                />

              </Bar>

            </BarChart>

          </ResponsiveContainer>

        </div>

      )}

    </section>
  );
}