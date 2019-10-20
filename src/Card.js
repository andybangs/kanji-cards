import React, { useState } from 'react';
import { animated, config, interpolate, useSpring, useTransition } from 'react-spring';
import styled from 'styled-components';
import { useFlip, useSwipe, useInterval } from './hooks';

////////////////////////////////////////////////////////////////////////////////////////////////////
// Card

const CardCont = styled(animated.div)`
  width: 85vw;
  max-width: 50vh;
  height: 80vh;
  cursor: pointer;
  will-change: transform;
`;

const Surface = styled(animated.div)`
  position: absolute;
  background-color: white;
  will-change: transform, opacity;
`;

export function Card({ front, back, onSwipeLeft, onSwipeRight }) {
  const { transform, opacity, setFlip } = useFlip(false);
  const { x, y, bindSwipe } = useSwipe({ onSwipeLeft, onSwipeRight });

  return (
    <CardCont
      style={{ transform: interpolate([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`) }}
      onClick={() => setFlip(state => !state)}
      {...bindSwipe()}
    >
      <Surface style={{ opacity: opacity.interpolate(o => 1 - o), transform }}>{front}</Surface>
      <Surface style={{ opacity, transform: transform.interpolate(t => `${t} rotateY(180deg)`) }}>
        {back}
      </Surface>
    </CardCont>
  );
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Front

const Kanji = styled.span`
  font-family: Mincho;
  font-size: 8em;
`;

export function Front({ kanji, hintVisible = false }) {
  return (
    <React.Fragment>
      <Kanji>{kanji}</Kanji>
      {hintVisible && <FrontHint />}
    </React.Fragment>
  );
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Back

const BackCont = styled.div`
  display: block;
  padding: 1em;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
`;

const Reading = styled.span`
  display: block;
  font-size: 1.5em;
  margin-bottom: 0.5em;
`;

export function Back({ english, onyomi, kunyomi, examples, hintVisible = false, ...levels }) {
  return (
    <React.Fragment>
      <BackCont>
        <h1>{english}</h1>
        {onyomi && <Reading>{onyomi}</Reading>}
        {kunyomi && <Reading>{kunyomi}</Reading>}
        {examples.length > 0 && <Examples examples={examples} />}
        <KanjiLevel {...levels} />
      </BackCont>
      {hintVisible && <BackHint />}
    </React.Fragment>
  );
}

// Private

const List = styled.ul`
  padding-left: inherit;
`;

function Examples({ examples }) {
  return (
    <React.Fragment>
      <h2>Examples</h2>
      <List>
        {examples.map((str, i) => {
          const sepIndex = str.indexOf(':');
          const example = str.substring(0, sepIndex + 1);
          const definition = str.substring(sepIndex + 1);

          return (
            <li key={`example-${i}`}>
              <strong>{example}</strong>
              {definition}
            </li>
          );
        })}
      </List>
    </React.Fragment>
  );
}

function KanjiLevel({ jlpt, jouyou, frequency }) {
  return (
    <React.Fragment>
      <h2>Kanji Level</h2>
      <List>
        <li>
          <strong>JLPT Level:</strong> {`N${jlpt}`}
        </li>
        <li>
          <strong>Jouyou Grade:</strong> {jouyou > 0 ? jouyou : 'S'}
        </li>
        {frequency && (
          <li>
            <strong>Frequency:</strong> {frequency}
          </li>
        )}
      </List>
    </React.Fragment>
  );
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Hints

const HintCont = styled(animated.div)`
  position: absolute;
  bottom: 0;
  height: 10%;
  background: dimgrey;
  color: white;
  font-weight: 500;
`;

function FrontHint() {
  const contStyle = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 750,
    config: config.stiff
  });

  const labelStyle = useSpring({
    from: { opacity: 0, fontSize: '2em' },
    to: { opacity: 1, fontSize: '1em' },
    delay: 1000,
    config: config.wobbly
  });

  return (
    <HintCont style={contStyle}>
      <animated.span style={labelStyle}>
        <span role="img" aria-hidden="true">
          👆
        </span>{' '}
        Tap to flip
      </animated.span>
    </HintCont>
  );
}

function BackHint() {
  const [toggle, setToggle] = useState(false);
  const transitions = useTransition(toggle, null, {
    from: { position: 'absolute', opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: config.molasses
  });

  useInterval(() => setToggle(!toggle), 3000);

  return (
    <HintCont>
      {transitions.map(({ item, key, props }) =>
        item ? (
          <animated.span key={key} style={props}>
            <span role="img" aria-label="left">
              👈
            </span>{' '}
            Swipe to study again
          </animated.span>
        ) : (
          <animated.span key={key} style={props}>
            Swipe if you've learned it{' '}
            <span role="img" aria-label="right">
              👉
            </span>
          </animated.span>
        )
      )}
    </HintCont>
  );
}
