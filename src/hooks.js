import { useEffect, useRef, useState } from 'react';
import { useSpring } from 'react-spring';
import { useDrag } from 'react-use-gesture';

export function useFlip(state) {
  const [flipped, setFlip] = useState(state);
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 }
  });

  return { transform, opacity, flipped, setFlip };
}

export function useSwipe({ onSwipeLeft, onSwipeRight }) {
  const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0 }));
  const bindSwipe = useDrag(({ down, movement: [xDelta, yDelta], direction: [xDir] }) => {
    const trigger = Math.abs(xDelta) > 100;
    const dir = xDir < 0 ? -1 : 1;
    const isGone = !down && trigger;

    set(() => ({
      x: isGone ? window.innerWidth * dir : down ? xDelta : 0,
      y: down ? yDelta : 0,
      config: { friction: 50, tension: down ? 800 : isGone ? 250 : 500 },
      onFrame: () => {
        if (isGone && Math.abs(x.value) >= window.innerWidth / 1.5) {
          if (dir < 0 && onSwipeLeft) {
            onSwipeLeft(x.value);
          } else if (dir > 0 && onSwipeRight) {
            onSwipeRight(x.value);
          }
        }
      }
    }));
  });

  return { x, y, bindSwipe };
}

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);

      return () => clearInterval(id);
    }
  }, [delay]);
}
