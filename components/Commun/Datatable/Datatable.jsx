import React from "react";
import { formatDate } from "@/lib/Utils";
import { Trash2, Edit2 } from "lucide-react";
const DataTable = ({ headers, data, onDelete, onUpdate, onAdd }) => {
  return (
    <div className="table-responsive">
      <table className="table table-vcenter card-table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="text-center text-muted">
                Aucune donnée disponible
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.slice(0, -1).map((header, colIndex) => {
                  let cellValue =
                    row[
                      header.toLowerCase() == "createdat"
                        ? "createdAt"
                        : header.toLowerCase()
                    ];

                  if (header.toLowerCase() === "createdat" && cellValue) {
                    cellValue = formatDate(cellValue);
                  }

                  return <td className="text-secondary" key={colIndex}>{cellValue}</td>;
                })}
                <td>
                  <button
                    className="btn btn-ghost-danger btn-icon "
                    onClick={() => onDelete(row._id)}
                  >
                   <Trash2 size={18} />
                  </button>
                  <button
                    className="btn btn-ghost-success btn-icon"
                    onClick={() => onUpdate(row._id)}
                  >
                    <Edit2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="d-flex justify-content-end mt-4">
        <button className="btn btn-primary " onClick={onAdd}>
          Ajouter
        </button>
      </div>
    </div>
  );
};

export default DataTable;
