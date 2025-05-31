import React from 'react';
import './Sidebar.css';
import dashboardimage from '../../assets/dashboard-rounded.png';
import seatimage from '../../assets/mdi_seat.png';
import vector from '../../assets/Vector.png';
import vector1 from '../../assets/Vector1.png'
import {Link} from 'react-router';

const Sidebar = () => {
  return (
    <div className="sidebar">
        <Link to={'/'}>
          <div className="sidebar-item">
            <img className='img1' src={dashboardimage} alt="" />
          </div>
        </Link>
        <Link to={'/chairs'}>
          <div className="sidebar-item">
            <img className='img2' src={seatimage} alt="" />
          </div>
        </Link>
        <Link to={'/orders'}>
          <div className="sidebar-item">
            <img className='img3' src={vector} alt="" />
          </div>
        </Link>
        <Link to={'/menu'}>
          <div className="sidebar-item">
            <img className='img4' src={vector1} alt="" />
          </div>
        </Link>
    </div>
  )
}

export default Sidebar