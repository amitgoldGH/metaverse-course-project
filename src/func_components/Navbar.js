/* eslint-disable react/prop-types */
import React from 'react';

export default function Navbar(props) {
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload(false);
  };
  return (
    <div className="Navbar">
      <p>Logged in user: {props.token.username}</p>
      <p>type: {props.token.type}</p>
      <button onClick={handleLogout}>Sign out</button>
    </div>
  );
}
