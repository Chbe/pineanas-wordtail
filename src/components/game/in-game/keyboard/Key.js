import React from 'react';
import styled from 'styled-components';
import { useGameContext } from '../../../../stores/GameStore';

const KeyContainer = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  height: 35px;
  width: 35px;
  margin: 1px;
`;

const KeyText = styled.Text`
  font-size: 30px;
  color: ${({ enablePlay, colors }) =>
    enablePlay ? colors.lightAccent : colors.darkShade};
`;

const Key = ({ name, theme }) => {
  const { state, actions } = useGameContext();
  return (
    <KeyContainer
      disabled={!state.enablePlay}
      onPress={() => {
        state.enablePlay && actions.setLetter(name);
      }}>
      <KeyText colors={theme.colors} enablePlay={state.enablePlay}>
        {name}
      </KeyText>
    </KeyContainer>
  );
};

export default Key;
