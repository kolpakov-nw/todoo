import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createGlobalStyle } from 'styled-components';
import { ThemeProviderContext } from './teme/Theme';
import App from './App';
import { store } from './store/store';

const GlobalStyle = createGlobalStyle`
    html,
    body
    // #root {
    //   margin: 0;
    //   padding: 0;
    //   min-height: 100%;
    //   width: 100%;
    //   background: ${({ theme }) => theme.palette.background.default};
    // }
`;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProviderContext>
                <GlobalStyle />
                <App />
            </ThemeProviderContext>
        </Provider>
    </React.StrictMode>
);
