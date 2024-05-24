import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { firebaseConfig } from '../../Config/Firebase';
import ReactDOM from 'react-dom';

export default function OrderHistory({toggleOrderHistory, toggleCart, toggleLoadingPage, setAlert}) {
    const [orderHistory, setOrderHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetchOrderHistory();
    }, [])

    const fetchOrderHistory = async () => {
        toggleLoadingPage();
        setAlert("");
        try {
            const res = await axios.get(`${firebaseConfig.databaseURL}/OrderHistory.json`);
            if (res.data) {
                const formattedOrderHistory = Object.values(res.data);
                setOrderHistory(formattedOrderHistory);
            } else {
                setOrderHistory([]);
            }
            setLoading(false);
            toggleLoadingPage();
        } catch (error) {
            console.error("Could Not Get The Order History!", error);
            setAlert("Error fetching order history!");
            setLoading(false);
            setTimeout(() => {
                toggleLoadingPage();
            }, 1500);

            closeHistoryPage();
        }
    };


    const closeHistoryPage = () => {
        toggleOrderHistory();
        toggleCart();
    }

    return ReactDOM.createPortal (
    <>
        <div className="overlay"></div>
        <div className="history-container">
            <div className="history-name">
                <h1>Order History</h1>
            </div>

            <div className="order-history-items">
                {loading ? 
                (<h1>Loading...</h1>) 
                : orderHistory.length === 0 ? 
                (<h1>No Previous Orders Found !</h1>) 
                : (orderHistory.map((order, index) => {
                    return (
                        <table className="order-history-table" key={index}>
                            <thead>
                                <tr>
                                    <th className="order-date" colSpan="4"><h3><i className="fa-solid fa-play"></i>  Order {index + 1}</h3></th>
                                </tr>

                                <tr>
                                    <th>Dish Name</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>

                            <tbody>
                                {order.meals && order.meals.map((meal, mealIndex) => {
                                    return (
                                        <tr key={mealIndex}>
                                            <td>{meal.dishName}</td>
                                            <td>${(meal.price)}</td>
                                            <td>{meal.quantity}</td>
                                            <td>${(meal.price * meal.quantity).toFixed(2)}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>

                            <tfoot>
                                <tr>
                                    <td colSpan="3"><strong>Total Amount:</strong></td>
                                    <td><strong>${order.amount}</strong></td>
                                </tr>
                            </tfoot>
                        </table>
                    )
                }))}
            </div>

            <button className="close-history-btn" onClick={closeHistoryPage}>Close</button>
        </div>
    </>,
    document.getElementById("portal2")
  )
}