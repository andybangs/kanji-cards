import { useState } from 'react';
import { useSpring } from 'react-spring';
import { useGesture } from 'react-use-gesture';

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
  const bindSwipe = useGesture(({ down, delta: [xDelta], direction: [xDir, yDir], velocity }) => {
    const trigger = velocity > 0.2;
    const dir = xDir < 0 ? -1 : 1;
    const isSideSwipe = yDir > -0.5 && yDir < 0.5;
    const isGone = !down && isSideSwipe && trigger;

    set(() => ({
      x: isGone ? window.innerWidth * dir : down && isSideSwipe ? xDelta : 0,
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
