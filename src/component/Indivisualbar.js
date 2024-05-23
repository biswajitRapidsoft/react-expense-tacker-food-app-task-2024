import React from "react";

export default function Indivisualbar({ month }) {
  return (
    <div className="indivisual-bar">
      <div className="full-height">
        <div
          className="fill-hight"
          style={{
            height: `${100 - month.per}%`,
            backgroundColor: "rgb(168 130 201)",
            borderRadius: "10px 10px 0px 0px",
            border: "none",
          }}
        ></div>
      </div>
      <p>{month.month}</p>
    </div>
  );
}
