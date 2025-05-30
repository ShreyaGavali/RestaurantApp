import React from 'react'
import './MenuCard.css'

const MenuCard = ({item, onSelect, quantity}) => {
  return (
    <div className='menu-card'>
        <div className="menu-img">
            <img src={item.img} alt="" />
        </div>
        <div className="menu-info">
            <p className="menu-info-heading">{item.name}</p>
            <div className="menu-price-quantity">
                <p> &#8377; {item.price}</p>
                <i className="fa-solid fa-plus fa-lg"  onClick={onSelect}></i>
                {quantity > 0 && <p className="quantity">{quantity}</p>}
            </div>
        </div>
    </div>
  )
}

export default MenuCard