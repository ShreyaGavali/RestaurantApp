import React from 'react'
import './ChefTable.css'
import axios from 'axios'
import { useState } from 'react';
import { useEffect } from 'react';

const ChefTable = () => {
    const [chefs, setChefs] = useState([]);
    useEffect(() => {
        const fetchChefs = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/chefs/'); // use full URL if needed
                setChefs(res.data);
            } catch (error) {
                console.error("Error fetching chefs:", error);
            }
        };

        fetchChefs();
    }, []);
    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Chef Name</th>
                        <th>Order Taken</th>
                    </tr>
                </thead>
                <tbody>
                    {chefs.map((chef, index) => (
                        <tr key={index}>
                            <td>{chef.name}</td>
                            <td>{chef.ordersTaken}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    )
}

export default ChefTable