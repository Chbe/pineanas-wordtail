import { Button } from 'react-native-elements';
import { CenterView } from '../../ui/containers/Containers';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import React from 'react';

const NoGames = ({ navigation, theme }) => {
  return (
    <CenterView style={{ height: '100%' }}>
      <Button
        title="NEW GAME"
        icon={
          <FontAwesome5
            color={theme.barStyle === 'light-content' ? '#fff' : '#000'}
            size={16}
            style={{ marginRight: 5 }}
            name={'plus-circle'}
          />
        }
        onPress={() => navigation.navigate('CreateGame')}
      />
    </CenterView>
  );
};

export default NoGames;
