import React, { useState, useEffect } from "react";
import Example from "../Table/Example";
import api from "../../component/api";
import { useNavigate } from "react-router-dom";

const UserManagementTable = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);

    // const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loginstatus,setLoginstatus]=useState(1)
// console.log("status",loginstatus)


const hanhlestatus=(e)=>{
  const   value=e.target.value
// console.log(value)
setLoginstatus(value)
}



    const handleSearch = async (url = `/user-list/${loginstatus}`) => {
        // console.log(url)
        try {
            setLoading(true);
            let res;
            if (url.startsWith("https")) {
                res = await fetch(url, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                }).then(r => r.json());
            } else {
                res = await api.get(url, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                }).then(r => r.data);
            }

            if (res?.data && Array.isArray(res?.data)) {
                const mapped = res.data.map(item => ({
                    id: item.user_id,
                    name: item.name,
                    email: item.email,
                    phone: item.phone,
                    role: item.role,
                    assign_team_leader: item.assign_team_leader,
                    login_status:item.login_status
                }));
console.log(mapped)
                setData(mapped);
            
            } else {
                console.error('API did not return expected format');
                setData([]);
            }
        } catch (error) {
            console.error("Fetching Error", error);
        } finally {
            setLoading(false);
        }
    };

    // const handlePageChange = (page) => {
    //     handleSearch(`/user-list?page=${page}`);
    // };

    useEffect(() => {
        handleSearch( `/user-list/${loginstatus}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loginstatus]);

    const handleEdit = (row) => {
        navigate(`/user/update/${row.id}`);
    };

    const columns = [
        { field: "id", headerName: "User ID", align: "center" },
        { field: "name", headerName: "Name", align: "left" },
        { field: "email", headerName: "Email", align: "left" },
        { field: "phone", headerName: "Contact Number", align: "center" },
        { field: "role", headerName: "Role", align: "center" },
   
        { field: "assign_team_leader", headerName: "Team Leader", align: "center" },
         { field: "login_status", headerName: "Login Status", align: "center" },
        {
            headerName: "Actions",
            align: "center",
            renderCell: (row) => (
                <button
                    style={{
                        padding: "6px 12px",
                        backgroundColor: "#FFA500",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                    onClick={() => handleEdit(row)}
                >
                    Edit
                </button>
            )
        }
    ];






    return (
        <div>
            {/* Show total records */}
            <p style={{ textAlign: "center", fontWeight: "bold" }}>
                
            </p>
<div className="loginstatus">
    <p>Select Status</p>
<select onChange={hanhlestatus}>
    <option value="1">Active</option>
      <option value="0">InActive</option>
        <option value="all">All</option>
</select>
</div>
            {/* Table Section */}
            {loading ? (
                <p style={{ textAlign: "center" }}>Loading...</p>
            ) : (
                <Example data={data} columns={columns} rowsPerPageOptions={[1000]} />
            )}

            {/* Pagination Section */}
            <div style={{
                marginTop: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px"
            }}>
                

               

              
          
            </div>
        </div>
    );
};

export default UserManagementTable;
