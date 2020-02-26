import React from 'react';
import styled from 'styled-components';
import {View} from 'react-native';

const CustomButton = ({title, color, onPress, textColor, disabled, icon}) => {
  return (
    <ButtonContainer
      color={color}
      disabled={disabled}
      activeOpacity={0.85}
      disabledColor={`${color}-disabled`}
      onPress={() => (onPress ? onPress() : null)}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          width: '100%',
        }}>
        {/* {icon && <View style={{ marginRight: 10 }}>
                    <FontAwesomeIcon icon={icon} color={textColor} size={18} />
                </View>} */}

        <ButtonText textColor={textColor}>{title}</ButtonText>
      </View>
    </ButtonContainer>
  );
};

export default CustomButton;

const ButtonContainer = styled.TouchableOpacity`
  justify-content: center;
  flex-direction: row;
  padding: ${props => props.theme.padding};
  border-radius: ${props => props.theme.borderRadius};
  background-color: ${props =>
    !props.disabled
      ? props.theme.colors[props.color]
      : props.theme.colors[props.color + '-disabled']};
`;

const ButtonText = styled.Text`
  font-size: ${props => props.theme.fontSize};
  color: ${props => props.textColor};
  text-align: center;
`;
