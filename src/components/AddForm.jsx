import { useClerk } from "@clerk/clerk-react";
import { useState, useEffect } from "react";

export default function AddForm({ isSignedIn, setItems, editItem, setEditItem }) {

  const { openSignIn } = useClerk();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Food");
  const [note, setNote] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loginMessage, setLoginMessage] = useState(false);

  /* ---------------- EDIT LOAD ---------------- */

  useEffect(() => {
    if (editItem) {
      setTitle(editItem.title);
      setAmount(editItem.amount);
      setType(editItem.type);
      setDate(editItem.date);
      setCategory(editItem.category);
      setNote(editItem.note);
    }
  }, [editItem]);

  /* ---------------- ERROR ---------------- */

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 3000);
  };

  /* ---------------- SUCCESS ---------------- */

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  /* ---------------- RESET ---------------- */

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setDate("");
    setNote("");
    setCategory("Food");
    setType("expense");
    setEditItem(null); // 🔥 important
  };

  /* ---------------- LOGIN FLOW ---------------- */

  const triggerLoginFlow = () => {
    setLoginMessage(true);
    setTimeout(() => {
      setLoginMessage(false);
      openSignIn();
    }, 2500);
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isSignedIn) {
      triggerLoginFlow();
      return;
    }

    if (!title.trim()) return showError("Please enter a title.");
    if (!amount || Number(amount) <= 0) return showError("Enter valid amount.");
    if (!date) return showError("Select a date.");

    let finalCategory = category;

    if (category === "Other") {
      if (!note.trim()) return showError("Enter custom category.");
      finalCategory = note.trim();
    }

    /* 🔥 EDIT MODE */

    if (editItem) {

      const updatedItem = {
        ...editItem,
        title: title.trim(),
        amount: Number(amount),
        type,
        date,
        category: finalCategory,
        note: note.trim()
      };

      setItems(prev => {
        const updated = prev.map(item =>
          item.id === editItem.id ? updatedItem : item
        );
        localStorage.setItem("expenses", JSON.stringify(updated));
        return updated;
      });

      showSuccess("Expense updated ✅");
      resetForm();
      return;
    }

    /* 🔥 ADD MODE */

    const newItem = {
      id: crypto.randomUUID(),
      title: title.trim(),
      amount: Number(amount),
      type,
      date,
      category: finalCategory,
      note: note.trim()
    };

    setItems(prev => {
      const updated = [newItem, ...prev];
      localStorage.setItem("expenses", JSON.stringify(updated));
      return updated;
    });

    showSuccess("Expense added ✅");
    resetForm();
  };

  return (
    <>
      <form className="form" onSubmit={handleSubmit}>

        <div className="form-row">

          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="number"
            placeholder="Amount ₹"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

        </div>

        <div className="form-row second-row">

          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Food</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Salary</option>
            <option>Health</option>
            <option>Education</option>
            <option>Other</option>
          </select>

          <input
            placeholder="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <button className="primary-btn full-width">
            {editItem ? "Update" : "Add"} {/* 🔥 MAGIC */}
          </button>

        </div>

        {error && <div className="toast-error">⚠ {error}</div>}
        {success && <div className="toast-success">✅ {success}</div>}

      </form>

      {loginMessage && (
        <div className="login-overlay">
          <div className="toast-login">
            🔐 Please login to continue...
          </div>
        </div>
      )}
    </>
  );
}