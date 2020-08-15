import React from 'react';
import './App.css';
import Info from "./Info.js"

function App() {
  return (
    <div className="container">

      <header className="AppHeader">
        <h1>Am I Chasing?</h1>
      </header>

      <body className="AppBody">
        <Info />
      </body>

    </div>
  );
}

export default App;
