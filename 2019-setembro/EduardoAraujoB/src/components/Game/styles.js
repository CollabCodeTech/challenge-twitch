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
  width: 700px;
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
  width: 100px;
  height: 40px;
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  background: #f1e2cb;
  & > span {
    color: #1f8eed;
  }
`;

export const GameControlsContainer = styled.div`
  background: #ddd;
  width: 100%;
  height: 280px;
  border-radius: 5px;
`;
