import React, { useEffect, useState } from 'react';
import './Tables.css';
import axios from 'axios';

const Tables = () => {
  const [tables, setTables] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/tables/`); // Adjust if deployed
        setTables(res.data);
        console.log(tables);
      } catch (error) {
        console.error("Error fetching tables", error);
      }
    };

    fetchTables();
  }, []);

  return (
    <div className="tables">
      <h2>Tables</h2>
      <div className="avability">
        <div className="reserve">
          <p className="green"></p>
          <p>Reserved</p>
        </div>
        <div className="available">
          <p className="gray"></p>
          <p>Available</p>
        </div>
      </div>
      <hr />
      <div className="table-row">
        {tables.map((table, index) => (
          <div
            key={index}
            className={`table ${table.tableStatus === "Reserved" ? "reserved" : "avail"}`}
          >
            <p>Table</p>
            <p>{table.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tables;
