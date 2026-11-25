# MetroCerto

Sistema de controle de estoque de tecidos em rolo, feito para a **MAITÊ Decorações**. Um equipamento físico mede automaticamente quantos metros de tecido são retirados de cada rolo e envia essa informação para o servidor, que desconta do saldo. Pela aplicação web é possível acompanhar o estoque, ver o histórico de retiradas e cadastrar novos tecidos.

O projeto tem três partes:

| Parte | Tecnologia | Pasta |
|---|---|---|
| **Frontend** | React 19 + Vite + React Router | raiz do repositório (`src/`) |
| **Backend** | Java 21 + Spring Boot 4 + JPA + MySQL | `backend/` |
| **Hardware** | Arduino UNO + driver de motor + motor + ESP32 | (equipamento físico) |

## Como funciona

```
 ┌──────────────────────── Hardware ────────────────────────┐
 │                                                          │
 │  Motor ◄── Driver ◄── Arduino UNO ──serial──► ESP32 ─────┼──WiFi──┐
 │  (gira o rolo)  (dá força)  (mede)              (comunica)│        │
 └──────────────────────────────────────────────────────────┘        │
                                                                      ▼
                     GET /registros/hardware?id=1&metro=1.25   ┌─────────────┐
                                                               │   Backend   │◄──► MySQL
                     Frontend (React) ◄────── REST/JSON ──────►│ Spring Boot │
                                                               └─────────────┘
```

1. O operador puxa o tecido; o **motor** gira o rolo de forma controlada.
2. O **Arduino** conta o movimento e converte em metros.
3. O **ESP32** recebe a metragem pela serial e chama a API do backend pelo WiFi.
4. O **backend** grava a retirada (registro) e desconta do saldo do tecido.
5. O **frontend** mostra o saldo atualizado, o histórico e os alertas de estoque mínimo.

## Hardware

O hardware tem quatro peças, cada uma com uma função clara:

- **Arduino UNO**: o cérebro da medição. Comanda o motor e conta quanto tecido passou, convertendo o movimento em metros.
- **Driver do motor**: o Arduino não tem força para alimentar um motor sozinho. O driver recebe os sinais fracos do Arduino e entrega ao motor a corrente de que ele precisa, com segurança.
- **Motor**: a parte mecânica. Gira o rolo e puxa o tecido de forma controlada, o que garante que a medida seja precisa.
- **ESP32**: a ponte com a internet. Recebe a metragem do Arduino pela serial, conecta ao WiFi e envia a retirada para o servidor.

> Resumindo: o Arduino **mede**, o driver **dá força**, o motor **movimenta** e o ESP32 **comunica**.

### Integração com o backend

O ESP32 envia cada retirada com uma requisição `GET` simples:

```
GET http://<servidor>:8080/registros/hardware?id=1&metro=1.25
```

| Parâmetro | Obrigatório | Descrição |
|---|---|---|
| `metro` | sim | Metros retirados (maior que zero) |
| `id` | não | Id do tecido/rolo. Se omitido, usa o tecido `1` |

A retirada é sempre registrada no usuário `1` (o hardware não identifica usuário). A resposta é `200 OK` com o registro criado, que é o que o firmware interpreta como sucesso. Por isso o banco precisa ter o usuário `1` e o tecido `1`, criados pelo arquivo [inserts_metrocerto.txt](inserts_metrocerto.txt).

## Frontend

Página única com rolagem por seções (o menu acompanha a seção visível):

- **Início**: apresentação da MAITÊ Decorações.
- **Estoque**: rolos cadastrados com saldo atual; clique em um rolo para ver o detalhe e suas retiradas.
- **Info**: histórico de retiradas com busca e ordenação por data, rolo, estampa ou metragem.
- **Acompanhamento**: saldo de cada rolo em relação ao estoque mínimo.
- **Cadastro**: cadastro de novos tecidos com nome, estampa (imagem), saldo e estoque mínimo.

A comunicação com a API fica em [src/data/api.js](src/data/api.js). A URL do backend vem da variável `VITE_API_URL` (padrão `http://localhost:8080`).

## Backend

API REST em Spring Boot com três entidades:

- **Usuario**: `id`, `nome`, `senha`
- **Tecido**: `id`, `nome`, `estampa` (imagem em `MEDIUMBLOB`), `saldoAtual`, `estoqueMin`
- **Registro** (retirada): `id`, `usuario`, `tecido`, `metroMovimentado`, `dataHora`

Criar, alterar ou excluir um registro ajusta automaticamente o saldo do tecido. As tabelas são criadas pelo Hibernate ao subir (`ddl-auto=update`).

### Endpoints

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/tecidos` | Lista os tecidos |
| `GET` | `/tecidos/{id}` | Busca um tecido |
| `GET` | `/tecidos/{id}/estampa` | Imagem da estampa (pode ser usada direto em `<img src>`) |
| `GET` | `/tecidos/{id}/registros` | Retiradas de um rolo |
| `POST` | `/tecidos` | Cria um tecido (estampa em base64) |
| `PUT` | `/tecidos/{id}` | Atualiza um tecido (sem estampa, mantém a atual) |
| `DELETE` | `/tecidos/{id}` | Remove um tecido |
| `GET` | `/registros` | Lista as retiradas (aceita `?de=AAAA-MM-DD&ate=AAAA-MM-DD`) |
| `GET` | `/registros/{id}` | Busca uma retirada |
| `GET` | `/registros/hardware?id=&metro=` | Retirada enviada pelo ESP32 |
| `POST` | `/registros` | Cria uma retirada (`idUsuario`, `idTecido`, `metroMovimentado`) |
| `PUT` | `/registros/{id}` | Atualiza uma retirada |
| `DELETE` | `/registros/{id}` | Remove uma retirada (devolve a metragem ao saldo) |
| `GET/POST/PUT/DELETE` | `/usuarios`, `/usuarios/{id}` | CRUD de usuários |

O CORS libera `http://localhost:*` e `http://127.0.0.1:*`.

## Como rodar

### Opção 1: Docker (recomendado)

Pré-requisito: [Docker](https://www.docker.com/) com Docker Compose.

```powershell
docker compose up --build
```

Isso sobe três containers:

| Serviço | Endereço |
|---|---|
| Frontend (Nginx) | http://localhost:5173 |
| Backend | http://localhost:8080 |
| MySQL 8.4 | `localhost:3307` (usuário `root`, senha `123456`) |

Depois que o backend subir pela primeira vez (e criar as tabelas), carregue os dados iniciais (usuário `1` e tecido `1`, usados pelo hardware):

```powershell
docker compose exec db sh -c "mysql -uroot -p123456 < /inserts.sql"
```

Os dados ficam no volume `db_data`. Para apagar tudo e recomeçar: `docker compose down -v`.

### Opção 2: Localmente

Pré-requisitos: Node.js 22+, JDK 21 e MySQL rodando em `localhost:3306` (usuário `root`, senha `123456`; ajuste em [application.properties](backend/src/main/resources/application.properties) se precisar).

Backend:

```powershell
cd backend; .\mvnw.cmd spring-boot:run
```

Frontend (em outro terminal, na raiz do repositório):

```powershell
npm install
```

```powershell
npm run dev
```

O frontend abre em http://localhost:5173. Para apontar para outro backend, crie um `.env` na raiz com `VITE_API_URL=http://endereco:8080`.

Para carregar os dados iniciais, execute o conteúdo de [inserts_metrocerto.txt](inserts_metrocerto.txt) no MySQL depois que o backend criar as tabelas.

## Estrutura do repositório

```
MetroCerto/
├── backend/                 API Spring Boot
│   └── src/main/java/com/metroCerto/
│       ├── controllers/     Rotas REST
│       ├── services/        Regras de negócio (saldo, validações)
│       ├── model/           Entidades JPA
│       ├── dtos/            Objetos de entrada e saída
│       ├── repositories/    Acesso ao banco
│       └── config/          CORS
├── src/                     Frontend React
│   ├── screens/             Seções da página
│   ├── components/          Componentes reutilizáveis
│   └── data/                Comunicação com a API e estado global
├── docker-compose.yml       MySQL + backend + frontend
├── Dockerfile               Build do frontend (Node → Nginx)
├── nginx.conf               Servidor do frontend em produção
└── inserts_metrocerto.txt   Dados iniciais (usuário e tecido 1)
```
