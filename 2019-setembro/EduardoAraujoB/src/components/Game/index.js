import React from 'react';

import {
  Container,
  GameContainer,
  GameScreen,
  LogoContainer,
  GameControlsContainer,
} from './styles';

function Game() {
  return (
    <Container>
      <GameContainer>
        <GameScreen>
          <span> 0 </span>{' '}
        </GameScreen>{' '}
        <LogoContainer>
          <span> Pense Bem </span>{' '}
        </LogoContainer>{' '}
        <GameControlsContainer />
      </GameContainer>{' '}
    </Container>
  );
}

export default Game;
