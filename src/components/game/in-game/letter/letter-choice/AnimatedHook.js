import {Animated} from 'react-native';
import {useState, useEffect} from 'react';

export const useAnimation = ({letter}) => {
  const [animation] = useState(new Animated.Value(0));
  useEffect(() => {
    Animated.timing(animation, {toValue: 1, duration: 2000}).start();
    return () => animation.stopAnimation();
  }, [letter]);

  return animation;
};
