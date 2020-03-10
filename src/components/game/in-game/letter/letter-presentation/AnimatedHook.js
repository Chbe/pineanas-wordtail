import { useEffect, useState } from 'react';

import { Animated } from 'react-native';

export const useAnimation = ({ doAnimation }) => {
  const [animation, setAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.sequence([
      Animated.timing(animation, { toValue: 1, duration: 500 }),
      Animated.timing(animation, { toValue: 0, duration: 700 }),
    ]).start();
    return () => animation.stopAnimation();
  }, [doAnimation]);

  return animation;
};
