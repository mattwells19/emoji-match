import { Component, createEffect, createSignal, For, Show } from "solid-js";
import { Timer } from "./Timer";

const options = [
  "😝",
  "👋",
  "👶",
  "🕵️‍♂️",
  "🦸‍♀️",
  "🎩",
  "🧑‍🎤",
  "🐧",
  "🐢",
  "🐖",
  "🐉",
  "🍒",
  "🌮",
  "⚾️",
  "🪀",
  "🏓",
  "💩",
  "💅",
];

interface Card {
  value: string;
  key: string;
  flipped: boolean;
}

/**
 * Lodash implementation of shuffle
 * https://github.com/lodash/lodash/blob/main/src/shuffle.ts
 */
function shuffle<T>(array: Array<T>): Array<T> {
  let index = -1;
  const lastIndex = array.length - 1;
  const result = Array.from(array);

  while (++index < array.length) {
    const rand = index + Math.floor(Math.random() * (lastIndex - index + 1));
    const value = result[rand];
    result[rand] = result[index];
    result[index] = value;
  }

  return result;
}

const generateBoard = (): Array<Card> =>
  shuffle(
    options
      .map((option) => [
        {
          value: option,
          key: `${option}-1`,
          flipped: false,
        },
        {
          value: option,
          key: `${option}-2`,
          flipped: false,
        },
      ])
      .flat()
  );

const App: Component = () => {
  const [board, setBoard] = createSignal<Array<Card>>(generateBoard());
  const [cardOne, setCardOne] = createSignal<Card | null>(null);
  const [cardTwo, setCardTwo] = createSignal<Card | null>(null);
  const [firstMoveMade, setFirstMoveMade] = createSignal<boolean>(false);

  const gameOver = () => board().every((card) => card.flipped);

  createEffect(() => {
    if (gameOver()) {
      setFirstMoveMade(false);
    }
  });

  const handleClick = (card: Card): void => {
    if (card.flipped) return;
    const cardOneVal = cardOne();
    const cardTwoVal = cardTwo();
    if (cardOneVal && cardTwoVal) return;

    if (!cardOneVal) {
      setCardOne(card);
      setFirstMoveMade(true);
      return;
    }

    if (cardOneVal.key === card.key) return;

    setCardTwo(card);

    if (cardOneVal.value === card.value) {
      setBoard((prevBoard) => {
        return prevBoard.map((boardCard) => ({
          ...boardCard,
          flipped:
            boardCard.flipped ||
            boardCard.key === cardOneVal.key ||
            boardCard.key === card.key,
        }));
      });
      setCardOne(null);
      setCardTwo(null);
    } else {
      setTimeout(() => {
        setCardOne(null);
        setCardTwo(null);
      }, 2000);
    }
  };

  return (
    <main>
      <header>
        <Show
          when={gameOver()}
          fallback={
            <button
              class="game_control"
              onClick={() =>
                setBoard((prevBoard) =>
                  prevBoard.map((card) => ({ ...card, flipped: true }))
                )
              }
            >
              Reveal
            </button>
          }
        >
          <button
            class="game_control"
            onClick={() => {
              setBoard(generateBoard());
              setCardOne(null);
              setCardTwo(null);
            }}
          >
            Play again?
          </button>
        </Show>
        <Show
          when={gameOver() || firstMoveMade()}
          fallback={<p>Make a move to start the timer.</p>}
        >
          <Timer gameOver={gameOver()} />
        </Show>
      </header>
      <div
        class="board"
        classList={{
          game_over: gameOver(),
        }}
      >
        <For each={board()}>
          {(option) => {
            const isFlipped = () =>
              option.flipped ||
              cardOne()?.key === option.key ||
              cardTwo()?.key === option.key;

            return (
              <button
                onClick={() => handleClick(option)}
                class="card"
                classList={{
                  matched: option.flipped,
                  flipped: isFlipped(),
                }}
              >
                <span class="card_content">
                  {isFlipped() ? option.value : "❓"}
                </span>
              </button>
            );
          }}
        </For>
      </div>
    </main>
  );
};

export default App;
