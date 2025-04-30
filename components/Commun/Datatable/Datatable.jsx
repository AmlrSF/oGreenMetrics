import React, { useState, useEffect } from "react";
import { formatDate } from "@/lib/Utils";
import { Trash2, Edit2, Search } from "lucide-react";

const DataTable = ({
  headers,
  dataHeader,
  data,
  tab,
  onDelete,
  onUpdate,
  onAdd,
  deletingIds,
}) => {
  const [filteredData, setFilteredData] = useState(data);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDate, setSortDate] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  //console.log(data);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const getUniqueValues = (key) => {
    return [...new Set(data?.map((item) => item[key]))].filter(Boolean);
  };

  const categories =
    tab?.id === "equipement"
      ? getUniqueValues("category")
      : tab?.id === "dechets"
      ? getUniqueValues("type")
      : tab?.id === "transport"
      ? getUniqueValues("mode")
      : tab?.id === "businessTravel"
      ? getUniqueValues("mode")
      : tab?.id === "biens-services"
      ? getUniqueValues("type")
      : tab?.id === "employesTransport"
      ? getUniqueValues("mode")
      : [];

  useEffect(() => {
    let result = [...data];

    // Search filter
    if (searchTerm) {
      result = result.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      const filterKey =
        tab?.id === "equipement"
          ? "category"
          : tab?.id === "dechets"
          ? "type"
          : tab?.id === "transport"
          ? "mode"
          : tab?.id === "businessTravel"
          ? "mode"
          : tab?.id === "biens-services"
          ? "type"
          : tab?.id === "employesTransport"
          ? "mode"
          : null;

      if (filterKey) {
        result = result.filter((item) => item[filterKey] === selectedCategory);
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
        <div
          className="d-flex flex-col sm:flex-row justify-content-between 
          w-full align-items-start sm:align-items-center gap-3"
        >
          <div className="d-flex flex-col gap-2">
            <div className="input-icon " style={{ width: "350px" }}>
              <span className="input-icon-addon">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control w-100"
                placeholder="Search here..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              {categories.length > 0 && (
                <select
                  className="form-select "
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{ width: "150px" }}
                >
                  <option value="all">Tous les Types</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              )}

              <select
                className="form-select "
                value={sortDate}
                style={{ width: "150px" }}
                onChange={(e) => setSortDate(e.target.value)}
              >
                <option value="newest">Les plus récents</option>
                <option value="oldest">Les plus anciens</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary" onClick={onAdd}>
            Ajouter un nouveau
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-vcenter card-table">
          <thead>
            <tr>
              {dataHeader?.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData?.length === 0 ? (
              <tr>
                <td
                  colSpan={headers?.length}
                  className="text-center text-muted"
                >
                  Aucun données disponible.
                </td>
              </tr>
            ) : (
              filteredData
                ?.slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {headers?.slice(0, -1).map((header, colIndex) => {
                      let cellValue = row[header];

                      if (header.toLowerCase() === "createdat" && cellValue) {
                        cellValue = formatDate(cellValue);
                      }

                      return (
                        <td className="text-secondary" key={colIndex}>
                          <span
                            className={
                              header === "Emissions" ? "badge bg-purple-lt" : ""
                            }
                          >
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
                          disabled={deletingIds.has(row._id)}
                        >
                        
                          {deletingIds.has(row._id) ? (
                            <span className="spinner-border spinner-border-sm" />
                          ) : (
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                          )}
                        </button>
                        <button
                          className="btn btn-ghost-success btn-icon"
                          onClick={() => onUpdate(row._id)}
                        >
                          <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-edit"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      <div className="card-footer d-flex align-items-center">
        <p className="m-0 text-secondary">
          Showing <span>{(currentPage - 1) * itemsPerPage + 1}</span> à{" "}
          <span>
            {Math.min(currentPage * itemsPerPage, filteredData.length)}
          </span>{" "}
          of <span>{filteredData.length}</span> entries
        </p>
        <ul className="pagination m-0 ms-auto">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M15 6l-6 6l6 6" />
              </svg>
            </button>
          </li>
          <li className="page-item active">
            <span
              className="page-link"
              style={{
                backgroundColor: "#263589",
                borderColor: "#263589",
              }}
            >
              {currentPage}
            </span>
          </li>
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M9 6l6 6l-6 6" />
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DataTable;
