import React, { useState } from 'react';
import { animated, useSpring } from 'react-spring';
import { Card, Front, Back } from './Card';
import styled from 'styled-components';
import sample from 'lodash.sample';
import { DISPLAY_INTERVAL } from './config';
import { kyouiku } from './data';

const AppCont = styled(animated.div)`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export function App() {
  const appContStyle = useSpring({ to: { top: 0 }, from: { top: -1000 } });
  const [cardVisible, setCardVisible] = useState(true);
  const [card, setCard] = useState(sample(kyouiku));
  const { id, kanji, ...rest } = card;

  const handleSwipe = () => {
    setCardVisible(false);
    setCard(sample(kyouiku));
    setTimeout(() => setCardVisible(true), DISPLAY_INTERVAL);
  };

  return (
    <AppCont style={appContStyle}>
      {cardVisible ? (
        <Card
          front={<Front kanji={kanji} />}
          back={<Back {...rest} />}
          onSwipeLeft={handleSwipe}
          onSwipeRight={handleSwipe}
        />
      ) : null}
    </AppCont>
  );
}
