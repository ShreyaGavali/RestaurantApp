import React from 'react'
import './MenuPage.css'
import searchImage from '../../assets/search.png'
import burgerImage from '../../assets/burger.png'
import pizzaImage from '../../assets/pizza.png'
import coldDrinkImage from '../../assets/cold-drink.png'
import frenchFriesImage from '../../assets/fries.png'
import vegiImage from '../../assets/vegi.png'
import MenuCard from '../../components/MenuCard/MenuCard'
import { Link, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const MainPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Pizza'); // Default
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState({});
  const navigate = useNavigate();

  const fetchMenuItems = async (category) => {
    try {
      const res = await axios.post('http://localhost:5000/api/menu/filter', { category });
      setMenuItems(res.data);
      console.log(res.data)
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  useEffect(() => {
    fetchMenuItems(selectedCategory);
  }, [selectedCategory]);

  const handleFilterClick = (category) => {
    setSelectedCategory(category);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    try {
      const res = await axios.post('http://localhost:5000/api/menu/filter', {
        category: searchTerm.trim()
      });
      setMenuItems(res.data);
      setSelectedCategory(searchTerm); // update heading
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelect = (item) => {
    setSelectedItems(prev => ({
      ...prev,
      [item._id]: {
        ...item,
        quantity: prev[item._id] ? prev[item._id].quantity + 1 : 1
      }
    }));
  };

  const goToCheckout = () => {
    navigate('/checkout', { state: { selectedItems: Object.values(selectedItems) } });
  };

  return (
    <div className="menu-main-page">
      <div className="menu-page">
        <div className="greet">
          <p>Good evening</p>
          <p className='order-text'>Place your order here</p>
        </div>
        <div className="search">
          <div className="search-bar">
            <img src={searchImage} alt="" />
            <input type="text" placeholder='Search' onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={handleKeyDown} />
          </div>
        </div>
        <div className="filter-items">
          <div className="filter-item" onClick={() => handleFilterClick('Burger')}>
            <img src={burgerImage} alt=""  />
            <p>Burger</p>
          </div>
          <div className="filter-item" onClick={() => handleFilterClick('Pizza')}>
            <img className='pizza-img' src={pizzaImage} alt=""  />
            <p>Pizza</p>
          </div>
          <div className="filter-item"  onClick={() => handleFilterClick('Cold Drink')}>
            <img src={coldDrinkImage} alt="" />
            <p>Drink</p>
          </div>
          <div className="filter-item" onClick={() => handleFilterClick('French Fries')}>
            <img src={frenchFriesImage} alt=""  />
            <p>French Fries</p>
          </div>
          <div className="filter-item" onClick={() => handleFilterClick('Veggies')}>
            <img src={vegiImage} alt=""  />
            <p>Veggies</p>
          </div>
        </div>
        <div className="menue-items">
          <p className="menue-heading">{selectedCategory}</p>
          <div className="menue-item">
            {menuItems.length > 0 ? (
              menuItems.map((item) => (
                <MenuCard key={item._id} item={item} onSelect={() => handleSelect(item)} quantity={selectedItems[item._id]?.quantity || 0} />
              ))
            ) : (
              <p>No items found</p>
            )}
          </div>
        </div>
          <div className="next-btn">
            <button onClick={goToCheckout}>Next</button>
          </div>
      </div>
    </div>
  )
}

export default MainPage