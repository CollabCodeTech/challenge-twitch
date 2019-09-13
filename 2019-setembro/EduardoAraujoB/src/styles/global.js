import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: none;
    box-sizing: border-box;
  }

  html, body, #root {
    min-height: 100%;
  }

  html {
    background: #fc6963;
    -webkit-font-smoothing: antialiased !important;
    text-rendering: optimizeLegibility !important;
    font-family: Arial, Helvetica, sans-serif;
  }

  button {
    outline: none;
    border: none;
  }
`;
