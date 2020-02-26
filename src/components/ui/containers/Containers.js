import styled from "styled-components/native";

export const SafeWrapper = styled.SafeAreaView`
  flex: 1;
  background-color: ${props => props.bg};
`;
export const CenterView = styled.View`
  justify-content: center;
  align-items: center;
`;

export const PaddingView = styled.View`
  padding: ${({ padding }) => (padding ? padding : 10)}px;
`;
