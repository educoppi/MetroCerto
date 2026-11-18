import { createContext, useContext } from 'react';

export const TecidosContext = createContext(null);

export const useTecidos = () => useContext(TecidosContext);
