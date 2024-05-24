import React, { useState } from 'react';
import axios from 'axios';
import { firebaseConfig } from '../../Config/Firebase';

export default function MealItem({meals, meal, index, mealInCart, getCart, toggleLoadingPage, setAlert}) {
  const [quantity, setQuantity] = useState(1);

  const changeQuantity = (e) => {
    setQuantity(e.target.value);
  }

  const addToCart = async () => {
    toggleLoadingPage();
    setAlert("");

    const existingMeal = mealInCart.find(cartMeal => cartMeal.dishName === meal.dishName);
    
    if (existingMeal) {
      const updatedQuantity = existingMeal.quantity + parseInt(quantity);

      try {
        const res = await axios.get(`${firebaseConfig.databaseURL}/Cart.json`);
        const data = res.data;
        const mealKey = Object.keys(data).find(key => data[key].dishName === meal.dishName);

        if (mealKey) {
          await axios.patch(`${firebaseConfig.databaseURL}/Cart/${mealKey}.json`, { quantity: updatedQuantity });
          await getCart();
          setAlert("Item quantity updated in cart successfully!");
        }
      } catch (error) {
        console.error("Error updating meal quantity in the cart", error);
        setAlert("Error updating meal quantity in the cart!");
      } finally {
        setTimeout(() => {
          toggleLoadingPage();
        }, 1500);
      }
    } else {
      const newMeal = {
        ...meal,
        quantity: parseInt(quantity)
      };
  
      try {
        await axios.post(`${firebaseConfig.databaseURL}/Cart.json`, newMeal);
        await getCart();
        setAlert("Item added to cart successfully!");
      } catch (error) {
        console.error("Error adding meal to the cart in the database", error);
        setAlert("Error adding meal to the cart");
      } finally {
        setTimeout(() => {
          toggleLoadingPage();
        }, 1500);
      }
    }
  };

  return (
    <>
      <div className="meal-item">
        <div className="dish-details">
          <h2>{meal.dishName}</h2>
          <p className="dish-description">{meal.description}</p>
          <h2 className="dish-price">${meal.price}</h2>
        </div>

        <div className="quantity-addbtn">
          <form className="quanity-input-form">
            <label htmlFor={`quantityInput-${index}`}><h2>Amount</h2></label>
            <input type="number" name="quantity" min="1" className="quantityInput" id={`quantityInput-${index}`} value={quantity} onChange={changeQuantity}/>
          </form>
          <button className="add-btn" onClick={addToCart}><h3 className="btn-h3">+Add</h3></button>
        </div>
      </div>

      {index < meals.length - 1 && <div className="border"></div>}
    </>
  )
}