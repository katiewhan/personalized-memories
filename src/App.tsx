import React from 'react';
import Scene from './components/Scene'
import MemoryPlayer from './components/MemoryPlayer';

import './App.css';

function App() {
  return (
    <div className='wrapper'>
      <MemoryPlayer name='Origami-1' />
      <Scene></Scene>
    </div>
  );
}

export default App;
