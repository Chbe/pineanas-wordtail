import Key from './Key';
import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import { withTheme } from 'react-native-elements';

const Row = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const lettersArr = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

const Keyboard = ({ theme }) => {
  return (
    <View>
      {lettersArr.map((row, i) => {
        return (
          <Row key={i}>
            {row.map(key => {
              return <Key key={key} name={key} theme={theme} />;
            })}
          </Row>
        );
      })}
    </View>
  );
};

export default withTheme(Keyboard);
