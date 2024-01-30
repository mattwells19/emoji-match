import {
  createSignal,
  Component,
  createEffect,
  onCleanup,
  onMount,
} from "solid-js";

export const Timer: Component<{ gameOver: boolean }> = (props) => {
  const [value, setValue] = createSignal<number>(0);
  let timer = -1;

  onMount(() => {
    if (!props.gameOver) {
      setValue(0);
      timer = setInterval(() => setValue(value() + 1), 1000);
    }
  });

  createEffect(() => {
    if (props.gameOver) {
      clearInterval(timer);
    }
  });

  onCleanup(() => {
    clearInterval(timer);
  });

  return (
    <p>
      {Math.floor(value() / 60)}:{(value() % 60).toString().padStart(2, "0")}
    </p>
  );
};
