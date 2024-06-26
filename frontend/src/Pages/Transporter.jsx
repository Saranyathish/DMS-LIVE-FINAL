import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Nav from '../Components/UI/Nav';
import EditIcon from '@mui/icons-material/Edit';
import { Grid } from '@mui/material';
import axios from 'axios';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ClearIcon from '@mui/icons-material/Clear';
import PrintIcon from '@mui/icons-material/Print';
import QRmodal from './utils/QRmodel';
import DockCanvas from './canvas/DockCanvas';
import { exportToExcel } from './utils/excelUtils'
import LocationCanvas from './canvas/LocationCanvas';
import TenantCanvas from './canvas/TenantCanvas';
import TransporterCanvas from './canvas/TransporterCanvas';


const Transporter = () => {
    const [tableData, setTableData] = useState([]);
    const [addSection, setAddSection] = useState(false);
    const [editSection, setEditSection] = useState(false);
    const [formData, setFormData] = useState({
        Trname: '',
        country:'',
        Cnumber:"",
        remarks: "",
        Trcode: "",
        province: "",
        Cperson: "",
        Active: false,
        address: "",
        city: "",
        email: "",
    });
    const [formDataEdit, setFormDataEdit] = useState({
        Trname: '',
        country:'',
        Cnumber:"",
        remarks: "",
        Trcode: "",
        province: "",
        Cperson: "",
        Active: false,
        address: "",
        city: "",
        email: "",
       
        
    });
    
   

    const columnDefs = [
        { headerName: 'Transporter Name', field: 'Trname' },
        { headerName: 'Transporter Code', field: 'Trcode' },
        { headerName: 'Address', field: 'address' },
        { headerName: 'Country', field: 'country' },
        { headerName: 'Email', field: 'email' },
        {
            headerName: 'Active', field: 'Active',
            cellRenderer: (params) => (
                <ThumbUpIcon style={{ color: params.value ? 'green' : 'grey' }} />
            )
        },
        
        {
            headerName: 'Edit',
            field: '',
            cellRenderer: (params) => (
                <div style={{ display: 'inline-block', marginRight: "25px" }}>
                    <EditIcon onClick={() => handleEdit(params.data)} style={{ color: '#E9C46A', cursor: 'pointer' }} />
                </div>
            )
        },
        {
            headerName: 'Delete', field: 'delete',
            cellRenderer: (params) => (
                <div style={{ display: 'inline-block' }}>
                    <ClearIcon onClick={() => handleDelete(params.data._id)} style={{ color: "red", cursor: "pointer"}} />
                </div>
            )
        },
    ];

    const defaultColDef = {
        sortable: true, filter: true, editable: true, flex: 1
    };

    const getFetchData = async () => {
        const response = await axios.get("https://dms-live-final-2.onrender.com/transporter");
        if (response.data.success) {
            console.log(response.data.data);
            setTableData(response.data.data);
        }
    };

    useEffect(() => {
        getFetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post("https://dms-live-final-2.onrender.com/createtransporter", formData);
        if (response.data.success) {
            alert(response.data.message);
            getFetchData();
            setFormData({  
                Trname: '',
        country:'',
        Cnumber:"",
        remarks: "",
        Trcode: "",
        province: "",
        Cperson: "",
        Active: false,
        address: "",
        city: "",
        email: "",
            });
            setAddSection(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            console.log("Deleting:", id);
            const response = await axios.delete(`https://dms-live-final-2.onrender.com/deletetransporter/${id}`);
            if (response.data.success) {
                setTableData(prevData => prevData.filter(item => item._id !== id));
                alert(response.data.message);
            } else {
                alert("Failed to delete location" + response.data.message);
            }
        } catch (error) {
            console.error("Error deleting location:", error);
            alert("An error occurred while deleting the company");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const response = await axios.put("https://dms-live-final-2.onrender.com/updatetransporter", formDataEdit);
        if (response.data.success) {
            getFetchData();
            alert(response.data.message);
            setEditSection(false);
        }
    };

    const handleEdit = (data) => {
        console.log("Editing:", data);
        setFormDataEdit(data);
        setEditSection(true);
    };

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditOnChange = (e) => {
        const { name, value } = e.target;
        setFormDataEdit(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleExportToExcel = () => {
        exportToExcel(tableData, "Transporters", "TransporterData.xlsx");
    };

    return (
        <>
            <Nav />
            <div style={{ paddingLeft: "50px" }}>
                <Grid>
                    <TransporterCanvas
                        show={addSection || editSection}
                        setAddSection={setAddSection}
                        handleSubmit={handleSubmit}
                        handleOnChange={handleOnChange}
                        formData={formData}
                        editSection={editSection}
                        handleEditOnChange={handleEditOnChange}
                        handleUpdate={handleUpdate}
                        formDataEdit={formDataEdit}
                        exportToExcel={handleExportToExcel} 
                    />
                </Grid>
                <hr style={{ width: '95vw', border: '1px solid black' }} />
                <div className='d-flex vh-30 justify-content-center align-items-center'>
                    <div className='w-100 bg-white rounded p-3'>
                        <div className="ag-theme-quartz" style={{ height: 400, width: '100%' }}>
                            <AgGridReact
                                columnDefs={columnDefs}
                                defaultColDef={defaultColDef}
                                rowData={tableData}
                                pagination={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
            
        </>
    );
};

export default Transporter;