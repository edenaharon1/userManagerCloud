import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Button,
  Box,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export default function CustomersPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState(null); // למודאל

  useEffect(() => {
    fetch("http://localhost:3001/api/clients")
      .then((res) => res.json())
      .then((data) => {
        setClients(data.clients || []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3001/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        setClients((prev) => [...prev, data.client]);
        setForm({ name: "", email: "", phone: "" });
      })
      .catch(console.error);
  };

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Typography>Loading clients...</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        align="center"
        sx={{
          fontWeight: 400,
          letterSpacing: "0.15em",
          color: "#0d47a1",
          marginBottom: "40px",
          fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        CUSTOMER MANAGEMENT
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Client List
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <TextField
          placeholder="Search by name or email"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No clients found
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => (
                <TableRow
                  key={client.id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => setSelectedClient(client)}
                >
                  <TableCell>{client.id}</TableCell>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Add New Client
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <TextField
            name="name"
            label="Name"
            value={form.name}
            onChange={handleChange}
            required
            sx={{ flex: 1 }}
          />
          <TextField
            name="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            sx={{ flex: 1 }}
          />
          <TextField
            name="phone"
            label="Phone"
            value={form.phone}
            onChange={handleChange}
            required
            sx={{ flex: 1 }}
          />
          <Button variant="contained" type="submit" color="primary" sx={{ height: "56px" }}>
            Add
          </Button>
        </Box>
      </Paper>

      {/* מודאל פרטי לקוח */}
      <Dialog open={Boolean(selectedClient)} onClose={() => setSelectedClient(null)}>
        <DialogTitle>Client Details</DialogTitle>
        <DialogContent dividers>
          {selectedClient && (
            <>
              <Typography><strong>ID:</strong> {selectedClient.id}</Typography>
              <Typography><strong>Name:</strong> {selectedClient.name}</Typography>
              <Typography><strong>Email:</strong> {selectedClient.email}</Typography>
              <Typography><strong>Phone:</strong> {selectedClient.phone}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedClient(null)} color="secondary">
            Close
          </Button>
          {/* אפשר להוסיף כאן כפתורי Edit ו-Delete עם פונקציונליות */}
        </DialogActions>
      </Dialog>
    </Container>
  );
}
