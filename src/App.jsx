import { useState } from 'react'
import './App.css'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './screens/Home'
import Estoque from './screens/Estoque'
import Acompanhamento from './screens/Acompanhamento'
import Info from './screens/Info'
import Cadastro from './screens/Cadastro'

function App() {
  const [tela, setTela] = useState('home')

  // Todas as telas recebem setTela, para poderem navegar (botões "Voltar", "Info" etc.)
  const renderizarTela = () => {
    switch (tela) {
      case 'estoque':
        return <Estoque setTela={setTela} />
      case 'info':
        return <Info setTela={setTela} />
      case 'acompanhamento':
        return <Acompanhamento setTela={setTela} />
      case 'cadastro':
        return <Cadastro setTela={setTela} />
      case 'home':
      default:
        return <Home setTela={setTela} />
    }
  }

  return (
    <>
      <Header setTela={setTela} />

      {/* <div> e não <main>: cada tela já tem o seu próprio <main> */}
      <div className="app__conteudo">
        {renderizarTela()}
      </div>

      <Footer />
    </>
  )
}

export default App