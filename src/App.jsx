import { useState } from 'react'
import './App.css'
/*import Header from './components/Header/Header'*/
import Estoque from './screens/Estoque'
import Acompanhamento from './screens/Acompanhamento'

function App() {
  const [tela, setTela] = useState('acompanhamento')

  return (
    <>
      <div style={{ padding: 8 }}>
        <button onClick={() => setTela('estoque')}>Estoque</button>
        <button onClick={() => setTela('acompanhamento')}>Acompanhamento</button>
      </div>

      {tela === 'estoque' ? <Estoque /> : <Acompanhamento />}
    </>
  )
}

export default App
