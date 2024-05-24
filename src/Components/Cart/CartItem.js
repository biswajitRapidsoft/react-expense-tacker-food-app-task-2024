import React, { useState } from 'react';
import axios from 'axios';
import { firebaseConfig } from '../../Config/Firebase';

export default function CartItem({ meal, index, setMealInCart }) {
    const [cartItemQuantity, setCartItemQuantity] = useState(Number(meal.quantity));

    const updateMealQuantity = async (newQuantity) => {
        if (newQuantity <= 0) {
            await removeMealFromCart();
        } else {
            setCartItemQuantity(newQuantity);
            setMealInCart(prevMeals => {
                const updatedMeals = [...prevMeals];
                updatedMeals[index] = { ...updatedMeals[index], quantity: newQuantity };
                return updatedMeals;
            });
            await updateMealQuantityInFirebase(newQuantity);
        }
    };

    const increaseQuantity = () => {
        updateMealQuantity(cartItemQuantity + 1);
    };

    const decreaseQuantity = () => {
        updateMealQuantity(cartItemQuantity - 1);
    };

    const removeMealFromCart = async () => {
        try {
            const res = await axios.get(`${firebaseConfig.databaseURL}/Cart.json`);
            const data = res.data;
            const mealKey = Object.keys(data).find(key => data[key].dishName === meal.dishName);

            if (mealKey) {
                await axios.delete(`${firebaseConfig.databaseURL}/Cart/${mealKey}.json`);
                setMealInCart(prevMeals => prevMeals.filter((_, i) => i !== index));
            }
        } catch (error) {
            console.error("Error removing meal from the cart", error);
        }
    };

    const updateMealQuantityInFirebase = async (newQuantity) => {
        try {
            const res = await axios.get(`${firebaseConfig.databaseURL}/Cart.json`);
            const data = res.data;
            const mealKey = Object.keys(data).find(key => data[key].dishName === meal.dishName);

            if (mealKey) {
                await axios.patch(`${firebaseConfig.databaseURL}/Cart/${mealKey}.json`, { quantity: newQuantity });
            }
        } catch (error) {
            console.error("Error updating meal quantity in the cart", error);
        }
    };

    return (
        <>
            <div className="item">
                <div className="item-info">
                    <h2 className="item-name">{meal.dishName}</h2>
                    <div className="item-price-quantity">
                        <div className="item-price"><h3>${meal.price}</h3></div>
                        <div className="item-quantity">
                            X {cartItemQuantity}
                        </div>
                    </div>
                </div>
                <div className="item-quantity-btns">
                    <button className="decrease-btn" onClick={decreaseQuantity}><h4>-</h4></button>
                    <button className="increase-btn" onClick={increaseQuantity}><h4>+</h4></button>
                </div>
            </div>
        </>
    );
}
