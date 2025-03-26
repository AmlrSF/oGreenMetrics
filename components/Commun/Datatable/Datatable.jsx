import React, { useState, useEffect } from "react";
import { formatDate } from "@/lib/Utils";
import { Trash2, Edit2, Search } from "lucide-react";

const DataTable = ({ headers, data, tab, onDelete, onUpdate, onAdd }) => {
  const [filteredData, setFilteredData] = useState(data);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDate, setSortDate] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const getUniqueValues = (key) => {
    return [...new Set(data.map(item => item[key]))].filter(Boolean);
  };

  const categories = tab.id === "equipement" ? getUniqueValues("category") 
                  : tab.id === "dechets" ? getUniqueValues("type")
                  : tab.id === "transport" ? getUniqueValues("mode")
                  : [];

  useEffect(() => {
    let result = [...data];

    // Search filter
    if (searchTerm) {
      result = result.filter(item =>
        Object.values(item).some(val =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      const filterKey = tab.id === "equipement" ? "category" 
                     : tab.id === "dechets" ? "type"
                     : tab.id === "transport" ? "mode"
                     : null;
      
      if (filterKey) {
        result = result.filter(item => item[filterKey] === selectedCategory);
      }
    }

    // Date sorting
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortDate === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredData(result);
  }, [data, searchTerm, sortDate, selectedCategory]);

  return (
    <div className="card">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center gap-3">
          <div className="input-icon" style={{ width: "250px" }}>
            <span className="input-icon-addon">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="d-flex gap-2">
            {categories.length > 0 && (
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Types</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            )}

            <select
              className="form-select"
              value={sortDate}
              onChange={(e) => setSortDate(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-vcenter card-table">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="text-center text-muted">
                  No data available
                </td>
              </tr>
            ) : (
              filteredData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {headers.slice(0, -1).map((header, colIndex) => {
                    let cellValue = row[header.toLowerCase() === "createdat" ? "createdAt" : header.toLowerCase()];
                    
                    if (header.toLowerCase() === "createdat" && cellValue) {
                      cellValue = formatDate(cellValue);
                    }

                    return (
                      <td className="text-secondary" key={colIndex}>
                        <span className={header === "Emissions" ? "badge bg-purple-lt" : ""}>
                          {header.toLowerCase() === "emissions"
                            ? `${cellValue} ${tab.unit1}/${tab.unit2}`
                            : cellValue}
                        </span>
                      </td>
                    );
                  })}
                  <td>
                    <div className="btn-list">
                      <button
                        className="btn btn-ghost-danger btn-icon"
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
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="card-footer text-end">
        <button className="btn btn-primary" onClick={onAdd}>
          Add New
        </button>
      </div>
    </div>
  );
};

export default DataTable;