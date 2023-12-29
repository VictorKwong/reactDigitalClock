import React from 'react';
import Clock from './Clock';
import Navbar from './navbar';
import './App.css'
import Alarm from './App';
import Timer from './Timer';

function App() {
  return (
    <div>
      <Navbar />
      <div className='text-center Small shadow container p-4 custom-height-300'>
        <Clock />
      </div>
    </div>
  );
}

export default App;