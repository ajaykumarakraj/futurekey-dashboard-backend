import React, { useEffect, useState } from "react";
import api from "../../component/api";
import LeadReusabletable from "./LeadReusabletable";
import moment from "moment";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
const Addon = () => {
//  const [searchParams] = useSearchParams();
//  const [filters, setFilters] = useState({
//     teamLeaderId: "",
//     agentId: "",
//     projectId: "",
//       dateFrom: "",
//     dateTo: "",
//     status:""
//   });
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);
//  const [teamLeaders, setTeamLeaders] = useState([]);
// const [agents, setAgents] = useState([]);
//   const [projects, setProjects] = useState([]);
  // const [leadSource,setLeadSource]=useState([])



// console.log("get data",tl,agent,project)
   const rowsPerPage = 50;



//start search section all data 
 useEffect(() => {
    // fetchTeamLeaders();
    // fetchProjects();
      handleSearch(1);
    // fetchLeads(1);
  }, []);

 

 



  const handleSearch = async (page = 1) => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.get(`/get-addon-lead?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = res?.data?.data;

    if (res.status === 200 && Array.isArray(result)) {
      const mapped = result.map((item, index) => ({
        id: (page - 1) * rowsPerPage + index + 1,
        customerId: item.id,
        contactPerson: item.name,
        contactNumber: item.contact,
        city: item.city,
        Agent: item.agent_name,
        budget: item.budget,
        requirement: item.requirement,
      }));

      setData(mapped);
      setCurrentPage(page); // yaha direct page set karo
      setTotalPages(res.data.meta?.last_page || 1);
    } else {
      setData([]);
    }
  } catch (err) {
    console.error("API Error", err);
  }
};

  // useEffect(() => {
  
  // }, []);

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
    // { field: "enterDate", headerName: "Entry Date", align: "center" },
    // {
    //   field: "contactPerson",
    //   headerName: "Contact Person",
    //   align: "left",
    //   renderCell: (row) => (
    //     <a
    //       href={`/lead-update/${row.customerId}`}
    //       style={{ color: "#1976d2", textDecoration: "underline", cursor: "pointer" }}
    //     >
    //       {row.contactPerson}
    //     </a>
    //   ),
    // },
     { field: "contactPerson", headerName: "Contact Person" },
    { field: "city", headerName: "City" },
    { field: "contactNumber", headerName: "Contact Number", align: "center" },
  
    { field: "Agent", headerName: "Agent", align: "left" },
    { field: "budget", headerName: "Budget", align: "left" },

    { field: "requirement", headerName: "Requirement", align: "left" },
  ];

  return (
    <div>
      <h2 className="mb-2 text-center textsize headingstyle">Add On Client</h2>
      {/* Filters */}
    

      {/* Table */}
      <LeadReusabletable data={data} columns={columns} rowsPerPageOptions={[rowsPerPage]} />

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

    
    </div>
  );
};

export default Addon;
