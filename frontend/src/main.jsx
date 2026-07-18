import React from 'react';
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './app/store.js';

// Import StyleProvider from the official antd sub-package
import { StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider } from 'antd';

import App from './App.jsx'
import './index.css';


const root = createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<StyleProvider layer>
				<ConfigProvider>
					<BrowserRouter>
						<App />
					</BrowserRouter>
				</ConfigProvider>
			</StyleProvider>
		</Provider>
	</React.StrictMode>,
);