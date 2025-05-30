import React from 'react'
import './AnalyticsCard.css'

const AnalyticsCard = ({CardImage, CardTitle, CardInfo}) => {
  return (
    <div className='card'>
        <img src={CardImage} alt="" />
        <div className="info">
            <p>{CardInfo}</p>
            <p>{CardTitle}</p>
        </div>
    </div>
  )
}

export default AnalyticsCard