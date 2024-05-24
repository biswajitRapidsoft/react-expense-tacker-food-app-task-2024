import React from 'react';
import ReactDOM from 'react-dom';

export default function Loading({showLoading, alert}) {
    if (!showLoading) return null;

  return ReactDOM.createPortal (
    <>
        <div className="overlay"></div>
        <div className="loading">
            <h1><i className="fa-solid fa-spinner fa-spin"></i></h1>
            <h1>Loading...</h1>

            <div className="alert-div">
                <h1>{alert}</h1>
            </div>
        </div>
    </>, document.getElementById("loading-portal")
  )
}
