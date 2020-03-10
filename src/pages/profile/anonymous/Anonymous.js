import { CenterView } from '../../../components/ui/containers/Containers';
import FacebookLogin from '../../../components/auth/login/FacebookLogin';
import React from 'react';

const Anonymous = ({ user }) => {
  return (
    <CenterView>
      <FacebookLogin convertUser />
    </CenterView>
  );
};

export default Anonymous;
