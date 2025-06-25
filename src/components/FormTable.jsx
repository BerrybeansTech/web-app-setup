import React from 'react';
import { Link } from 'react-router-dom';
import './formTable.css';

const FormTable = ({ clients }) => {
  return (
    <div className="table-container">
      <h2>Client List</h2>
      <table className="table">
        <thead>
          <tr className="table-header">
            <th className="table-header-cell">Name</th>
            <th className="table-header-cell">Email</th>
            <th className="table-header-cell">Phone</th>
            <th className="table-header-cell">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="table-row">
              <td className="table-cell">{client.name}</td>
              <td className="table-cell">{client.email}</td>
              <td className="table-cell">{client.phone}</td>
              <td className="table-cell">
                <Link to={`/view-client/${client.id}`} className="table-link">View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormTable;