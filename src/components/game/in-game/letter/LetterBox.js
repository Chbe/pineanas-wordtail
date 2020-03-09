import React, {useEffect, useState} from 'react';
import AnimatedLetter from './letter-presentation/AnimatedLetter';
import styled from 'styled-components';
import {CenterView} from '../../../ui/containers/Containers';
import {useGameContext} from '../../../../stores/GameStore';
import ChoosenLetter from './letter-choice/AnimatedLetter';
import WordInput from '../word-input/WordInput';

const Wrapper = styled(CenterView)`
  border: 5px solid ${props => props.color};
  border-radius: 15px;
  width: 150;
  height: 150;
`;

const LetterBox = ({letters = [], theme, calling = false}) => {
  const [doAnimation, setDoAnimation] = useState(false);
  const [chooseLetter, setChooseLetter] = useState(true);
  const {state, actions} = useGameContext();
  let intervalHandler;
  let timeoutHandler;

  const startAnimation = () => {
    var letterIndex = 0;
    intervalHandler = setInterval(() => {
      animateLetter(letters[letterIndex]);
      setDoAnimation(false);
      letterIndex++;
      if (letterIndex >= letters.length) {
        clearInterval(intervalHandler);
        timeoutHandler = setTimeout(() => {
          actions.setLetter('');
          setChooseLetter(true);
          actions.enablePlay();
        }, 1200);
      }
    }, 1200);
  };

  const animateLetter = letter => {
    actions.setLetter(letter);
    setDoAnimation(true);
  };

  useEffect(() => {
    if (letters.length) {
      setChooseLetter(false);
      startAnimation();
    }
    return () => {
      // TODO: Why dafaq does this line make GamePage crash...?
      // actions.clear();
      if (intervalHandler) {
        clearInterval(intervalHandler);
      }
      if (timeoutHandler) {
        clearTimeout(timeoutHandler);
      }
    };
  }, [letters]);
  return calling && state.enablePlay ? (
    <WordInput letters={letters} />
  ) : (
    <Wrapper
      color={!chooseLetter ? theme.colors.darkShade : theme.colors.lightAccent}>
      {!chooseLetter ? (
        <AnimatedLetter
          theme={theme}
          letter={state.letter}
          doAnimation={doAnimation}
        />
      ) : (
        <ChoosenLetter theme={theme} letter={state.letter} />
      )}
    </Wrapper>
  );
};

export default LetterBox;
