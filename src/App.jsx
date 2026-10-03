import { useState } from 'react'
import './App.css'
import Header from './components/Header/Header'

import Estoque from './screens/Estoque';
import Acompanhamento from './screens/Acompanhamento';
import Info from './screens/Info';
import Cadastro from './screens/Cadastro';
import Footer from './components/footer/Footer';

function App() {
  const [tela, setTela] = useState('acompanhamento')

  const renderizarTela = () => {
    switch (tela) {
      case 'estoque':
        return <Estoque />
      case 'info':
        return <Info />
      case 'acompanhamento':
        return <Acompanhamento />
      case 'cadastro':
        return <Cadastro />
      default:
        return <Acompanhamento />
    }
  }

  return (
    <>
      <Header setTela={setTela} />
      
      <main>
        {renderizarTela()}
      </main>

      <Footer />
    </>
  )
}

export default App