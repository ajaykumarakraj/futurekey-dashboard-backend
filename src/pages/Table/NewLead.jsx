import React, { useEffect, useState } from "react";
import api from "../../component/api";
import Example from "./Example";
import moment from "moment";

const NewLead = () => {
  const [filters, setFilters] = useState({
    teamLeader: "",
    agent: "",
    leadSource: "",
    project: "",
    customer: "",
    dateFrom: "",
    dateTo: "",
    sortBy: "newest",
  });

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const rowsPerPage = 50;

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (page = 1) => {
    try {
      const payload = { lead_status: "1", page };
      const token = localStorage.getItem("token");

      const res = await api.post("/get-lead-data", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = res?.data?.data;
      // console.log(result)
      if (res.status === 200 && Array.isArray(result)) {
        const mapped = result.map((item, index) => ({
          id: (page - 1) * rowsPerPage + index + 1,
          customerId: item.id,
          enterDate: moment(item.created_at).utcOffset("+05:30").format("DD/MM/YYYY, hh:mm A"),
          contactPerson: item.name,
          contactNumber: item.contact,
          leadSource: item.lead_source,
          city: item.city,
          Agentassign: moment(item.assign_time).utcOffset("+05:30").format("DD/MM/YYYY, hh:mm A"),
          teamLeader: item.team_leader,
          agent: item.agent,
          leadstatus: item.lead_status,
          project: item.form_name,
          followUp: item.follow_ups,
          archivedReason: item.archived_reason,
          lastUpdate: moment(item.updated_at).utcOffset("+05:30").format("DD/MM/YYYY, hh:mm A"),
          observation: item.remark,
        }));

        setData(mapped);
        setCurrentPage(res.data.meta?.current_page || 1);
        setTotalPages(res.data.meta?.last_page || 1);
        setTotalRecords(res.data.meta?.total || 0);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error("API Error", err);
    }
  };

  useEffect(() => {
    handleSearch(1);
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      handleSearch(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const columns = [
    { field: "id", headerName: "#", align: "center" },
    { field: "enterDate", headerName: "Entry Date", align: "center" },
    {
      field: "contactPerson",
      headerName: "Contact Person",
      align: "left",
      renderCell: (row) => (
        <a
          href={`/lead-update/${row.customerId}`}
          style={{ color: "#1976d2", textDecoration: "underline", cursor: "pointer" }}
        >
          {row.contactPerson}
        </a>
      ),
    },
    { field: "city", headerName: "City" },
    { field: "contactNumber", headerName: "Contact Number", align: "center" },
    { field: "leadSource", headerName: "Lead Source", align: "left" },
    { field: "Agentassign", headerName: "Agent Assignment", align: "left" },
    { field: "teamLeader", headerName: "Team Leader", align: "left" },
    { field: "agent", headerName: "Agent", align: "left" },
    { field: "project", headerName: "Project", align: "left" },
    { field: "followUp", headerName: "Follow Up", align: "center" },
    { field: "archivedReason", headerName: "Archived Reason", align: "left" },
    { field: "lastUpdate", headerName: "Last Update", align: "center" },
    { field: "leadstatus", headerName: "Lead Status", align: "center" },
    { field: "observation", headerName: "Observation", align: "left" },
  ];

  return (
    <div>
      <h2 className="mb-2 text-center textsize headingstyle">New Leads</h2>
      {/* Filters */}
      <div style={{ padding: "20px", background: "#eaeaea", borderRadius: "6px", marginBottom: "20px" }}>
        <form style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <select name="teamLeader" value={filters.teamLeader} onChange={handleFilterChange}>
            <option value="">Team Leader</option>
            <option value="Tom">Tom</option>
            <option value="Bob">Bob</option>
          </select>

          <select name="agent" value={filters.agent} onChange={handleFilterChange}>
            <option value="">Agent</option>
            <option value="Agent X">Agent X</option>
            <option value="Agent Y">Agent Y</option>
          </select>

          <select name="leadSource" value={filters.leadSource} onChange={handleFilterChange}>
            <option value="">Lead Source</option>
            <option value="Referral">Referral</option>
            <option value="Social Media">Social Media</option>
          </select>

          <select name="project" value={filters.project} onChange={handleFilterChange}>
            <option value="">All Projects</option>
            <option value="Project 1">Project 1</option>
            <option value="Project 2">Project 2</option>
          </select>

          <input name="customer" placeholder="Customer ID" value={filters.customer} onChange={handleFilterChange} />
          <input name="dateFrom" type="date" value={filters.dateFrom} onChange={handleFilterChange} />
          <input name="dateTo" type="date" value={filters.dateTo} onChange={handleFilterChange} />

          <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>

          <button type="button" onClick={() => handleSearch(1)}>Search</button>
        </form>
      </div>

      {/* Table */}
      <Example data={data} columns={columns} rowsPerPageOptions={[rowsPerPage]} />

      {/* Pagination */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1}>
          Prev
        </button>
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            style={{
              backgroundColor: page === currentPage ? "#f00" : "#003961",
              color: "#fff",
              padding: "6px 12px",
            }}
          >
            {page}
          </button>
        ))}
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages}>
          Next
        </button>
      </div>

      {/* Total Record Info */}
      {/* <div style={{ textAlign: "center", marginTop: "10px", fontWeight: "bold" }}>
        Showing page {currentPage} of {totalPages} | Total Records: {totalRecords}
      </div> */}
    </div>
  );
};

export default NewLead;
