import React, { createRef, useEffect } from 'react';

import { Input } from 'react-native-elements';
import { useGameContext } from '../../../../stores/GameStore';

const WordInput = ({ letters = '' }) => {
  const { state, actions } = useGameContext();
  const input = createRef();
  let timeoutHandler;

  useEffect(() => {
    if (state.enablePlay) {
      input.current.focus();
      //   timeoutHandler = setTimeout(() => {
      //     input.current.shake();
      //   }, 300);
    }
    return () => {
      if (timeoutHandler) {
        clearTimeout(timeoutHandler);
      }
    };
  }, [state.enablePlay]);
  return (
    <Input
      ref={input}
      autoCapitalize="characters"
      autoCompleteType="off"
      autoCorrect={false}
      enablesReturnKeyAutomatically={true}
      placeholder={`${letters.join('')}...`}
      onChangeText={text => actions.setCompleteWord(text.toUpperCase())}
    />
  );
};

export default WordInput;
