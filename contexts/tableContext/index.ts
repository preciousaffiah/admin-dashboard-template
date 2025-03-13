// Create a context to share the [number] value
import { createContext, useContext } from 'react';

export const TableContext = createContext<string | null>(null);

export const useTable = () => useContext(TableContext);