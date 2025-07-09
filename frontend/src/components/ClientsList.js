import React, { useState } from "react";

export default function ClientsList({ clients, onSelectClient, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");

  // סינון לפי שם או אימייל לפי מה שהוקלד
  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <input
        type="text"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 12, padding: 8, width: "100%", fontSize: 16 }}
      />

      <table border="1" cellPadding="5" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredClients.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No clients found
              </td>
            </tr>
          ) : (
            filteredClients.map((client) => (
              <tr key={client.id}>
                <td>{client.id}</td>
                <td
                  style={{ cursor: "pointer", color: "#0d47a1" }}
                  onClick={() => onSelectClient(client)}
                >
                  {client.name}
                </td>
                <td>{client.email}</td>
                <td>{client.phone}</td>
                <td>
                  <button onClick={() => onSelectClient(client)} title="Edit client">
                    ✏️
                  </button>
                  <button onClick={() => onDelete(client.id)} title="Delete client">
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}
