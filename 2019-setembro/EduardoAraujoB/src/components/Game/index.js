import React, { Component } from 'react';

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
import NoteC from '../Sounds/NoteC';
import NoteD from '../Sounds/NoteD';
import NoteE from '../Sounds/NoteE';
import NoteF from '../Sounds/NoteF';
import NoteG from '../Sounds/NoteG';
import NoteA from '../Sounds/NoteA';
import NoteB from '../Sounds/NoteB';

class Game extends Component {
  handleKeyPress(e) {
    if (e.key === '1') {
      NoteC.play();
    }
  }

  render() {
    return (
      <Container onKeyPress={this.handleKeyPress}>
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
              <SoundButton beforeText="DÓ" onClick={() => NoteC.play()}>
                {' '}
                1{' '}
              </SoundButton>{' '}
              <SoundButton beforeText="RÉ" onClick={() => NoteD.play()}>
                {' '}
                2{' '}
              </SoundButton>{' '}
              <SoundButton beforeText="MI" onClick={() => NoteE.play()}>
                {' '}
                3{' '}
              </SoundButton>{' '}
              <SoundButton beforeText="FÁ" onClick={() => NoteF.play()}>
                {' '}
                4{' '}
              </SoundButton>{' '}
              <SoundButton beforeText="SOL" onClick={() => NoteG.play()}>
                {' '}
                5{' '}
              </SoundButton>{' '}
              <SoundButton beforeText="LÁ" onClick={() => NoteA.play()}>
                {' '}
                6{' '}
              </SoundButton>{' '}
              <SoundButton beforeText="SI" onClick={() => NoteB.play()}>
                {' '}
                7{' '}
              </SoundButton>{' '}
              <SoundButton beforeText="DÒ" onClick={() => NoteC.play()}>
                {' '}
                8{' '}
              </SoundButton>{' '}
              <SoundButton beforeText="RÈ" onClick={() => NoteD.play()}>
                {' '}
                9{' '}
              </SoundButton>{' '}
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
}

export default Game;
