const ClientTable = ({ clients, onEdit, onDelete }) => {
  // Empty state
  if (!clients || clients.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <p>No clients yet. Add your first client.</p>
      </div>
    );
  }

  return (
    <table className="table table-bordered table-hover">
      <thead className="table-light">
        <tr>
          <th>Name</th>
          <th>Company</th>
          <th>Email</th>
          <th>Phone</th>
          <th style={{ width: "150px" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {clients.map((client) => (
          <tr key={client.clientId}>
            <td>{client.clientName}</td>
            <td>{client.company}</td>
            <td>{client.email}</td>
            <td>{client.phone}</td>
            <td>
              <button
                className="btn btn-sm btn-warning me-2"
                onClick={() => onEdit(client)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => onDelete(client.clientId)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ClientTable;