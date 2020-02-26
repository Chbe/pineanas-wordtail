import { useState, useContext, useMemo, createContext } from "react";

const initialState = {
  letter: "",
  completeWord: "",
  enablePlay: false,
  timesup: false
};

const GameContext = createContext({});
/**
 * Our custom React hook to manage state
 */

const GameStore = () => {
  // Manage the state using React.useState()
  const [state, setState] = useState(initialState);

  // Build our actions. We'll use useMemo() as an optimization,
  // so this will only ever be called once.
  const actions = useMemo(() => getActions(setState), [setState]);

  return { state, actions };
};

// Define your actions as functions that call setState().
// It's a bit like Redux's dispatch(), but as individual
// functions.
const getActions = setState => ({
  clear: () => {
    setState({ ...state, initialState });
  },
  setLetter: payload => {
    setState(state => ({ ...state, letter: payload }));
  },
  setCompleteWord: payload => {
    setState(state => ({ ...state, completeWord: payload }));
  },
  enablePlay: () => {
    setState(state => ({ ...state, enablePlay: true }));
  },
  disablePlay: () => {
    setState(state => ({ ...state, enablePlay: false }));
  },
  setTimesup: () => {
    setState(state => ({ ...state, timesup: true }));
  }
});

const useGameContext = () => {
  return useContext(GameContext);
};

export { GameContext, GameStore, useGameContext };
