import { wordsApiKey } from '../../environment/Config';

export const getWordDetails = async word => {
  /** 400	Bad Request -- Your request is invalid.
        401	Unauthorized -- Your API key is wrong.
        404	Not Found -- No matching word was found.
        500	Internal Server Error -- We had a problem with our server. Try again later.

        Eg 200
        definition: "the second day of the week; the first working day"
        message: ""
        partOfSpeech: "noun"
        success: true

        Eg 404
        definition: ""
        message: "word not found"
        partOfSpeech: ""
        success: false */

  const url = `https://wordsapiv1.p.mashape.com/words/${word}/definitions`;
  let resObj = {
    success: true,
    word,
    partOfSpeech: '',
    definition: '',
    message: '',
  };

  try {
    let res = await fetch(url, {
      headers: {
        'X-Mashape-Key': wordsApiKey,
      },
    });

    if (res.status === 200) {
      const resJson = await res.json();
      const { word, definitions } = resJson;
      resObj = { ...resObj, word, ...definitions[0] };
    } else {
      const resJson = await res.json();
      resObj = { ...resObj, ...resJson };
    }
    return resObj;
  } catch (error) {
    console.error(error);
  }
};

export const getClosestActivePlayer = (
  _players,
  uid,
  getPreviousPlayer = false
) => {
  // Remove scores
  const players = [..._players].map(({ uid, isActive }) => {
    return { uid, isActive };
  });

  /**
   * Defining a start index for our loop since
   * we want to get the "next player in line"
   * FROM current player
   */
  const startIndex = players.findIndex(p => p.uid === uid);
  const playersLength = players.length;

  const innerLoopFunc = i => {
    const playerInd = (i + startIndex) % playersLength;
    const player = players[playerInd];
    if (player.uid !== uid && player.isActive) {
      return player.uid;
    }
  };

  if (getPreviousPlayer) {
    for (let i = players.length; i > 0; i--) {
      const player = innerLoopFunc(i);
      if (player) {
        return player;
      }
    }
  } else {
    for (let i = 0, length = players.length; i < length; i++) {
      const player = innerLoopFunc(i);
      if (player) {
        return player;
      }
    }
  }
};

export const prepareAlertForBustResult = (
  players,
  bustData,
  completedGame = {}
) => {
  let instructions;
  const { wordDefintions, prevPlayerUid } = bustData;
  const prevDisplayName = players.find(player => player.uid === prevPlayerUid)
    .displayName;

  if (completedGame.winner) {
    instructions = wordDefintions.success
      ? `${prevDisplayName} got a mark and you won the game!`
      : (instructions = `You got a mark and ${prevDisplayName} won the game!`);
  } else {
    instructions = wordDefintions.success
      ? `${prevDisplayName} got a mark and you will start the new round`
      : (instructions = `You got a mark and ${prevDisplayName} will start the new round`);
  }

  return {
    title: wordDefintions.success
      ? `"${wordDefintions.word}" is a word`
      : `"${wordDefintions.word}" is not a word`,
    subHeader: wordDefintions.success
      ? `${wordDefintions.word}: ${wordDefintions.definition}`
      : wordDefintions.message,
    instructions,
    buttons: [`${wordDefintions.success ? 'I knew it!' : 'Darn it...'}`],
  };
};

export const getDisplayNameByUid = (players, uid) => {
  return players.find(p => p.uid === uid).displayName;
};
