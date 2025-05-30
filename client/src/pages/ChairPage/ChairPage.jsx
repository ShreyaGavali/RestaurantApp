import React, { useEffect, useState } from 'react';
import './ChairPage.css';
import deleteImage from '../../assets/delete.png';
import chairImage from '../../assets/chair.png';
import axios from 'axios';
import addbtnImg from '../../assets/Table Booking.png'
import { useSearch } from '../../context/SearchContext';

const ChairPage = () => {
    const [tables, setTables] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [tableName, setTableName] = useState('');
    const [chairCount, setChairCount] = useState('');
    const [errors, setErrors] = useState({});
    const { searchTerm } = useSearch();
    const normalizedSearch = searchTerm.toLowerCase();

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/tables/');
            setTables(res.data);
        } catch (err) {
            console.error("Error fetching tables:", err);
        }
    };

    const handleAddTable = async () => {
        const newErrors = {};
        if (!chairCount) newErrors.chairCount = 'Chair count is required';
        // Optional: you can validate table name too
        if (!tableName) newErrors.tableName = 'Table name is required';

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        try {
            await axios.post('http://localhost:5000/api/tables/', {
                name: tableName,
                chairs: chairCount,
            });
            setShowModal(false);
            setTableName('');
            setChairCount('');
            setErrors({});
            fetchTables();
        } catch (err) {
            console.error("Error adding table:", err);
        }
    };

    const handleDeleteTable = async (id) => {
    if (window.confirm("Are you sure you want to delete this table?")) {
        try {
            await axios.delete(`http://localhost:5000/api/tables/${id}`);
            fetchTables(); // refresh
        } catch (err) {
            console.error("Error deleting table:", err);
        }
    }
};


    const filteredTables = tables.filter(table => {
        return (
            table.name.toLowerCase().includes(normalizedSearch) ||
            table.chairs.toString().includes(normalizedSearch)
        );
    });

    return (
        <div className="chairs">
            <p className="chairs-heading">Tables</p>
            <div className="chairs-row">
                {filteredTables.map((table, index) => (
                    <div className="chair" key={table._id || index}>
                        <div className="delete-btn" onClick={() => handleDeleteTable(table._id)}>
                            <img src={deleteImage} alt="delete" />
                        </div>
                        <div className="table-name-count">
                            <p>Table</p>
                            <p>{table.name}</p>
                        </div>
                        <div className="chair-img-count">
                            <img src={chairImage} alt="chair" />
                            <p>{table.chairs}</p>
                        </div>
                    </div>
                ))}
                {filteredTables.length === 0 && (
                    <p style={{ textAlign: 'center', width: '100%' }}>No matching tables found.</p>
                )}
                <div className="add-chair-btn" onClick={() => setShowModal(true)}>
                    <img src={addbtnImg} alt="" />
                </div>
            </div>
            {showModal && (
                <div className="chair-modal">
                    <div className="chair-styled-modal-content">
                        <button className="chair-modal-close-btn" onClick={() => setShowModal(false)}>×</button>
                        <label className="chair-modal-label">Table name</label>
                        <input
                            className="chair-modal-input"
                            type="text"
                            value={tableName}
                            onChange={(e) => setTableName(e.target.value)}
                        />
                        {/* {errors.tableName && <p className="chair-error-text">{errors.tableName}</p>} */}
                        {errors.tableName &&
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "5px", background: "#ffe6e6", width: "100%", marginBottom: "5px" }}>
                                <i class="fa-solid fa-circle-exclamation" style={{ color: "red" }}></i>
                                <p className="error-banner">{errors.tableName}</p>
                            </div>
                        }
                        <label className="chair-modal-label">Chair</label>
                        <select
                            className="chair-modal-select"
                            type="number"
                            value={chairCount}
                            onChange={(e) => setChairCount(e.target.value)}
                        >
                            <option value="0">0</option>
                            <option value="2">2</option>
                            <option value="4">4</option>
                            <option value="6">6</option>
                            <option value="8">8</option>
                            <option value="10">10</option>
                        </select>
                        {/* {errors.chairCount && <p className="chair-error-text">{errors.chairCount}</p>} */}
                        {errors.chairCount &&
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "5px", background: "#ffe6e6", width: "100%", marginBottom: "5px" }}>
                                <i class="fa-solid fa-circle-exclamation" style={{ color: "red" }}></i>
                                <p className="error-banner">{errors.chairCount}</p>
                            </div>
                        }
                        <button className="chair-modal-create-btn" onClick={handleAddTable}>
                            Create
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ChairPage;
