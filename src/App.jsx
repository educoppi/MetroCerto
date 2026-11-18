import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import Header from './components/Header/Header'

import Estoque from './screens/Estoque';
import Acompanhamento from './screens/Acompanhamento';
import Info from './screens/Info';
import Cadastro from './screens/Cadastro';
import Index from './screens/Index';
import Footer from './components/footer/Footer';
import TecidosProvider from './data/TecidosProvider';

const secoes = ['home', 'estoque', 'info', 'acompanhamento', 'cadastro'];

const ancora = (id) => (id === 'home' ? 'inicio' : id);
const deAncora = (hash) => {
  const id = hash.replace('#', '');
  if (id === 'inicio') return 'home';
  return secoes.includes(id) ? id : null;
};

function App() {
  const [tela, setTela] = useState('home')
  const [resetEstoque, setResetEstoque] = useState(0)
  const travaSpy = useRef(0)

  const marcar = useCallback((id) => {
    setTela(id)
    window.history.replaceState(null, '', id === 'home' ? window.location.pathname : `#${ancora(id)}`)
  }, [])

  const navegar = useCallback((destino) => {
    const id = secoes.includes(destino) ? destino : 'home'
    travaSpy.current = Date.now() + 900
    marcar(id)
    if (id === 'estoque') setResetEstoque((v) => v + 1)
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setTimeout(() => {
      document.getElementById(ancora(id))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 0)
  }, [marcar])

  useEffect(() => {
    const inicial = deAncora(window.location.hash)
    if (inicial && inicial !== 'home') {
      travaSpy.current = Date.now() + 900
      setTimeout(() => document.getElementById(ancora(inicial))?.scrollIntoView({ block: 'start' }), 60)
    }

    let atual = null
    const aoRolar = () => {
      if (Date.now() < travaSpy.current) return
      const linha = window.innerHeight * 0.4
      const fimDaPagina = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      const elementos = [...document.querySelectorAll('[data-secao]')]
      const alvo = fimDaPagina
        ? elementos[elementos.length - 1]
        : elementos.filter((el) => el.getBoundingClientRect().top <= linha).pop() || elementos[0]
      const id = alvo?.dataset.secao
      if (id && id !== atual) {
        atual = id
        marcar(id)
      }
    }

    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [marcar])

  return (
    <TecidosProvider>
      <Header tela={tela} setTela={navegar} />

      <main className="app-main">
        <div id="inicio" className="secao secao--inicio" data-secao="home">
          <Index setTela={navegar} />
        </div>
        <div id="estoque" className="secao" data-secao="estoque">
          <Estoque key={resetEstoque} setTela={navegar} />
        </div>
        <div id="info" className="secao" data-secao="info">
          <Info />
        </div>
        <div id="acompanhamento" className="secao" data-secao="acompanhamento">
          <Acompanhamento />
        </div>
        <div id="cadastro" className="secao" data-secao="cadastro">
          <Cadastro setTela={navegar} />
        </div>
      </main>

      <Footer tela={tela} onNavegar={navegar} />
    </TecidosProvider>
  )
}

export default App
