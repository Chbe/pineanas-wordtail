import React from "react";
import { CenterView } from "../../../components/ui/containers/Containers";
import FacebookLogin from "../../../components/auth/login/FacebookLogin";

const Anonymous = ({ user }) => {
  return (
    <CenterView>
      <FacebookLogin convertUser />
    </CenterView>
  );
};

export default Anonymous;
