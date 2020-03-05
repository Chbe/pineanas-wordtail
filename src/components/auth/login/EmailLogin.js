import React, { useState } from "react";
import { emailLogin } from "../AuthFunctions";
import { Button } from "react-native-elements";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import Modal from "react-native-modal";
import EmailModal from "./EmailModal";

const EmailLogin = ({ theme }) => {
  const [modalIsVisable, setModalVisable] = useState(false);

  return (
    <>
      <Button
        icon={
          <FontAwesome5Icon
            style={{ marginRight: 10 }}
            color={"white"}
            size={24}
            name="envelope"
          />
        }
        onPress={() => setModalVisable(true)}
        buttonStyle={{ backgroundColor: "#ff8c0f" }}
        title={`Continue with email`}
      />
      <Modal
        isVisible={modalIsVisable}
        backdropColor={theme.colors.primary}
        backdropOpacity={0.8}
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        onBackdropPress={() => setModalVisable(false)}
        onSwipeComplete={() => setModalVisable(false)}
        swipeDirection={["left", "right"]}
      >
        <EmailModal theme={theme} />
      </Modal>
    </>
  );
};

export default EmailLogin;
