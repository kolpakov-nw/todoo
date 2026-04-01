import React from 'react';
import ReactDOM from 'react-dom/client';
import {createGlobalStyle} from 'styled-components';
import { ThemeProviderContext } from './teme/Theme';
import App from './App';

const GlobalStyle = createGlobalStyle`
  html,
  body,
  #root {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    background: ${({ theme }) => theme.palette.background.default};
  }
  
`;

    ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
      <React.StrictMode>
        <ThemeProviderContext>
            <GlobalStyle />
          <App />
        </ThemeProviderContext>
      </React.StrictMode>
);
