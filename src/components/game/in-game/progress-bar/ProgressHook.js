import {Animated, Easing} from 'react-native';
import {useState, useEffect} from 'react';

export const useAnimation = ({enablePlay, endWidth, duration = 25000}) => {
  const [animation] = useState(new Animated.Value(0));
  useEffect(() => {
    if (enablePlay) {
      Animated.timing(animation, {
        duration,
        toValue: endWidth,
        easing: Easing.linear,
      }).start();
    } else {
      if (animation) {
        animation.stopAnimation();
      }
    }
    return () => animation.stopAnimation();
  }, [enablePlay]);

  return animation;
};
