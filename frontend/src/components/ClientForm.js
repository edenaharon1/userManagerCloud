import React, { useState, useEffect } from "react";

export default function ClientForm({ onSave, clientToEdit, onCancel }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    if (clientToEdit) {
      setForm({
        name: clientToEdit.name,
        email: clientToEdit.email,
        phone: clientToEdit.phone,
      });
    }
  }, [clientToEdit]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    setForm({ name: "", email: "", phone: "" });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
      <input name="name" placeholder="שם" value={form.name} onChange={handleChange} required />
      <input
        name="email"
        placeholder="אימייל"
        type="email"
        value={form.email}
        onChange={handleChange}
        required
        style={{ marginLeft: 10 }}
      />
      <input
        name="phone"
        placeholder="טלפון"
        value={form.phone}
        onChange={handleChange}
        required
        style={{ marginLeft: 10 }}
      />
      <button type="submit" style={{ marginLeft: 10 }}>
        שמור
      </button>
      {onCancel && (
        <button type="button" onClick={onCancel} style={{ marginLeft: 10 }}>
          ביטול
        </button>
      )}
    </form>
  );
}
