import React, { useEffect, useState } from "react";
import { SectionList, View } from "react-native";
import firebase from "@react-native-firebase/app";
import { ListItem, Text, withTheme } from "react-native-elements";
import SectionHeader from "./SectionHeader";
import SectionSubtitle from "./SectionSubtitle";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import NoGames from "../no-game/NoGames";
import InviteModal from "../invite/InviteModal";
import Modal from "react-native-modal";

const GamesList = ({ navigation, uid, theme }) => {
  const [games, setGames] = useState([]);
  const [modalIsVisable, setModalVisable] = useState(false);

  const onCollectionUpdate = querySnapshot => {
    const tempGames = [];
    if (querySnapshot) {
      querySnapshot.forEach(doc => {
        const game = doc.data();

        tempGames.push({
          key: doc.id,
          ...game
        });
      });
    }
    setGames(tempGames);
  };
  useEffect(() => {
    let sub;
    if (uid) {
      const ref = firebase
        .firestore()
        .collection("games")
        .where("playersUid", "array-contains", uid)
        .orderBy("status", "asc")
        .orderBy("lastUpdated", "desc");
      // .limit(5); TODO
      sub = ref.onSnapshot(onCollectionUpdate);
    }
    return () => {
      if (sub) {
        sub();
      }
    };
  }, [uid]);

  const invites = () => {
    return games.filter(
      game =>
        game.status !== "completed" &&
        game.players.find(p => p.uid === uid && p.accepted === false)
    );
  };
  const active = () => {
    return games.filter(
      game =>
        game.status !== "completed" &&
        game.players.find(p => p.uid === uid && p.accepted === true)
    );
  };
  const finished = () => {
    return games.filter(game => game.status === "completed");
  };

  const goToGame = item => {
    if (
      item.status === "pending" &&
      item.players.find(p => p.uid === uid && p.accepted === false)
    ) {
      setModalVisable(true);
    } else if (item.status === "active" && item.activePlayer === uid) {
      navigation.navigate("Game", {
        game: item,
        uid: uid
      });
    } else if (item.status === "calling" && item.activePlayer === uid) {
      navigation.navigate("Game", {
        game: item,
        uid: uid,
        calling: true
      });
    }
  };

  const renderSections = () => {
    let sections = [];
    const invitesArr = invites();
    const activeArr = active();
    const finishedArr = finished();

    if (invitesArr.length) {
      sections.push({ type: "invite", data: invitesArr });
    }
    if (activeArr.length) {
      sections.push({ type: "active", data: activeArr });
    }
    if (finishedArr.length) {
      sections.push({ type: "finished", data: finishedArr });
    }
    // if (!invitesArr.length && !activeArr.length && !finishedArr.length) {
    //     sections.push({ type: 'no-games', data: [] });
    // }

    return sections;
  };

  return (
    <View>
      {games.length ? (
        <SectionList
          sections={renderSections()}
          renderItem={({ item }) =>
            !!item.title.length ? (
              <ListItem
                style={{ borderRadius: 5 }}
                containerStyle={{
                  borderRadius: 5
                  // marginBottom: 10
                }}
                titleStyle={{
                  color: theme.colors.darkShade,
                  fontWeight: "bold"
                }}
                title={item.title}
                subtitle={<SectionSubtitle item={item} theme={theme} />}
                bottomDivider
                chevron={
                  <FontAwesome5Icon
                    name="arrow-right"
                    size={15}
                    color={theme.colors.lightAccent}
                  />
                }
                leftAvatar={{
                  source:
                    item.status === "active" || item.status === "calling"
                      ? {
                          uri: item.players.find(
                            p => p.uid === item.activePlayer
                          ).photoURL
                        }
                      : null,
                  title: item.title[0]
                }}
                onPress={() => {
                  // TODO: save game state so game page can
                  goToGame(item);
                }}
              />
            ) : (
              <Text>Hej</Text>
            )
          }
          renderSectionHeader={({ section }) =>
            section.data.length ? <SectionHeader section={section} /> : null
          }
          keyExtractor={(item, index) => index}
        />
      ) : (
        <NoGames navigation={navigation} theme={theme} />
      )}
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
        <InviteModal theme={theme} />
      </Modal>
    </View>
  );
};

export default withTheme(GamesList);
