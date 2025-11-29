import { useContext } from 'react';
import { AppContext } from './core';

export function useApp() {
  return useContext(AppContext);
}

export default useApp;
