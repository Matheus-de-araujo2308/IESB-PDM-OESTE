import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@expenses';
const THEME_KEY = '@theme';
const ExpensesContext = createContext();

function expensesReducer(state, action) {
  switch (action.type) {
    case 'SET':
      return action.payload;
    case 'ADD':
      return [action.payload, ...state];
    case 'UPDATE':
      return state.map((item) =>
        item.id === action.payload.id ? { ...item, ...action.payload.data } : item
      );
    case 'DELETE':
      return state.filter((item) => item.id !== action.payload);
    default:
      return state;
  }
}

export function ExpensesContextProvider({ children }) {
  const systemColorScheme = useColorScheme();
  const [expenses, dispatch] = useReducer(expensesReducer, []);
  const [isLoaded, setIsLoaded] = useState(false);
  const [themeMode, setThemeMode] = useState(systemColorScheme || 'light');

  useEffect(() => {
    async function loadData() {
      try {
        const storedExpenses = await AsyncStorage.getItem(STORAGE_KEY);
        const storedTheme = await AsyncStorage.getItem(THEME_KEY);

        if (storedExpenses) dispatch({ type: 'SET', payload: JSON.parse(storedExpenses) });
        if (storedTheme) setThemeMode(storedTheme);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoaded(true);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(expenses)).catch(console.error);
    }
  }, [expenses, isLoaded]);

  function toggleTheme() {
    const newTheme = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newTheme);
    AsyncStorage.setItem(THEME_KEY, newTheme).catch(console.error);
  }

  function addExpense(expenseData) {
    const newExpense = { id: Date.now().toString(), ...expenseData };
    dispatch({ type: 'ADD', payload: newExpense });
  }

  function updateExpense(id, expenseData) {
    dispatch({ type: 'UPDATE', payload: { id, data: expenseData } });
  }

  function deleteExpense(id) {
    dispatch({ type: 'DELETE', payload: id });
  }

  function clearExpenses() {
    dispatch({ type: 'SET', payload: [] });
  }

  return (
    <ExpensesContext.Provider
      value={{
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        clearExpenses,
        themeMode,
        toggleTheme,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error('useExpenses deve ser usado dentro de um ExpensesContextProvider');
  }
  return context;
}