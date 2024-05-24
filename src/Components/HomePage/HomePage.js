import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import Img from './Img'
import Slogan from '../Slogan/Slogan'
import MealContainer from '../MealContainer/MealContainer'
import Cart from '../Cart/Cart'
import OrderHistory from '../OrderHistory/OrderHistory'
import axios from 'axios'
import { firebaseConfig } from '../../Config/Firebase'
import Loading from '../Loading/Loading'

export default function HomePage() {
  const [cartShouldOpen, setCartShouldOpen] = useState(false);
  const [mealInCart, setMealInCart] = useState([]);
  const [historyShouldOpen, setHistoryShouldOpen] = useState(false);
  const [itemsCountInCart, setItemsCountInCart] = useState(0);
  const [showLoading, setShowLoading] = useState(false);
  const [alert, setAlert] = useState("");

  const toggleCart = () => {
    setCartShouldOpen(!cartShouldOpen);
  }

  const toggleOrderHistory = () => {
    setHistoryShouldOpen(!historyShouldOpen);
  }

  const toggleLoadingPage = () => {
    setShowLoading(prev => !prev);
    console.log("toggled!")
  }

  useEffect(() => {
    setItemsCountInCart(mealInCart.length)
  }, [mealInCart])

  useEffect(() => {
    getCart();
  }, [])
  
  const getCart = async () => {
    try {
      const res = await axios.get(`${firebaseConfig.databaseURL}/Cart.json`);
      const data = res.data ? Object.values(res.data) : [];
      setMealInCart(data);
    } catch (error) {
      console.error("Error Fetching Cart!", error);
    }
  }

  return (
    <div className="home">
      <Navbar toggleCart={toggleCart} itemsCountInCart={itemsCountInCart}/>

      <Img/>

      <div className="slogan-meals">
        <Slogan/>

        <MealContainer mealInCart={mealInCart} getCart={getCart} toggleLoadingPage={toggleLoadingPage} setAlert={setAlert}/>
      </div>

      {cartShouldOpen && <Cart toggleCart={toggleCart} mealInCart={mealInCart} setMealInCart={setMealInCart} toggleOrderHistory={toggleOrderHistory} getCart={getCart} toggleLoadingPage={toggleLoadingPage} setAlert={setAlert}/>}

      {historyShouldOpen && <OrderHistory toggleOrderHistory={toggleOrderHistory} toggleCart={toggleCart} toggleLoadingPage={toggleLoadingPage} setAlert={setAlert}/>}

      <Loading showLoading={showLoading} alert={alert} />
    </div>
  )
}