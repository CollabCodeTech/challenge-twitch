import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  margin: 0;
  padding: 0;
  outline: none;
  box-sizing: border-box;

  html, border-style, #root {
    min-height: 100%;
  }

  body {
    -webkit-font-smoothing: antialiased !important;
  }
`;
