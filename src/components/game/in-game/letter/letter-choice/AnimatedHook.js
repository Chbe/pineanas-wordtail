import { useEffect, useState } from 'react';

import { Animated } from 'react-native';

export const useAnimation = ({ letter }) => {
  const [animation] = useState(new Animated.Value(0));
  useEffect(() => {
    Animated.timing(animation, { toValue: 1, duration: 2000 }).start();
    return () => animation.stopAnimation();
  }, [letter]);

  return animation;
};
