import { Animated } from 'react-native';
import React from 'react';
import { useAnimation } from './AnimatedHook';

const AnimatedLetter = ({ letter, doAnimation, theme }) => {
  const animation = useAnimation({ doAnimation });
  return (
    <Animated.Text
      style={{
        color: theme.colors.darkShade,
        opacity: animation,
        fontSize: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 100],
        }),
      }}>
      {letter}
    </Animated.Text>
  );
};

export default AnimatedLetter;
