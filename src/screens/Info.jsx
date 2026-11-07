import"./Info.css";

const colunas = [
  { chave: "data", titulo: "Data" },
  { chave: "idRolo", titulo: "Id. Rolo" },
  { chave: "estampa", titulo: "Estampa" },
  { chave: "metros", titulo: "Metros retirados" },
];

// Cada item: { data: "06/11/2026", idRolo: "R-001", estampa: "Floral", metros: 12 }
const registros = [];

const MIN_LINHAS = 4;



export default function Info() {
    const linhasVazias = Math.max(MIN_LINHAS - registros.length, 0);
    return (

    <div className="pagina">
      

      <main className="info">
        <h1 className="info__titulo">INFO</h1>

        <div className="info__tabela-wrapper">
          <table className="info__tabela">
            <thead>
              <tr>
                {colunas.map((col) => (
                  <th key={col.chave}>{col.titulo}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {registros.map((item, i) => (
                <tr key={item.idRolo ?? i}>
                  {colunas.map((col) => (
                    <td key={col.chave}>{item[col.chave]}</td>
                  ))}
                </tr>
              ))}
              {Array.from({ length: linhasVazias }).map((_, i) => (
                <tr key={`vazia-${i}`} className="info__linha-vazia">
                  {colunas.map((col) => (
                    <td key={col.chave}>&nbsp;</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>



        {temMais && (
            <button type="button" className="info__mais" onClick={verMais} aria-label="Ver mais registros">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none"
                stroke="#f9f4ec" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
            </svg>
            </button>
        )}
      </main>

      <Footer />
    </div>
        
        
    );
}