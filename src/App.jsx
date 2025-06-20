import { useState } from 'react';
import './index.css';
import Navbar from './components/navBar/Navbar';
import NavTwo from './components/navBar/NavTwo';

function App() {
  return (
    <div className="app">
      <Navbar />
      <NavTwo />
      {/* Other components can be added here */}    
      <h1>Hello, World!</h1>
    </div>
  );
}

export default App;