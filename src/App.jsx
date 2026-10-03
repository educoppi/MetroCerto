import { useState } from 'react'
import './App.css'
/*import Header from './components/Header/Header'*/
import Estoque from './screens/Estoque'
import Acompanhamento from './screens/Acompanhamento'
import Home from './screens/Home';

function App() {
  
  const [tela, setTela] = useState('home')

  return (
    <>
      <div style={{ padding: 8 }}>
        <button onClick={() => setTela('estoque')}>Estoque</button>
        <button onClick={() => setTela('acompanhamento')}>Acompanhamento</button>
        <button onClick={() => setTela('home')}>Home</button>
      </div>

      {tela === 'estoque' && <Estoque />}
      {tela === 'acompanhamento' && <Acompanhamento />}
      {tela === 'home' && <Home />}
    </>
  )
}

export default App
