import React, { createContext, useContext, useReducer } from 'react';
import { Madhab, HeirEntry } from '../engine/types';

interface State {
  total: number; funeral: number; debts: number; will: number;
  madhab: Madhab;
  heirs: HeirEntry[];
}
const initialState: State = { total: 0, funeral: 0, debts: 0, will: 0, madhab: 'hanafi', heirs: [] };

type Action =
  | { type: 'SET_ESTATE'; payload: { total: number; funeral: number; debts: number; will: number } }
  | { type: 'SET_MADHAB'; payload: Madhab }
  | { type: 'SET_HEIRS'; payload: HeirEntry[] }
  | { type: 'RESET' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_ESTATE': return { ...state, ...action.payload };
    case 'SET_MADHAB': return { ...state, madhab: action.payload };
    case 'SET_HEIRS': return { ...state, heirs: action.payload };
    case 'RESET': return initialState;
    default: return state;
  }
}

const CalcContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | null>(null);

export const CalcProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <CalcContext.Provider value={{ state, dispatch }}>{children}</CalcContext.Provider>;
};

export const useCalc = () => {
  const ctx = useContext(CalcContext);
  if (!ctx) throw new Error('Missing CalcProvider');
  return ctx;
};
