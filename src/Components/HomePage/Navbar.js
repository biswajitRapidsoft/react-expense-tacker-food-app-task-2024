import React from 'react'

export default function Navbar({toggleCart, itemsCountInCart}) {
  const openCart = () => {
    toggleCart();
  }

  return (
    <div className="navbar">
        <div className="title"><h1>ReactMeals</h1></div>

        <div className="cart" onClick={openCart}>
            <i className="cart-icon fa-solid fa-cart-shopping"></i>
            <div className="cart-text">Your Cart</div>
            <div className="cart-items-number">{itemsCountInCart}</div>
        </div>
    </div>
  )
}