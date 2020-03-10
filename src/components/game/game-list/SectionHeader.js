import { Text, withTheme } from 'react-native-elements';

import Icon from 'react-native-vector-icons/FontAwesome5';
import { PaddingView } from '../../ui/containers/Containers';
import React from 'react';
import styled from 'styled-components';

const SectionView = styled(PaddingView)`
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 10px;
`;
// background-color: ${props => props.bg};

const SectionIcon = styled(Icon)`
  margin-right: 10px;
`;

const ColoredText = styled(Text)`
  color: ${props => props.textColor};
  font-weight: bold;
`;

const SectionHeader = ({ section: { type, data }, theme }) => {
  const textColor = theme.barStyle === 'light-content' ? '#fff' : '#000';
  const length = data.length;
  if (type === 'invite')
    return (
      <SectionView>
        <SectionIcon
          color={theme.colors.darkShade}
          size={24}
          name={'envelope'}
          regular
        />
        <ColoredText textColor={theme.colors.darkShade}>
          {length === 1 ? 'New invite' : 'New invites'}
        </ColoredText>
      </SectionView>
    );
  else if (type === 'active')
    return (
      <SectionView bg={theme.colors.lightShade}>
        <SectionIcon
          color={theme.colors.darkShade}
          size={24}
          name={'gamepad'}
          regular
        />
        <ColoredText textColor={theme.colors.darkShade}>
          Active or pending
        </ColoredText>
      </SectionView>
    );
  else if (type === 'finished')
    return (
      <SectionView>
        <SectionIcon
          color={theme.colors.darkShade}
          size={24}
          name={'flag-checkered'}
          regular
        />
        <ColoredText textColor={theme.colors.darkShade}>Finished</ColoredText>
      </SectionView>
    );
};

export default withTheme(SectionHeader);
