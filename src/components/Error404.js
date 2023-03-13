import React from "react";
import { NavLink } from "react-router-dom";

const Error404 = () => {
  return (
    <div className="error404-div">
      <h1>Error 404</h1>
      <img src={require("../images/logo192.png")} width="100px"></img>
      <h2>Not Found</h2>
      <NavLink to="/">Start a new list</NavLink>
    </div>
  );
};

export default Error404;
