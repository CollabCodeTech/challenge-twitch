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
  SoundsButtonContainer,
  SoundButton,
  MinigamesContainer,
  MinigamesButton,
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
          <SoundsButtonContainer>
            <SoundButton> 0 </SoundButton>{' '}
            <SoundButton beforeText="DÓ"> 1 </SoundButton>{' '}
            <SoundButton beforeText="RÉ"> 2 </SoundButton>{' '}
            <SoundButton beforeText="MI"> 3 </SoundButton>{' '}
            <SoundButton beforeText="FÁ"> 4 </SoundButton>{' '}
            <SoundButton beforeText="SOL"> 5 </SoundButton>{' '}
            <SoundButton beforeText="LÁ"> 6 </SoundButton>{' '}
            <SoundButton beforeText="SI"> 7 </SoundButton>{' '}
            <SoundButton beforeText="DÒ"> 8 </SoundButton>{' '}
            <SoundButton beforeText="RÈ"> 9 </SoundButton>{' '}
          </SoundsButtonContainer>{' '}
          <MinigamesContainer>
            <MinigamesButton> ADIÇÃO </MinigamesButton>{' '}
            <MinigamesButton> {'SUBTRA-ÇÃO'} </MinigamesButton>{' '}
            <MinigamesButton> {'MULTIPLI-CAÇÃO'} </MinigamesButton>{' '}
            <MinigamesButton> DIVISÃO </MinigamesButton>{' '}
            <MinigamesButton> {'ARITIMÉ-TICA'} </MinigamesButton>{' '}
            <MinigamesButton> {'OPERA-ÇÃO'} </MinigamesButton>{' '}
            <MinigamesButton> {'SIGA-ME'} </MinigamesButton>{' '}
            <MinigamesButton> MEMÓRIA TONS </MinigamesButton>{' '}
            <MinigamesButton> NÚMERO DO MEIO </MinigamesButton>{' '}
            <MinigamesButton> ADVINHE O NÚMERO </MinigamesButton>{' '}
          </MinigamesContainer>{' '}
        </GameControlsContainer>{' '}
      </GameContainer>{' '}
    </Container>
  );
}

export default Game;
