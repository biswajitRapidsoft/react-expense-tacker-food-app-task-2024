import axios from 'axios';
import React, { useEffect, useState } from 'react';
import MealItem from './MealItem';
import { firebaseConfig } from '../../Config/Firebase';

export default function MealContainer({mealInCart, getCart, toggleLoadingPage, setAlert}) {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetchMeals();
    }, [])

    const fetchMeals = async () => {
        try {
          const res = await axios.get(`${firebaseConfig.databaseURL}/Meals.json`);
          const data = res.data;
          if (data) {
              setMeals(data);
          }
          setLoading(false);
        } catch (error) {
          console.error("Failed to get meals", error);
          setLoading(false);
        }
    }
    
  return (
    <div className="meal-container">
      {loading ? (<h1>Loading...</h1>)
      : meals.length === 0 ? (<h1>No Meals Found!</h1>)
      : (meals.map((meal, index) => (
        <MealItem meals={meals} meal={meal} index={index} key={index} mealInCart={mealInCart} getCart={getCart} toggleLoadingPage={toggleLoadingPage} setAlert={setAlert}/>
      )))}
    </div>
  )
}