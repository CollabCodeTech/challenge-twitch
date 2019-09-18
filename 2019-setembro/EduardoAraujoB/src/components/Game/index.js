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
    this.handlekeyPress = this.handlekeyPress.bind(this);
  }

  handleNote(key) {
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

  handlekeyPress(e) {
    if (e.key === '1') {
      NoteC.play();
      this.setState({
        selectedNumber: 1,
      });
    }
    if (e.key === '2') {
      NoteD.play();
      this.setState({
        selectedNumber: 2,
      });
    }
    if (e.key === '3') {
      NoteE.play();
      this.setState({
        selectedNumber: 3,
      });
    }
    if (e.key === '4') {
      NoteF.play();
      this.setState({
        selectedNumber: 4,
      });
    }
    if (e.key === '5') {
      NoteG.play();
      this.setState({
        selectedNumber: 5,
      });
    }
    if (e.key === '6') {
      NoteA.play();
      this.setState({
        selectedNumber: 6,
      });
    }
    if (e.key === '7') {
      NoteB.play();
      this.setState({
        selectedNumber: 7,
      });
    }
    if (e.key === '8') {
      NoteCS.play();
      this.setState({
        selectedNumber: 8,
      });
    }
    if (e.key === '9') {
      NoteDS.play();
      this.setState({
        selectedNumber: 9,
      });
    }
  }

  render() {
    const { selectedNumber } = this.state;
    return (
      <Container>
        <GameContainer onKeyPress={this.handlekeyPress}>
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
              <SoundButton beforeText="DÓ" onClick={() => this.handleNote(1)}>
                {' '}
                1{' '}
              </SoundButton>{' '}
              <SoundButton beforeText="RÉ" onClick={() => this.handleNote(2)}>
                {' '}
                2{' '}
              </SoundButton>{' '}
              <SoundButton beforeText="MI" onClick={() => this.handleNote(3)}>
                {' '}
                3{' '}
              </SoundButton>{' '}
              <SoundButton beforeText="FÁ" onClick={() => this.handleNote(4)}>
                {' '}
                4{' '}
              </SoundButton>{' '}
              <SoundButton beforeText="SOL" onClick={() => this.handleNote(5)}>
                {' '}
                5{' '}
              </SoundButton>{' '}
              <SoundButton beforeText="LÁ" onClick={() => this.handleNote(6)}>
                {' '}
                6{' '}
              </SoundButton>{' '}
              <SoundButton beforeText="SI" onClick={() => this.handleNote(7)}>
                {' '}
                7{' '}
              </SoundButton>{' '}
              <SoundButton beforeText="DÒ" onClick={() => this.handleNote(8)}>
                {' '}
                8{' '}
              </SoundButton>{' '}
              <SoundButton beforeText="RÈ" onClick={() => this.handleNote(9)}>
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
