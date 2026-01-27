import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../component/api';
import imgad from "../assets/images/delete.png"
import { useAuth } from '../component/AuthContext';
import Swal from 'sweetalert2';
const ConnectForm = () => {
    const { user } = useAuth()
    // get data 
    const [page, setPage] = useState([])
    const [form, setForm] = useState([])
    const [project, setProject] = useState([])
    const [tableData, setTableData] = useState([])
    // post data 
    const [selectPage, setSelectPage] = useState("")
    const [selectForm, setSelectForm] = useState("")
    const [selectProject, setSelectProject] = useState("")
    useEffect(() => {
        GetDatafun()
        getData()
    }, [])
    const getData = async () => {
        try {
            const res = await api.get("/view-master-setting", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (res.data.status === 200) {
                const allData = res.data.data;


                setProject(allData.filter(item => item.cat_name === "Project"));
            }
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };
    const GetDatafun = async () => {
        try {
            const res = await axios.get("https://api.almonkdigital.in/api/admin/get-all-pages", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            })
            if (res.data.status === 200) {
                console.log(res.data.data)
                setTableData(res.data.project_data)
                setPage(res.data.data)
            }

        } catch (error) {
            console.log(error)
        }
    }

    const handlechange = async (e) => {
        setSelectPage(e.target.value)
        const getname = e.target.value
        try {
            const response = await axios.get(`https://api.almonkdigital.in/api/admin/get-form-bypages/${getname}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            })
            if (response.data.status === 200) {
                setForm(response.data.data)
                // console.log(response.data.data)

            }
        } catch (error) {
            console.log(error)
        }
    }
    const submitForm = async () => {
        try {

            const payload = {
                user_id: user.user_id,
                page_name: selectPage,
                form_name: selectForm,
                project_name: selectProject
            }
            // console.log(payload)
            const response = await axios.post("https://api.almonkdigital.in/api/admin/connect-form", payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },

            },
            )
            if (response.data.status === 200) {
                window.location.reload();
                alert("connect")
            }
        } catch (error) {
            console.log(error)
        }
    }


// delete api call 

const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const delres = await api.get(`/delete-form/${id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    });

                    if (delres.data.status === 200) {
                        toast.error(delres.data.message);
                       
             
                        GetDatafun();
                    }
                } catch (error) {
                    toast.error("Something went wrong.");
                }
            }
        });
    };

    console.log(tableData)
    return (
        <div className="container mt-5">
            <h3 className="mb-4 text-center">Connect Form</h3>

            {/* Form Section */}
            <form className="row g-3 mb-4">
                <div className="col-md-3">
                    {/* <label htmlFor="pageSelect" className="form-label">Page</label> */}
                    <select className="form-select" onChange={handlechange}>
                        <option value="">-- Select Page --</option>
                        {
                            page.map((v, key) => (
                                <option key={key} value={v.page_name}>{v.page_name}</option>
                            ))
                        }


                    </select>
                </div>

                <div className="col-md-3">
                    {/* <label htmlFor="formSelect" className="form-label">Form</label> */}
                    <select className="form-select" onChange={(e) => setSelectForm(e.target.value)}>
                        <option value="">-- Select Form --</option>

                        {
                            form.map((value, key) => (
                                <option key={key} value={value.form_name}>{value.form_name}</option>
                            ))
                        }
                    </select>
                </div>

                <div className="col-md-3">
                    {/* <label htmlFor="projectSelect" className="form-label">Project</label> */}
                    <select className="form-select" onChange={(e) => setSelectProject(e.target.value)}>
                        <option value="">-- Select Project --</option>
                        {
                            project.map((value, key) => (
                                <option value={value.cat_value} key={key}>{value.cat_value}</option>
                            ))
                        }


                    </select>
                </div>
                <div className="col-md-3 d-flex justify-content-center">
                    <button type='button' className='btn addbtn' onClick={submitForm}>Submit</button>
                </div>
            </form>

            {/* Table Section */}
            <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead className="">
                        <tr>
                            <th style={styles.th}>Page Name</th>
                            <th style={styles.th}>Form Name</th>
                            <th style={styles.th}>Project Name</th>
                            <th style={styles.th}>Action</th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            tableData.map((value, key) => (
                                <tr key={key}>
                                    <td style={styles.td}>{value.page_name}</td>
                                    <td style={styles.td}>{value.form_name}</td>
                                    <td style={styles.td}>{value.project_name}</td>
                                     <td style={styles.td} ><img onClick={() => handleDelete(value.id)} style={styles.imgcur} src={imgad} /></td>
                                </tr>
                            ))
                        }



                        {/* Add more rows dynamically as needed */}
                    </tbody>
                </table>
            </div>
             <ToastContainer />
        </div>
    );
};

export default ConnectForm;
const styles = {
    tableWrapper: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        marginBottom: "30px",
    },
    table: {
        textAlign: "center",
        width: "100%",
        borderCollapse: "collapse",
    },
    // th: {
    //     backgroundColor: "#f2f2f2",
    //     padding: "12px",
    //     // textAlign: "left",
    //     fontWeight: "600",
    //     border: "1px solid #ddd",
    //     textAlign: "center",
    // },
    tr: {

        border: "1px solid #ddd",
    },
    td: {
        border: "1px solid #ddd",
        padding: "12px",
        fontSize: "14px",
    },
}