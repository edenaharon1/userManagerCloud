// CustomersPage.js
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
import ClientForm from "../components/ClientForm";

export default function CustomersPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = () => {
    console.log("📡 שולח בקשת GET לשרת...");
    fetch(`${process.env.REACT_APP_API_URL}/clients`)
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ קיבלתי את הלקוחות:", data);
        setClients(data.clients || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ שגיאה בעת הבאת לקוחות:", err);
        setLoading(false);
      });
  };

  const handleAddClient = (clientData) => {
    const payload = {
      name: clientData.name?.trim(),
      email: clientData.email?.trim(),
      phone: clientData.phone?.trim(),
    };

    if (!payload.name || !payload.email || !payload.phone) {
      alert("נא למלא את כל השדות: Name, Email, Phone");
      return;
    }

    console.log("Sending client payload:", payload);

    fetch(`${process.env.REACT_APP_API_URL}/clients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return res.json();
      })
      .then(() => fetchClients())
      .catch((err) => {
        console.error("❌ שגיאה בעת הוספת לקוח:", err);
        alert("הוספת הלקוח נכשלה. בדקי את הקונסול.");
      });
  };

  const handleUpdateClient = (clientData) => {
    fetch(`${process.env.REACT_APP_API_URL}/clients/${selectedClient.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clientData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("עדכון נכשל");
        return res.json();
      })
      .then((data) => {
        setClients((prev) =>
          prev.map((c) => (c.id === selectedClient.id ? data.client : c))
        );
        setSelectedClient(data.client);
        setIsEditing(false);
      })
      .catch(console.error);
  };

  const handleDeleteClient = (id) => {
    if (!window.confirm("האם אתה בטוח שברצונך למחוק את הלקוח?")) return;

    fetch(`${process.env.REACT_APP_API_URL}/clients/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setClients((prev) => prev.filter((c) => c.id !== id));
          if (selectedClient && selectedClient.id === id) {
            setSelectedClient(null);
            setIsEditing(false);
          }
        } else {
          throw new Error("מחיקה נכשלה");
        }
      })
      .catch(console.error);
  };

  const filteredClients = clients.filter(Boolean).filter((client) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (client.name && client.name.toLowerCase().includes(term)) ||
      (client.email && client.email.toLowerCase().includes(term))
    );
  });

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

      {/* Client List */}
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
                  onClick={() => {
                    setSelectedClient(client);
                    setIsEditing(false);
                  }}
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

      {/* Add New Client */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Add New Client
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddClient({
              name: e.target.name.value.trim(),
              email: e.target.email.value.trim(),
              phone: e.target.phone.value.trim(),
            });
            e.target.reset();
          }}
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <TextField name="name" label="Name" required sx={{ flex: 1 }} />
          <TextField name="email" label="Email" type="email" required sx={{ flex: 1 }} />
          <TextField name="phone" label="Phone" required sx={{ flex: 1 }} />
          <Button variant="contained" type="submit" color="primary" sx={{ height: "56px" }}>
            Add
          </Button>
        </Box>
      </Paper>

      {/* Client Modal */}
      <Dialog
        open={Boolean(selectedClient)}
        onClose={() => {
          setSelectedClient(null);
          setIsEditing(false);
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Client Details</DialogTitle>
        <DialogContent dividers>
          {!isEditing && selectedClient && (
            <>
              <Typography><strong>ID:</strong> {selectedClient.id}</Typography>
              <Typography><strong>Name:</strong> {selectedClient.name}</Typography>
              <Typography><strong>Email:</strong> {selectedClient.email}</Typography>
              <Typography><strong>Phone:</strong> {selectedClient.phone}</Typography>
            </>
          )}

          {isEditing && selectedClient && (
            <ClientForm
              clientToEdit={selectedClient}
              onSave={handleUpdateClient}
              onCancel={() => setIsEditing(false)}
            />
          )}
        </DialogContent>
        <DialogActions>
          {!isEditing && (
            <>
              <Button onClick={() => setIsEditing(true)} color="primary">
                Edit
              </Button>
              <Button onClick={() => handleDeleteClient(selectedClient.id)} color="error">
                Delete
              </Button>
            </>
          )}
          <Button
            onClick={() => {
              setSelectedClient(null);
              setIsEditing(false);
            }}
            color="secondary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
