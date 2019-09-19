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
      isGameStarted: false,
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
    const { selectedNumber, isGameStarted } = this.state;
    return (
      <Container>
        <GameContainer onKeyPress={this.handlekeyPress}>
          <GameScreen>
            <span> {selectedNumber} </span>{' '}
          </GameScreen>{' '}
          <GameControlsContainer>
            <GameControllHeader>
              <LeftHeader>
                <HeaderButton disabled={!isGameStarted} bgColor="red">
                  {' '}
                  A{' '}
                </HeaderButton>{' '}
                <HeaderButton disabled={!isGameStarted} bgColor="#e6a400">
                  {' '}
                  B{' '}
                </HeaderButton>{' '}
                <HeaderButton disabled={!isGameStarted} bgColor="blue">
                  {' '}
                  C{' '}
                </HeaderButton>{' '}
                <HeaderButton disabled={!isGameStarted} bgColor="green">
                  {' '}
                  D{' '}
                </HeaderButton>{' '}
              </LeftHeader>{' '}
              <RightHeader>
                <LogoContainer>
                  <span> Pense Bem </span>{' '}
                </LogoContainer>{' '}
                <StartContainer>
                  <StartButton
                    bgColor="red"
                    onClick={() =>
                      this.setState({
                        isGameStarted: false,
                        selectedNumber: 0,
                      })
                    }
                  >
                    {' '}
                    DESL.{' '}
                  </StartButton>{' '}
                  <StartButton
                    onClick={() =>
                      this.setState({
                        isGameStarted: true,
                      })
                    }
                  >
                    {' '}
                    LIGA{' '}
                  </StartButton>{' '}
                </StartContainer>{' '}
              </RightHeader>{' '}
            </GameControllHeader>{' '}
            <SoundsButtonContainer>
              <SoundButton disabled={!isGameStarted}> 0 </SoundButton>{' '}
              <SoundButton
                disabled={!isGameStarted}
                beforeText="DÓ"
                onClick={() => this.handleNote(1)}
              >
                {' '}
                1{' '}
              </SoundButton>{' '}
              <SoundButton
                disabled={!isGameStarted}
                beforeText="RÉ"
                onClick={() => this.handleNote(2)}
              >
                {' '}
                2{' '}
              </SoundButton>{' '}
              <SoundButton
                disabled={!isGameStarted}
                beforeText="MI"
                onClick={() => this.handleNote(3)}
              >
                {' '}
                3{' '}
              </SoundButton>{' '}
              <SoundButton
                disabled={!isGameStarted}
                beforeText="FÁ"
                onClick={() => this.handleNote(4)}
              >
                {' '}
                4{' '}
              </SoundButton>{' '}
              <SoundButton
                disabled={!isGameStarted}
                beforeText="SOL"
                onClick={() => this.handleNote(5)}
              >
                {' '}
                5{' '}
              </SoundButton>{' '}
              <SoundButton
                disabled={!isGameStarted}
                beforeText="LÁ"
                onClick={() => this.handleNote(6)}
              >
                {' '}
                6{' '}
              </SoundButton>{' '}
              <SoundButton
                disabled={!isGameStarted}
                beforeText="SI"
                onClick={() => this.handleNote(7)}
              >
                {' '}
                7{' '}
              </SoundButton>{' '}
              <SoundButton
                disabled={!isGameStarted}
                beforeText="DÒ"
                onClick={() => this.handleNote(8)}
              >
                {' '}
                8{' '}
              </SoundButton>{' '}
              <SoundButton
                disabled={!isGameStarted}
                beforeText="RÈ"
                onClick={() => this.handleNote(9)}
              >
                {' '}
                9{' '}
              </SoundButton>{' '}
            </SoundsButtonContainer>{' '}
            <MinigamesContainer>
              <MinigamesButton disabled={!isGameStarted}>
                {' '}
                ADIÇÃO{' '}
              </MinigamesButton>{' '}
              <MinigamesButton disabled={!isGameStarted}>
                {' '}
                {'SUBTRA-ÇÃO'}{' '}
              </MinigamesButton>{' '}
              <MinigamesButton disabled={!isGameStarted}>
                {' '}
                {'MULTIPLI-CAÇÃO'}{' '}
              </MinigamesButton>{' '}
              <MinigamesButton disabled={!isGameStarted}>
                {' '}
                DIVISÃO{' '}
              </MinigamesButton>{' '}
              <MinigamesButton disabled={!isGameStarted}>
                {' '}
                {'ARITIMÉ-TICA'}{' '}
              </MinigamesButton>{' '}
              <MinigamesButton disabled={!isGameStarted}>
                {' '}
                {'OPERA-ÇÃO'}{' '}
              </MinigamesButton>{' '}
              <MinigamesButton disabled={!isGameStarted}>
                {' '}
                {'SIGA-ME'}{' '}
              </MinigamesButton>{' '}
              <MinigamesButton disabled={!isGameStarted}>
                {' '}
                MEMÓRIA TONS{' '}
              </MinigamesButton>{' '}
              <MinigamesButton disabled={!isGameStarted}>
                {' '}
                NÚMERO DO MEIO{' '}
              </MinigamesButton>{' '}
              <MinigamesButton disabled={!isGameStarted}>
                {' '}
                ADVINHE O NÚMERO{' '}
              </MinigamesButton>{' '}
            </MinigamesContainer>{' '}
          </GameControlsContainer>{' '}
        </GameContainer>{' '}
      </Container>
    );
  }
}

export default Game;
