import {
  CenterView,
  SafeWrapper,
} from '../../components/ui/containers/Containers';

import { ActivityIndicator } from 'react-native';
import React from 'react';
import { withTheme } from 'react-native-elements';

const SplashScreen = ({ theme }) => {
  return (
    <SafeWrapper bg={theme.colors.lightShade}>
      <CenterView style={{ height: '100%' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </CenterView>
    </SafeWrapper>
  );
};

export default withTheme(SplashScreen);
