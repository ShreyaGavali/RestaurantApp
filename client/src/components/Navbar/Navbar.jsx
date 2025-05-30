import React from 'react';
import './Navbar.css';
import { useSearch } from '../../context/SearchContext';

const Navbar = () => {
  const { searchTerm, setSearchTerm } = useSearch();
  return (
    <div className="navbar">
        <div className="logo"></div>
        <div className="filter-input">
            <input type="text" placeholder='Filter...'  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <i className="fa-solid fa-angle-down"></i>
        </div>
    </div>
  )
}

export default Navbar