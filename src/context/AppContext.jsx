import { createContext, useContext, useReducer, useEffect } from 'react';

const STORAGE_KEYS = {
  PRS: 'ironlog_prs',
  TODOS: 'ironlog_todos',
  CART: 'ironlog_cart',
  PROFILE: 'ironlog_profile',
};

const initialState = {
  prs: [],
  todos: [],
  cart: [],
  profile: {
    name: '',
    unit: 'kg',
  },
  isLoaded: false,
};

function loadFromStorage(key, defaultValue) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function appReducer(state, action) {
  let newState = { ...state };

  switch (action.type) {
    case 'SET_LOADED':
      return { ...state, isLoaded: action.payload };

    case 'SET_PROFILE':
      newState.profile = { ...state.profile, ...action.payload };
      saveToStorage(STORAGE_KEYS.PROFILE, newState.profile);
      return newState;

    case 'SET_PRS':
      newState.prs = action.payload;
      return newState;

    case 'ADD_PR':
      newState.prs = [action.payload, ...state.prs];
      saveToStorage(STORAGE_KEYS.PRS, newState.prs);
      return newState;

    case 'UPDATE_PR':
      newState.prs = state.prs.map(pr => pr.id === action.payload.id ? action.payload : pr);
      saveToStorage(STORAGE_KEYS.PRS, newState.prs);
      return newState;

    case 'DELETE_PR':
      newState.prs = state.prs.filter(pr => pr.id !== action.payload);
      saveToStorage(STORAGE_KEYS.PRS, newState.prs);
      return newState;

    case 'SET_TODOS':
      newState.todos = action.payload;
      return newState;

    case 'ADD_TODO':
      newState.todos = [action.payload, ...state.todos];
      saveToStorage(STORAGE_KEYS.TODOS, newState.todos);
      return newState;

    case 'UPDATE_TODO':
      newState.todos = state.todos.map(todo => todo.id === action.payload.id ? action.payload : todo);
      saveToStorage(STORAGE_KEYS.TODOS, newState.todos);
      return newState;

    case 'DELETE_TODO':
      newState.todos = state.todos.filter(todo => todo.id !== action.payload);
      saveToStorage(STORAGE_KEYS.TODOS, newState.todos);
      return newState;

    case 'TOGGLE_TODO':
      newState.todos = state.todos.map(todo => {
        if (todo.id !== action.payload) return todo;
        return {
          ...todo,
          completed: !todo.completed,
          completedAt: !todo.completed ? new Date().toISOString() : undefined,
        };
      });
      saveToStorage(STORAGE_KEYS.TODOS, newState.todos);
      return newState;

    case 'SET_CART':
      newState.cart = action.payload;
      return newState;

    case 'ADD_TO_CART': {
      const existingIndex = state.cart.findIndex(item => item.productId === action.payload.productId && item.variant === action.payload.variant);
      if (existingIndex >= 0) {
        newState.cart = state.cart.map((item, i) =>
          i === existingIndex ? { ...item, quantity: item.quantity + action.payload.quantity } : item
        );
      } else {
        newState.cart = [{ ...action.payload, id: generateId() }, ...state.cart];
      }
      saveToStorage(STORAGE_KEYS.CART, newState.cart);
      return newState;
    }

    case 'UPDATE_CART_QUANTITY':
      if (action.payload.quantity <= 0) {
        newState.cart = state.cart.filter(item => item.id !== action.payload.id);
      } else {
        newState.cart = state.cart.map(item =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        );
      }
      saveToStorage(STORAGE_KEYS.CART, newState.cart);
      return newState;

    case 'REMOVE_FROM_CART':
      newState.cart = state.cart.filter(item => item.id !== action.payload);
      saveToStorage(STORAGE_KEYS.CART, newState.cart);
      return newState;

    case 'CLEAR_CART':
      newState.cart = [];
      saveToStorage(STORAGE_KEYS.CART, []);
      return newState;

    case 'CLEAR_PRS':
      newState.prs = [];
      saveToStorage(STORAGE_KEYS.PRS, []);
      return newState;

    case 'CLEAR_TODOS':
      newState.todos = [];
      saveToStorage(STORAGE_KEYS.TODOS, []);
      return newState;

    case 'RESET_PROFILE':
      newState.profile = { name: '', unit: 'kg' };
      saveToStorage(STORAGE_KEYS.PROFILE, newState.profile);
      return newState;

    case 'RESET_ALL':
      newState.prs = [];
      newState.todos = [];
      newState.cart = [];
      newState.profile = { name: '', unit: 'kg' };
      Object.keys(STORAGE_KEYS).forEach(key => saveToStorage(STORAGE_KEYS[key], key === 'PROFILE' ? newState.profile : []));
      return newState;

    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const profile = loadFromStorage(STORAGE_KEYS.PROFILE, initialState.profile);
    const prs = loadFromStorage(STORAGE_KEYS.PRS, initialState.prs);
    const todos = loadFromStorage(STORAGE_KEYS.TODOS, initialState.todos);
    const cart = loadFromStorage(STORAGE_KEYS.CART, initialState.cart);

    dispatch({ type: 'SET_PROFILE', payload: profile });
    dispatch({ type: 'SET_PRS', payload: prs });
    dispatch({ type: 'SET_TODOS', payload: todos });
    dispatch({ type: 'SET_CART', payload: cart });
    dispatch({ type: 'SET_LOADED', payload: true });
  }, []);

  const addPR = (pr) => {
    dispatch({
      type: 'ADD_PR',
      payload: { ...pr, id: generateId(), createdAt: new Date().toISOString() }
    });
  };

  const updatePR = (pr) => dispatch({ type: 'UPDATE_PR', payload: pr });
  const deletePR = (id) => dispatch({ type: 'DELETE_PR', payload: id });

  const getPRsByLift = (lift) =>
    state.prs.filter(pr => pr.lift === lift).sort((a, b) => b.weight - a.weight);

  const getBestPR = (lift) => {
    const lifts = getPRsByLift(lift);
    return lifts.length > 0 ? lifts[0] : null;
  };

  const getTotalWeight = () => {
    const bigThree = ['squat', 'bench', 'deadlift'];
    return bigThree.reduce((total, lift) => {
      const best = getBestPR(lift);
      return total + (best?.weight || 0);
    }, 0);
  };

  const getWilksScore = () => {
    const { bodyweight, gender } = state.profile;
    if (!bodyweight || bodyweight <= 0) return 0;
    const total = getTotalWeight();
    if (total <= 0) return 0;

    const a = gender === 'female' ? 594.31747775582 : -216.0475144;
    const b = gender === 'female' ? -27.23842536447 : 16.2606339;
    const c = gender === 'female' ? 0.82112226871 : -0.002388645;
    const d = gender === 'female' ? -0.00930733913 : -0.00113732;
    const e = gender === 'female' ? 4.731582e-5 : 7.01863e-6;
    const f = gender === 'female' ? -9.054e-8 : -1.291e-8;

    const bw = state.profile.unit === 'lbs' ? bodyweight * 0.453592 : bodyweight;
    const coefficient = 500 / (a + b * bw + c * bw ** 2 + d * bw ** 3 + e * bw ** 4 + f * bw ** 5);
    return Math.round(total * coefficient * 100) / 100;
  };

  const addTodo = (todo) => {
    dispatch({
      type: 'ADD_TODO',
      payload: { ...todo, id: generateId(), createdAt: new Date().toISOString() }
    });
  };

  const updateTodo = (todo) => dispatch({ type: 'UPDATE_TODO', payload: todo });
  const deleteTodo = (id) => dispatch({ type: 'DELETE_TODO', payload: id });
  const toggleTodo = (id) => dispatch({ type: 'TOGGLE_TODO', payload: id });

  const getTodosByCategory = (category) =>
    state.todos.filter(todo => todo.category === category);

  const getActiveTodos = () => state.todos.filter(t => !t.completed);
  const getCompletedTodos = () => state.todos.filter(t => t.completed);

  const addToCart = (item) => dispatch({ type: 'ADD_TO_CART', payload: item });
  const updateCartQuantity = (id, quantity) => dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id, quantity } });
  const removeFromCart = (id) => dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const getCartTotal = () => state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const getCartCount = () => state.cart.reduce((sum, item) => sum + item.quantity, 0);

  const updateProfile = (profile) => dispatch({ type: 'SET_PROFILE', payload: profile });
  const clearPRs = () => dispatch({ type: 'CLEAR_PRS' });
  const clearTodos = () => dispatch({ type: 'CLEAR_TODOS' });
  const resetProfile = () => dispatch({ type: 'RESET_PROFILE' });
  const resetAll = () => dispatch({ type: 'RESET_ALL' });

  return (
    <AppContext.Provider value={{
      ...state,
      addPR,
      updatePR,
      deletePR,
      getPRsByLift,
      getBestPR,
      getTotalWeight,
      getWilksScore,
      addTodo,
      updateTodo,
      deleteTodo,
      toggleTodo,
      getTodosByCategory,
      getActiveTodos,
      getCompletedTodos,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      getCartTotal,
      getCartCount,
      updateProfile,
      clearPRs,
      clearTodos,
      resetProfile,
      resetAll,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}