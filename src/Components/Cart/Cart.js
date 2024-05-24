import React from 'react';
import ReactDOM from 'react-dom';
import CartItem from './CartItem';
import axios from 'axios';
import { firebaseConfig } from '../../Config/Firebase';

export default function Cart({ toggleCart, mealInCart, setMealInCart, toggleOrderHistory, toggleLoadingPage, setAlert }) {
    const closeCart = () => {
        toggleCart();
    };

    const calculateTotalAmount = () => {
        return mealInCart.reduce((total, meal) => total + meal.price * meal.quantity, 0).toFixed(2);
    };
    
    const handleOrder = async () => {
        toggleLoadingPage();
        setAlert("");

        if (mealInCart.length === 0) {
            setAlert("Your cart is empty! Add your favorite food to the cart to proceed.");
            setTimeout(() => {
                toggleLoadingPage();
            }, 1500);
            return;
        }

        const newOrder = { meals: mealInCart, amount: calculateTotalAmount() };

        try {
            await axios.post(`${firebaseConfig.databaseURL}/OrderHistory.json`, newOrder, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setAlert('Your order has been placed successfully!');
            setMealInCart([]);

            await axios.delete(`${firebaseConfig.databaseURL}/Cart.json`);
        } catch (error) {
            console.error('Error saving order history:', error);
            setAlert('Error saving order history.');
        } finally {
            setTimeout(() => {
                toggleLoadingPage();
            }, 1500);
        }
    };

    const handleOpenOrderHistory = () => {
        toggleOrderHistory();
        toggleCart();
    }

    return ReactDOM.createPortal(
        <>
            <div className="overlay"></div>
            <div className="cart-container">
                <div className="cart-name">
                    <h1 style={{marginBottom: "0"}}>Your Cart</h1>
                </div>

                {mealInCart.length === 0 && 
                    <h1 style={{margin: "0"}}>Your Cart Is Empty ! :(</h1>
                }

                {mealInCart && 
                    <div className="cart-items">
                        {mealInCart.map((meal, index) => (
                            <CartItem key={index} meal={meal} index={index} setMealInCart={setMealInCart} />
                        ))}
                    </div>
                }

                {mealInCart.length !== 0 && 
                    <div className="total-amount">
                        <div className="amount-text">Total Amount</div>
                        <div className="amount">${calculateTotalAmount()}</div>
                    </div>
                }

                <div className="cart-btns">
                    <button className="history-btn" onClick={handleOpenOrderHistory}>Order History</button>
                    <div className="close-order-btns">
                        <button className="close-btn" onClick={closeCart}>Close</button>
                        <button className="order-btn" onClick={handleOrder}>Order</button>
                    </div>
                </div>
            </div>
        </>,
        document.getElementById("portal1")
    );
}