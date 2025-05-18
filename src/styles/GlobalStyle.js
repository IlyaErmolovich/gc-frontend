import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Roboto', sans-serif;
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    line-height: 1.6;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button, input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    border: none;
    outline: none;
  }

  button {
    cursor: pointer;
    background: none;
  }

  ul, ol {
    list-style: none;
  }

  img {
    max-width: 100%;
    display: block;
  }

  main {
    min-height: calc(100vh - 140px);
    padding: 80px 0 60px;
    
    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      padding: 70px 0 60px;
    }
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
    width: 100%;
  }

  @media (max-width: 768px) {
    main {
      padding: 10px 0;
    }
  }
`;

export default GlobalStyle; 