import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useMemo, useState } from "react";

import SpendingInsight from "../components/SpendingInsight";
import CategoryPieChart from "../components/CategoryPieChart";
import ExpenseChart from "../components/ExpenseChart";
import SummaryCard from "../components/SummaryCard";
import AddForm from "../components/AddForm";
import ExpenseList from "../components/ExpenseList";
import TripPlanner from "../components/TripPlanner";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

const MONTH_FILTERS = [
  { value: "all", label: "All time" },
  { value: "this-month", label: "This month" },
  { value: "last-month", label: "Last month" },
];

export default function Dashboard() {

  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const userId = user?.id;

  const [items, setItems] = useState([]);
  const [trips, setTrips] = useState([]);
  const [editItem, setEditItem] = useState(null);

  const [monthFilter, setMonthFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  /* ================= LOAD ================= */

  useEffect(() => {
    if (!userId) return;

    const savedExpenses = localStorage.getItem(`spendsmart-${userId}`);
    if (savedExpenses) setItems(JSON.parse(savedExpenses));

    const savedTrips = localStorage.getItem(`trips-${userId}`);
    if (savedTrips) setTrips(JSON.parse(savedTrips));

  }, [userId]);

  /* ================= SAVE ================= */

  useEffect(() => {
    if (!userId) return;

    localStorage.setItem(
      `spendsmart-${userId}`,
      JSON.stringify(items)
    );

  }, [items, userId]);

  /* ================= FILTER ================= */

  const filteredItems = useMemo(() => {

    return items.filter((item) => {

      const itemDate = new Date(item.date);
      const now = new Date();

      if (monthFilter === "this-month") {
        if (
          itemDate.getMonth() !== now.getMonth() ||
          itemDate.getFullYear() !== now.getFullYear()
        ) return false;
      }

      if (monthFilter === "last-month") {
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
        if (
          itemDate.getMonth() !== lastMonth.getMonth() ||
          itemDate.getFullYear() !== lastMonth.getFullYear()
        ) return false;
      }

      if (
        searchTerm &&
        !item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.category.toLowerCase().includes(searchTerm.toLowerCase())
      ) return false;

      if (minAmount && item.amount < Number(minAmount)) return false;
      if (maxAmount && item.amount > Number(maxAmount)) return false;

      return true;
    });

  }, [items, searchTerm, minAmount, maxAmount, monthFilter]);

  /* ================= CLEAR ================= */

  const handleClearAll = () => {
    if (window.confirm("Clear all transactions?")) {
      setItems([]);
    }
  };

  /* ================= FORMAT ================= */

  const formatCurrency = (value) =>
    "₹ " + Number(value).toLocaleString("en-IN");

  /* ================= EXPORT EXCEL ================= */

  const handleExportExcel = () => {

  const rows = filteredItems.map(i => ({
    Title: i.title,
    Amount: i.amount,
    Type: i.type,
    Category: i.category,
    Date: i.date
  }));

  const sheet = XLSX.utils.json_to_sheet(rows);

  // 🔥 Column width set (PRO LOOK)
  sheet["!cols"] = [
    { wch: 20 },
    { wch: 15 },
    { wch: 12 },
    { wch: 18 },
    { wch: 15 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet, "SpendSmart Report");

  XLSX.writeFile(wb, "SpendSmart_Report.xlsx");
};

  /* ================= EXPORT PDF (🔥 FINAL) ================= */

  const handleExportPDF = async () => {

  const doc = new jsPDF();

  // ===== TITLE =====
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text("SpendSmart Expense Report", 14, 15);

  // ===== DATE =====
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

  // ===== SUMMARY CALC =====
  let income = 0;
  let expense = 0;

  filteredItems.forEach(i => {
    if (i.type === "income") income += i.amount;
    else expense += i.amount;
  });

  const balance = income - expense;

  // ===== SUMMARY BOX =====
  doc.setDrawColor(200);
  doc.rect(14, 26, 180, 22);

  doc.setFontSize(12);
  doc.setTextColor(0);

  doc.text(`Income: Rs ${income}`, 18, 34);
doc.text(`Expense: Rs ${expense}`, 18, 40);
doc.text(`Balance: Rs ${balance}`, 120, 40);

  // ===== CHART IMAGE =====
  const chartSection = document.getElementById("charts");

  if (chartSection) {
    const canvas = await html2canvas(chartSection, {
      scale: 2,
      useCORS: true
    });

    const img = canvas.toDataURL("image/png");

    doc.addImage(img, "PNG", 15, 55, 180, 90);
  }

  // ===== TABLE =====
  autoTable(doc, {
    startY: 150,
    head: [["Title", "Amount", "Type", "Category", "Date"]],
    body: filteredItems.map(i => [
      i.title,
      `Rs ${i.amount}`,
      i.type,
      i.category,
      i.date
    ]),
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
    headStyles: {
      fillColor: [52, 152, 219], // 🔥 blue header
      textColor: 255,
      fontStyle: "bold"
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    tableLineColor: [220, 220, 220],
    tableLineWidth: 0.5,
  });

  // ===== FOOTER =====
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text(
    "Generated by SpendSmart • Personal Expense Tracker",
    14,
    doc.internal.pageSize.height - 10
  );

  doc.save("SpendSmart_Report.pdf");
};

  /* ================= UI ================= */

  return (
    <>
      {!isSignedIn && (
        <section className="card info-banner">
          <h2>Welcome 👋</h2>
          <p>Login to save your expenses.</p>
        </section>
      )}

      <main className="layout-advanced">

        <SummaryCard
          items={filteredItems}
          monthFilter={monthFilter}
          setMonthFilter={setMonthFilter}
          MONTH_FILTERS={MONTH_FILTERS}
          onClearAll={handleClearAll}
          onExportExcel={handleExportExcel}
          onExportPDF={handleExportPDF}
        >
          <AddForm
            isSignedIn={isSignedIn}
            setItems={setItems}
            editItem={editItem}
            setEditItem={setEditItem}
          />
        </SummaryCard>

        <ExpenseList
          items={filteredItems}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          minAmount={minAmount}
          setMinAmount={setMinAmount}
          maxAmount={maxAmount}
          setMaxAmount={setMaxAmount}
          setItems={setItems}
          setEditItem={setEditItem}
        />

        {/* 🔥 CHART WRAPPER (IMPORTANT) */}
        <div id="charts" style={{ gridColumn: "1 / -1" }}>
          <ExpenseChart items={filteredItems} />
          <CategoryPieChart items={filteredItems} />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <SpendingInsight items={filteredItems} />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <TripPlanner userId={userId} setTrips={setTrips} />
        </div>

      </main>
    </>
  );
}