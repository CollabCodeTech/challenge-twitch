import React from 'react';

import {
  Container,
  GameContainer,
  GameScreen,
  LogoContainer,
  GameControlsContainer,
  GameControllHeader,
  LeftHeader,
  HeaderButton,
  RightHeader,
  StartContainer,
  StartButton,
} from './styles';

function Game() {
  return (
    <Container>
      <GameContainer>
        <GameScreen>
          <span> 0 </span>{' '}
        </GameScreen>{' '}
        <GameControlsContainer>
          <GameControllHeader>
            <LeftHeader>
              <HeaderButton bgColor="red"> A </HeaderButton>{' '}
              <HeaderButton bgColor="#e6a400"> B </HeaderButton>{' '}
              <HeaderButton bgColor="blue"> C </HeaderButton>{' '}
              <HeaderButton bgColor="green"> D </HeaderButton>{' '}
            </LeftHeader>{' '}
            <RightHeader>
              <LogoContainer>
                <span> Pense Bem </span>{' '}
              </LogoContainer>{' '}
              <StartContainer>
                <StartButton bgColor="red"> DESL. </StartButton>{' '}
                <StartButton> LIGA </StartButton>{' '}
              </StartContainer>{' '}
            </RightHeader>{' '}
          </GameControllHeader>{' '}
        </GameControlsContainer>{' '}
      </GameContainer>{' '}
    </Container>
  );
}

export default Game;
