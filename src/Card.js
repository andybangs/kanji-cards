import React from 'react';
import { animated, interpolate } from 'react-spring';
import styled from 'styled-components';
import { useFlip, useSwipe } from './hooks';

////////////////////////////////////////////////////////////////////////////////////////////////////
// Card

const CardCont = styled(animated.div)`
  width: 50vh;
  height: 90vh;
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

const FrontCont = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Mincho;
  font-size: 8em;
`;

export function Front({ kanji }) {
  return (
    <FrontCont>
      <span>{kanji}</span>
    </FrontCont>
  );
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Back

const BackCont = styled.div`
  display: block;
  overflow: auto;
  padding: 1em;
`;

const Reading = styled.span`
  display: block;
  font-size: 1.5em;
  margin-bottom: 0.5em;
`;

export function Back({ english, onyomi, kunyomi, examples, ...levels }) {
  return (
    <BackCont>
      <h1>{english}</h1>
      {onyomi && <Reading>{onyomi}</Reading>}
      {kunyomi && <Reading>{kunyomi}</Reading>}
      {examples.length > 0 && <Examples examples={examples} />}
      <KanjiLevel {...levels} />
    </BackCont>
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
