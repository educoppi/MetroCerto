import { useState } from 'react'
import './App.css'
import Header from './components/Header/Header'
import Footer from './components/footer/Footer'
import Home from './screens/Home'
import Estoque from './screens/Estoque'
import Acompanhamento from './screens/Acompanhamento'
import Info from './screens/Info'
import Cadastro from './screens/Cadastro'

function App() {
  const [tela, setTela] = useState('home')

  const renderizarTela = () => {
    switch (tela) {
      case 'home':
        return <Home />
      case 'estoque':
        return <Estoque />
      case 'info':
        return <Info />
      case 'acompanhamento':
        return <Acompanhamento />
      case 'cadastro':
        return <Cadastro />
      default:
        return <Home />
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