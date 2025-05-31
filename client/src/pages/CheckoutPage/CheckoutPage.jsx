import React, { useState } from 'react'
import './CheckoutPage.css'
import searchImage from '../../assets/search.png'
import closeBtnImage from '../../assets/Back.png'
import { useLocation } from 'react-router-dom'
import axios from "axios"
import { useSwipeable } from 'react-swipeable';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [userModal, setUserModal] = useState(false);
    const [cookingInstructions, setCookingInstructions] = useState('');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const location = useLocation();
    const selectedItems = location.state?.selectedItems || [];
    const [orderType, setOrderType] = useState(null); // null, "Dine In", or "Take Away"
    const [errors, setErrors] = useState({});
    const [userInfoError, setUserInfoError] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;


    const validateUserDetails = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = "Name is required";
        if (!phoneNumber.trim()) {
            newErrors.phoneNumber = "Phone number is required";
        } else if (!/^\d{10}$/.test(phoneNumber)) {
            newErrors.phoneNumber = "Enter a valid 10-digit number";
        }
        if (orderType === "Take Away" && !address.trim()) {
            newErrors.address = "Address is required for Take Away";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const [quantities, setQuantities] = useState(
        selectedItems.reduce((acc, item) => {
            acc[item._id] = item.quantity;
            return acc;
        }, {})
    );

    const increase = (id) => {
        setQuantities(prev => ({ ...prev, [id]: prev[id] + 1 }));
    };

    const decrease = (id) => {
        setQuantities(prev => ({
            ...prev,
            [id]: Math.max(prev[id] - 1, 1)
        }));
    };

    const removeItem = (id) => {
        setQuantities(prev => {
            const updated = { ...prev };
            delete updated[id];
            return updated;
        });
    };

    const updatedItems = selectedItems.filter(item => quantities[item._id]);

    const itemTotal = updatedItems.reduce((total, item) => total + item.price * quantities[item._id], 0);

    const handleOrder = async () => {
        if (!orderType) {
            setUserInfoError( "Please select Dine In or Take Away.");
            return;
        }
        const isValid = validateUserDetails();
        if (!isValid) {
            setUserInfoError("Please add your info to continue");
            return;
        }
        console.log(isValid)
        setUserInfoError("");
        setLoading(true);
        const orderPayload = {
            orderType,
            items: updatedItems.map(item => ({
                name: item.name,
                price: item.price,
                quantity: quantities[item._id]
            })),
            instructions: cookingInstructions,
            customerName: name,
            customerPhone: phoneNumber,
            customerAddress: address,
            estimatedDeliveryTime: "42 mins"
        };

        console.log(orderPayload)

        try {
            const response = await axios.post(`${backendUrl}/api/orders/`, orderPayload); // Change to your backend URL
            console.log("Order placed successfully:", response.data);
            toast.success("Order placed successfully!", {
                position: "top-center",
                autoClose: 2000,
            });

            setTimeout(() => {
                navigate("/menu"); // Replace with actual menu page route
            }, 2500);
        } catch (err) {
            console.error("Failed to place order:", err.response?.data || err.message);
        } finally {
            setLoading(false); // hide spinner and enable button
        }
    };

    const handlers = useSwipeable({
        onSwipedRight: handleOrder,
        preventDefaultTouchmoveEvent: true,
        trackMouse: true, // for desktop swipe
    });


    return (
        <div className="main-checkout-page">
            <div className="checkout-page">
                <div className="greet">
                    <p>Good evening</p>
                    <p className='order-text'>Place your order here</p>
                </div>
                <div className="search">
                    <div className="search-bar">
                        <img src={searchImage} alt="" />
                        <input type="text" placeholder='Search' />
                    </div>
                </div>
                <div className="menu-cart-container">
                    {updatedItems.map(item => (
                        <div className="menu-cart" key={item._id}>
                            <div className="dish-img">
                                <img src={item.img} alt="" />
                            </div>
                            <div className="dish-info">
                                <div className='dish-name-price-cancel-btn'>
                                    <div className="dish-name-price">
                                        <p className='dish-name'>{item.name}</p>
                                        <p className='dish-price'>&#8377; {item.price * quantities[item._id]}</p>
                                    </div>
                                    <div className="cancel-btn" onClick={() => removeItem(item._id)}>
                                        <img src={closeBtnImage} alt="" />
                                    </div>
                                </div>
                                <div className="quantity">
                                    <i className="fa-solid fa-minus" onClick={() => decrease(item._id)}></i>
                                    <p>{quantities[item._id]}</p>
                                    <i className="fa-solid fa-plus" onClick={() => increase(item._id)}></i>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="cooking-instructions" onClick={() => setShowModal(true)}>
                    <p>Add cooking instructions (optional)</p>
                </div>
                {showModal && (
                    <div className="modal-overlay">
                        <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        <div className="modal-content">
                            <p className="modal-heading">Add Cooking instructions</p>
                            <textarea
                                value={cookingInstructions}
                                onChange={(e) => setCookingInstructions(e.target.value)}
                                className="modal-textarea"
                            ></textarea>
                            <p className="modal-info">
                                The restaurant will try its best to follow your request. However, refunds or cancellations in this regard won’t be possible.
                            </p>
                            <div className="modal-buttons">
                                <button className="modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="modal-next" onClick={() => setShowModal(false)}>Next</button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="dinein-takeaway-btn">
                    <button className={orderType === "Dine In" ? "active" : ""} onClick={() => setOrderType("Dine In")}>Dine In</button>
                    <button className={orderType === "Take Away" ? "active" : ""} onClick={() => setOrderType("Take Away")}>Take Away</button>
                </div>
                <div className="charges">
                    <div className="charges-name">
                        <p>Item Total</p>
                        {orderType === "Take Away" && <p>Delivery Charge</p>}
                        <p>Taxes</p>
                        <p className='grand-total'>Grand Total</p>
                    </div>
                    <div className="charges-amount">
                        <p>&#8377; {itemTotal}</p>
                        {orderType === "Take Away" && <p>&#8377; 50</p>}
                        <p>&#8377; {Math.round(itemTotal * 0.05)}</p>
                        <p className='grand-total-amount'>&#8377; {itemTotal + 50 + Math.round(itemTotal * 0.05)}</p>
                    </div>
                </div>
                <hr />
                <div className="user-info">
                    <p className='user-detail-heading'>Your details</p>
                    {name && phoneNumber ? (
                        <div className='user-details-display'>
                            <div className="user-name-number">
                                <p className="user-name">{name}</p>,
                                <p className="user-number">{phoneNumber}</p>
                            </div>
                            <hr />
                            {orderType === "Take Away" && (
                                <div className="user-address-DTime">
                                    <div className="address">
                                        <i className="fa-solid fa-location-dot"></i>
                                        <p className="user-address">{address}</p>
                                    </div>
                                    <div className="DTime">
                                        <i className="fa-solid fa-clock fa-sm"></i>
                                        <p>Delivery in 42 mins</p>
                                    </div>
                                </div>
                            )}
                            <hr />
                        </div>
                    ) : (
                        <>
                            <p className='add-user-details' onClick={() => setUserModal(true)}>
                                Please add your details to place order
                            </p>
                            {userInfoError &&
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "5px", background: "#ffe6e6", width: "80%", marginLeft: "25px" }}>
                                    <i className="fa-solid fa-circle-exclamation" style={{ color: "red" }}></i>
                                    <p className="error-banner">{userInfoError}</p>
                                </div>
                            }
                        </>
                    )}

                </div>
                {userModal && (
                    <div className="modal-overlay">
                        <button className="modal-close" onClick={() => setUserModal(false)}>×</button>
                        <div className="modal-content">
                            <p className="modal-heading">Add details</p>
                            <input type="text" placeholder='Name' className="modal-input" value={name} onChange={(e) => setName(e.target.value)} />
                            {errors.name &&
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "5px", background: "#ffe6e6", width: "80%", marginLeft: "25px", marginBottom: "5px" }}>
                                    <i className="fa-solid fa-circle-exclamation" style={{ color: "red" }}></i>
                                    <p className="error-banner">{errors.name}</p>

                                </div>
                            }
                            <input type="text" placeholder='Phone number' className="modal-input" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                            {errors.phoneNumber &&
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "5px", background: "#ffe6e6", width: "80%", marginLeft: "25px", marginBottom: "5px" }}>
                                    <i class="fa-solid fa-circle-exclamation" style={{ color: "red" }}></i>
                                    <p className="error-banner">{errors.phoneNumber}</p>
                                </div>
                            }
                            {orderType === "Take Away" && (
                                <>
                                    <input type="text" placeholder='Address' className="modal-input" value={address} onChange={(e) => setAddress(e.target.value)} />
                                    {errors.address &&
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "5px", background: "#ffe6e6", width: "80%", marginLeft: "25px", marginBottom: "5px" }}>
                                            <i class="fa-solid fa-circle-exclamation" style={{ color: "red" }}></i>
                                            <p className="error-banner">{errors.address}</p>
                                        </div>
                                    }
                                </>
                            )}
                            <div className="modal-buttons">
                                <button className="modal-cancel" onClick={() => setUserModal(false)}>Cancel</button>
                                <button className="modal-next" onClick={() => setUserModal(false)}>Add</button>
                            </div>
                        </div>
                    </div>
                )}
                 {/* <div className="order-btn" onClick={handleOrder} {...handlers}>
                    <i className="fa-solid fa-arrow-right"></i>
                    <p>Swipe to Order</p>
                </div>  */}
                <div
                    className={`order-btn ${loading ? 'disabled' : ''}`}
                    onClick={!loading ? handleOrder : null}
                    {...handlers}
                >
                    {loading ? (
                        <div className="spinner"></div>
                    ) : (
                        <>
                            <i className="fa-solid fa-arrow-right"></i>
                            <p>Swipe to Order</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CheckoutPage