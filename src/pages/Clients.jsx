import { useEffect, useState } from "react";
import * as clientService from "../services/clientService";
import ClientTable from "../components/clients/ClientTable";
import ClientForm from "../components/clients/ClientForm";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [error, setError] = useState("");

  // 🔹 Fetch all clients
  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await clientService.getAll();
      setClients(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch clients");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Load data on mount
  useEffect(() => {
    fetchClients();
  }, []);

  // 🔹 Add Client
  const handleAddClick = () => {
    setSelectedClient(null);
    setShowModal(true);
  };

  // 🔹 Edit Client
  const handleEditClick = (client) => {
    setSelectedClient(client);
    setShowModal(true);
  };

  // 🔹 Delete Client
  const handleDeleteClick = async (clientId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this client?");
    if (!confirmDelete) return;

    try {
      await clientService.remove(clientId);
      fetchClients(); // refresh list
    } catch (err) {
      setError("Failed to delete client");
    }
  };

  // 🔹 After Save (create/update)
  const handleSaved = () => {
    setShowModal(false);
    fetchClients(); // refresh list
  };

  return (
    <div className="container mt-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* <h2>Clients</h2> */}
        <button className="btn btn-primary" onClick={handleAddClick}>
          Add Client
        </button>
      </div>

      {/* Error */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Loading */}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <ClientTable
          clients={clients}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Modal */}
      {showModal && (
        <ClientForm
          show={showModal}
          handleClose={() => setShowModal(false)}
          onSaved={handleSaved}
          client={selectedClient}
        />
      )}
    </div>
  );
};

export default Clients;