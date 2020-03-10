import { Alert, View } from 'react-native';
import { Button, Icon, Text, withTheme } from 'react-native-elements';
import {
  CenterView,
  SafeWrapper,
} from '../../components/ui/containers/Containers';
import { GameContext, GameStore, useGameContext } from '../../stores/GameStore';
import React, { useEffect, useState } from 'react';
import { alphabet, maxMarks } from '../../const/Const';
import {
  getClosestActivePlayer,
  getDisplayNameByUid,
  getWordDetails,
} from '../../services/game/GameService';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Keyboard from '../../components/game/in-game/keyboard/Keyboard';
import LetterBox from '../../components/game/in-game/letter/LetterBox';
import Modal from 'react-native-modal';
import ProgressBar from '../../components/game/in-game/progress-bar/ProgressBar';
import Spinner from '../../components/ui/controls/spinner/Spinner';
import { saveDocument } from '../../services/firebase/firestore/FBFirestoreService';
import styled from 'styled-components';

const Wrapper = styled(CenterView)`
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
`;

const ActionsWrapper = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-around;
`;

const ModalContainer = styled(CenterView)`
  background-color: #fff;
  padding: 22px;
  border-radius: 4;
  border-color: rgba(0, 0, 0, 0.1);
`;

const GamePage = ({ route, navigation, theme }) => {
  const { state, actions } = GameStore();
  const [game, setGame] = useState({});
  const [currentUid, setUid] = useState('');
  const [calling, setCalling] = useState(false);

  const [spinnerIsVisable, setSpinnerVisable] = useState(false);
  const [modalIsVisable, setModalVisable] = useState(false);
  const [modalData, setModalData] = useState({});

  const determineGameActions = async type => {
    setSpinnerVisable(true);
    actions.disablePlay();

    if (type === 1) {
      /** User clicked send */
      await handleSendLetter();
    } else if (type === 2) {
      /** Word API lookup */
      await handleBust();
    } else if (type === 3) {
      /** Current user thinks previous player is bluffing. */
      await handleCall();
    } else if (type === 4) {
      /** Current answers the call with a word */
      await handleSendCompleteWord();
    } else if (type === 5) {
      /** Current user answers the call with a surrender */
      await handleSurrenderCall();
    }
    setSpinnerVisable(false);
    setModalVisable(true);
  };

  const handleSendLetter = async () => {
    if (state.letter) {
      /** Send letter and set next
       * player as next active user. */
      await sendLetter();
      setModalData('Good job! Your letter has been submitted.');
    } else {
      /** Current user gets a mark and next
       * player is next active user, unless there's
       *  only 2 players left and current
       * user hits maximum nr or marks.
       * Then next player is game winner.
       */
      if (!game.letters || !game.letters.length) {
        const letter = alphabet[Math.floor(Math.random() * alphabet.length)];
        await sendLetter(letter);
        setModalData(
          `Since you're staring this round you did'nt get a mark and we chose letter "${letter}" for you.`
        );
      } else {
        const { nextPlayerWonGame, currentScore } = await playerSentNoLetter(
          true
        );
        await setModalDataForBlankSubmits(nextPlayerWonGame, currentScore);
      }
    }
  };

  const handleBust = async () => {
    const {
      userToMark,
      nextPlayerWon,
      wordDefintions,
      currentScore,
    } = await validateWordAndCalcMarks();
    if (userToMark === currentUid) {
      // It wasnt a word, user gets two marks
      if (nextPlayerWon) {
        // previous user won
        setModalData(
          `${wordDefintions.word} is not a word. Therefore you got two marks which means that the previous player won the game`
        );
      } else if (currentScore + 2 >= maxMarks) {
        setModalData(
          `${wordDefintions.word} is not a word and therefore you got two marks and now you got too many marks.`
        );
      } else {
        setModalData(
          `${wordDefintions.word} is not a word and therefore you got two marks.`
        );
      }
    } else {
      // It was a word, previous user gets a mark
      if (nextPlayerWon) {
        // TODO: hmmm?
        // current user won
        setModalData(`Nice move! You won the game!`);
      } else {
        setModalData(
          `Nicely done! Previous player got a mark and you'll start the next round!`
        );
      }
    }
  };

  const handleCall = async () => {
    const firestoreUpdates = {};
    firestoreUpdates['activePlayer'] = getClosestActivePlayer(
      game.players,
      currentUid,
      true
    );
    firestoreUpdates['lastUpdated'] = Date.now();
    firestoreUpdates['status'] = 'calling';
    firestoreUpdates['caller'] = currentUid;
    firestoreUpdates['revealer'] = firestoreUpdates.activePlayer;
    // await saveDocument(`games/${game.key}`, firestoreUpdates, true);
    const displayName = getDisplayNameByUid(
      game.players,
      firestoreUpdates.activePlayer
    );
    setModalData(
      `You've called previous player! Sit tight and wait for ${displayName} to answer!`
    );
  };

  const handleSendCompleteWord = async () => {
    if (
      state.completeWord.length &&
      state.completeWord.startsWith(game.letters.join(''))
    ) {
      /** Current user typed a word */
      await handleBust();
    } else {
      /** Current user typed something not valid */
      const { nextPlayerWonGame, currentScore } = await playerSentNoLetter(
        true,
        2,
        true
      );
      await setModalDataForBlankSubmits(nextPlayerWonGame, currentScore);
    }
  };

  const handleSurrenderCall = async () => {
    /** Current user typed something not valid */
    const { nextPlayerWonGame, currentScore } = await playerSentNoLetter(
      true,
      2,
      true
    );
    await setModalDataForBlankSubmits(nextPlayerWonGame, currentScore);
  };

  const sendLetter = async (letter = state.letter) => {
    const firestoreUpdates = {};
    firestoreUpdates['activePlayer'] = getClosestActivePlayer(
      game.players,
      currentUid
    );
    firestoreUpdates['lastUpdated'] = Date.now();
    firestoreUpdates['letters'] = !!game.letters
      ? [...game.letters, letter]
      : [letter];
    // await saveDocument(`games/${game.key}`, firestoreUpdates, true);
  };

  const playerSentNoLetter = async (
    markCurrentUser,
    nrOfMarks = 1,
    prevPlayerStarts
  ) => {
    const userTogetMark = markCurrentUser
      ? currentUid
      : getClosestActivePlayer(game.players, currentUid, true);
    const currentScore = game.players.find(p => p.uid === userTogetMark).score;
    const nextPlayerWonGame =
      game.players.length === 2 && currentScore + nrOfMarks >= maxMarks
        ? true
        : false;

    if (nextPlayerWonGame) {
      await setGameWinner(nrOfMarks, userTogetMark);
    } else {
      await markPlayer(userTogetMark, nrOfMarks, prevPlayerStarts);
    }

    return { nextPlayerWonGame, currentScore };
  };

  const setModalDataForBlankSubmits = async (nextPlayerWon, currentScore) => {
    if (nextPlayerWon) {
      setModalData(
        'You got too many marks so your oppnent won this game. Better luck next time!'
      );
    } else if (currentScore + 1 >= maxMarks) {
      setModalData(
        `You got too many marks so you're out. Better luck next time!`
      );
    } else {
      setModalData(
        calling
          ? 'You got two marks.'
          : 'You got two marks. Try to bluff next time'
      );
    }
  };

  const setGameWinner = async (nrOfMarks, userToGetMark) => {
    const firestoreData = {
      lastUpdated: Date.now(),
      players: game.players.map(({ displayName, photoURL, score, uid }) => {
        if (uid === userToGetMark) {
          score += nrOfMarks;
        }
        return { displayName, photoURL, score, uid };
      }),
      playersUid: [...game.playersUid],
      status: 'completed',
      title: game.title,
      winner: getClosestActivePlayer(game.players, userToGetMark),
    };
    // await saveDocument(`games/${game.key}`, firestoreData, false, false);
  };

  const markPlayer = async (uid, nrOfMarks = 1, prevPlayer = false) => {
    const firestoreUpdates = {};
    firestoreUpdates['activePlayer'] = getClosestActivePlayer(
      game.players,
      currentUid,
      prevPlayer
    );
    firestoreUpdates['lastUpdated'] = Date.now();
    firestoreUpdates['players'] = game.players.map(player => {
      if (player.uid === uid) {
        player.score += nrOfMarks;
        if (player.score >= maxMarks) player.isActive = false;
      }
      return player;
    });
    // await saveDocument(`games/${game.key}`, firestoreUpdates, false, false);
  };

  const validateWordAndCalcMarks = async () => {
    const completeWord = calling ? state.completeWord : game.letters.join('');
    let userToMark;
    const wordDefintions = await getWordDetails(completeWord);
    let nextPlayerWon;
    let currentScore;

    if (wordDefintions.success) {
      /** completeWord is a word. Previous player gets a mark. 
             * Current player starts new round unless
            previous user hits maximum nr of marks and there's
            only 1 player left, then current player is game winner */
      userToMark = getClosestActivePlayer(game.players, currentUid, true);
      const {
        nextPlayerWonGame: npw,
        currentScore: cs,
      } = await playerSentNoLetter(false, calling ? 2 : 1);
      nextPlayerWon = npw;
      currentScore = cs;
    } else {
      /** completeWord is not a word. Current user gets two marks, 
            'next player' is previous player unless
            current user hits maximum nr of marks and there's
            only 1 player left, then previous player is game winner */
      userToMark = currentUid;
      const { nextPlayerWon: npw, currentScore: cs } = await playerSentNoLetter(
        true,
        2,
        true
      );
      nextPlayerWon = npw;
      currentScore = cs;
    }

    return { userToMark, nextPlayerWon, wordDefintions, currentScore };
  };

  const renderModalContent = () => (
    <ModalContainer>
      <Text>{modalData}</Text>
    </ModalContainer>
  );

  const closeModalAndNavigate = () => {
    setModalVisable(false);
    setTimeout(() => {
      navigation.navigate('Home');
    }, 150);
  };

  useEffect(() => {
    const { game: gameParam, uid, calling } = route.params;
    setUid(uid);
    setGame(gameParam);
    setCalling(calling);

    if (!gameParam.letters) {
      setTimeout(() => actions.enablePlay(), 1000);
    }

    return () => {};
  }, []);

  useEffect(() => {
    /** Event handler if time runs out */
    actions.disablePlay();
    if (state.timesup) {
      determineGameActions(calling ? 5 : 1);
    }
  }, [state.timesup]);
  return (
    <GameContext.Provider value={{ state, actions }}>
      <SafeWrapper bg={theme.colors.lightShade}>
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
          onBackdropPress={() => closeModalAndNavigate()}
          onSwipeComplete={() => closeModalAndNavigate()}
          swipeDirection={['left', 'right']}>
          {renderModalContent()}
        </Modal>
        <Wrapper>
          <ProgressBar enablePlay={state.enablePlay} theme={theme} />

          <LetterBox letters={game.letters} theme={theme} calling={calling} />

          <ActionsWrapper>
            <Button
              disabled={!state.enablePlay}
              buttonStyle={{
                backgroundColor: theme.colors.success,
              }}
              icon={
                <FontAwesome5
                  name="paper-plane"
                  size={15}
                  color={'white'}
                  style={{ marginRight: 5 }}
                />
              }
              title="Send"
              onPress={() => determineGameActions(calling ? 4 : 1)}
            />
            {!calling && (
              <Button
                disabled={
                  !state.enablePlay || !game.letters || game.letters.length < 3
                }
                buttonStyle={{
                  backgroundColor: theme.colors.warning,
                }}
                icon={
                  <FontAwesome5
                    name="gavel"
                    size={15}
                    color="white"
                    style={{ marginRight: 5 }}
                  />
                }
                title="Bust"
                onPress={() => determineGameActions(2)}
              />
            )}
            <Button
              disabled={
                !state.enablePlay || !game.letters || game.letters.length < 2
              }
              buttonStyle={{
                backgroundColor: theme.colors.danger,
              }}
              icon={
                <FontAwesome5
                  name={calling ? 'flag' : 'glasses'}
                  size={15}
                  color="white"
                  style={{ marginRight: 5 }}
                />
              }
              title={calling ? 'Surrender' : 'Call'}
              onPress={() => determineGameActions(calling ? 5 : 3)}
            />
          </ActionsWrapper>

          <View>{!calling && <Keyboard />}</View>
        </Wrapper>
      </SafeWrapper>
      <Spinner
        animate={spinnerIsVisable}
        onPress={() => setSpinnerVisable(false)}
        color={theme.colors.primary}
      />
    </GameContext.Provider>
  );
};

export default withTheme(GamePage);
