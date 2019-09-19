import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  height: 100%;
  width: 100%;
`;

export const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: auto;
  width: 750px;
  border-radius: 10px;
  padding: 10px;
  background: #fff;
`;

export const GameScreen = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  flex-direction: column;
  width: 100%;
  height: 80px;
  background: #282c34;
  margin-bottom: 10px;
  border-radius: 10px;
  & > span {
    margin-right: 20px;
    font-size: 20px;
    color: #ff837e;
  }
`;

export const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: flex-end;
  width: 110px;
  height: 40px;
  margin-bottom: 10px;
  border-radius: 5px;
  background: #f1d6ab;
  & > span {
    color: #1f8eed;
  }
`;

export const GameControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: #eaebd8;
  width: 100%;
  height: auto;
  padding: 15px 10px 15px 10px;
  border-radius: 5px;
`;

export const GameControllHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const LeftHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  width: 240px;
`;

export const HeaderButton = styled.button`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 80px;
  background: ${props => props.bgColor || 'none'};
  border-radius: 25px 10px 25px 10px;
  color: #fff;
`;

export const RightHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const StartContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-self: flex-end;
  justify-content: space-between;
  width: 110px;
`;

export const StartButton = styled.button`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 30px;
  border-radius: 5px;
  background: ${props => props.bgColor || 'green'};
  color: #fff;
`;

export const SoundsButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  height: auto;
  margin-top: 20px;
  margin-bottom: 10px;
  width: 100%;
`;

export const SoundButton = styled.button`
  cursor: pointer;
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
  width: 60px;
  height: 60px;
  background: #fff;
  border-radius: 5px;
  font-size: 12px;
  ::before {
    content: '';
  }
  ::after {
    content: '${props => props.beforeText || 'PAUSA'}';
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    left: 0;
    right: 0;
    bottom: 0;
    height: 30px;
    background: red;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
`;

export const MinigamesContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin-top: 5px;
  width: 100%;
  height: auto;
`;

export const MinigamesButton = styled.button`
  cursor: pointer;
  height: 60px;
  width: 65px;
  font-size: 12px;
  padding: 5px;
  background: yellow;
  border-radius: 5px;
`;
