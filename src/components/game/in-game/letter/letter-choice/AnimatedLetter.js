import React from 'react';
import {Animated} from 'react-native';
import {useAnimation} from './AnimatedHook';

const ChoosenLetter = ({letter, theme}) => {
  const animation = useAnimation({letter});
  return (
    <Animated.Text
      style={{
        color: theme.colors.lightAccent,
        opacity: animation,
        fontSize: 100,
      }}>
      {letter}
    </Animated.Text>
  );
};

export default ChoosenLetter;
