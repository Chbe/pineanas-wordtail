import { useState, useContext, useMemo, createContext } from "react";

const initialState = {
  title: "",
  status: "pending",
  activePlayer: "",
  admin: "",
  lastUpdated: 0,
  playersUid: [],
  players: []
};

const CreateGameContext = createContext({});
/**
 * Our custom React hook to manage state
 */

const CreateGameStore = () => {
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
    setState(state => ({ ...state, ...initialState }));
  },
  setTitle: payload => {
    setState(state => ({ ...state, title: payload }));
  },
  setAdmin: payload => {
    setState(state => ({ ...state, admin: payload }));
  },
  setPlayers: payload => {
    setState(state => ({
      ...state,
      players: payload,
      playersUid: payload.map(p => p.uid)
    }));
  }
});

const useCreateGameContext = () => {
  return useContext(CreateGameContext);
};

export { CreateGameContext, CreateGameStore, useCreateGameContext };
