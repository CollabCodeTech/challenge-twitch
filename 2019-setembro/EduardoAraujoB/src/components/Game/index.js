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
import NoteCS from '../Sounds/NoteCS';
import NoteDS from '../Sounds/NoteDS';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedNumber: 0,
    };
  }

  handleClick(key) {
    if (key === 1) {
      NoteC.play();
      this.setState({
        selectedNumber: key,
      });
    }
    if (key === 2) {
      NoteD.play();
      this.setState({
        selectedNumber: key,
      });
    }
    if (key === 3) {
      NoteE.play();
      this.setState({
        selectedNumber: key,
      });
    }
    if (key === 4) {
      NoteF.play();
      this.setState({
        selectedNumber: key,
      });
    }
    if (key === 5) {
      NoteG.play();
      this.setState({
        selectedNumber: key,
      });
    }
    if (key === 6) {
      NoteA.play();
      this.setState({
        selectedNumber: key,
      });
    }
    if (key === 7) {
      NoteB.play();
      this.setState({
        selectedNumber: key,
      });
    }
    if (key === 8) {
      NoteCS.play();
      this.setState({
        selectedNumber: key,
      });
    }
    if (key === 9) {
      NoteDS.play();
      this.setState({
        selectedNumber: key,
      });
    }
  }

  handleKeyPress(e) {
    if (e.key === '1' || e.key === '8') {
      NoteC.play();
    }
    if (e.key === '2' || e.key === '9') {
      NoteD.play();
    }
    if (e.key === '3') {
      NoteE.play();
    }
    if (e.key === '4') {
      NoteF.play();
    }
    if (e.key === '5') {
      NoteG.play();
    }
    if (e.key === '6') {
      NoteA.play();
    }
    if (e.key === '7') {
      NoteB.play();
    }
  }

  render() {
    const { selectedNumber } = this.state;
    return (
      <Container onKeyPress={this.handleKeyPress}>
        <GameContainer>
          <GameScreen>
            <span> {selectedNumber} </span>{' '}
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
              <SoundButton beforeText="DÓ" onClick={() => this.handleClick(1)}>
                {' '}
                1{' '}
              </SoundButton>{' '}
              <SoundButton beforeText="RÉ" onClick={() => this.handleClick(2)}>
                {' '}
                2{' '}
              </SoundButton>{' '}
              <SoundButton beforeText="MI" onClick={() => this.handleClick(3)}>
                {' '}
                3{' '}
              </SoundButton>{' '}
              <SoundButton beforeText="FÁ" onClick={() => this.handleClick(4)}>
                {' '}
                4{' '}
              </SoundButton>{' '}
              <SoundButton beforeText="SOL" onClick={() => this.handleClick(5)}>
                {' '}
                5{' '}
              </SoundButton>{' '}
              <SoundButton beforeText="LÁ" onClick={() => this.handleClick(6)}>
                {' '}
                6{' '}
              </SoundButton>{' '}
              <SoundButton beforeText="SI" onClick={() => this.handleClick(7)}>
                {' '}
                7{' '}
              </SoundButton>{' '}
              <SoundButton beforeText="DÒ" onClick={() => this.handleClick(8)}>
                {' '}
                8{' '}
              </SoundButton>{' '}
              <SoundButton beforeText="RÈ" onClick={() => this.handleClick(9)}>
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
