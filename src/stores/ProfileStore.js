import { createContext, useContext, useMemo, useState } from 'react';

const initialState = {
  username: '',
  photoURL: '',
  displayName: '',
  email: '',
};

const ProfileContext = createContext({});
/**
 * Our custom React hook to manage state
 */

const ProfileStore = () => {
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
    console.log('clear');
    setState(state => ({ ...state, initialState }));
  },
  setUsername: payload => {
    setState(state => ({ ...state, username: payload }));
  },
  setPhotoUrl: payload => {
    console.log('setPhptoUrl');
    setState(state => ({ ...state, photoURL: payload }));
  },
  setDisplayName: payload => {
    setState(state => ({ ...state, displayName: payload }));
  },
  setEmail: payload => {
    setState(state => ({ ...state, email: payload }));
  },
});

const useProfileContext = () => {
  return useContext(ProfileContext);
};

export { ProfileContext, ProfileStore, useProfileContext };
