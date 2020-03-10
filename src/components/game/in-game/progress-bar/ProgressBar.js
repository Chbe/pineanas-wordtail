import React, { useEffect, useState } from 'react';

import { Animated } from 'react-native';
import { PaddingView } from '../../../ui/containers/Containers';
import styled from 'styled-components';
import { useAnimation } from './ProgressHook';
import { useGameContext } from '../../../../stores/GameStore';

const Container = styled.View`
  height: 30px;
  width: 100%;
  background-color: ${props =>
    props.gameStarted
      ? props.theme.colors[props.progressColor]
      : 'transparent'};
`;

const ProgressBar = ({ enablePlay, duration = 5000, theme }) => {
  const { actions } = useGameContext();

  const [endWidth, setWidth] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const animation = useAnimation({ enablePlay, endWidth, duration });

  const [progressColor, updateColor] = useState('success');

  const manageColors = ({ value }) => {
    if (value > endWidth / 2 && value < endWidth * 0.85) {
      updateColor(() => 'warning');
    } else if (value >= endWidth * 0.85) {
      updateColor(() => 'danger');
    }

    if (value === endWidth) {
      actions.setTimesup();
    }
  };

  useEffect(() => {
    if (enablePlay) {
      animation.addListener(manageColors);
      setGameStarted(true);
    } else {
      if (animation) {
        animation.removeAllListeners();
      }
    }
    return () => animation.removeAllListeners();
  }, [enablePlay]);

  return (
    <PaddingView style={{ width: '100%' }}>
      <Container
        gameStarted={gameStarted}
        theme={theme}
        progressColor={progressColor}
        onLayout={event => {
          const { width } = event.nativeEvent.layout;
          setWidth(width);
        }}>
        <Animated.View
          style={{
            width: animation.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
            height: 30,
            backgroundColor: theme.colors.lightShade,
            transform: [{ translateX: animation }],
          }}
        />
      </Container>
    </PaddingView>
  );
};

export default ProgressBar;
