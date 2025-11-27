import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ApolloProvider } from '@apollo/client'; // Mengimpor ApolloProvider
import client from './apolloClient'; // Mengimpor client Apollo
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}> {/* Membungkus aplikasi dengan ApolloProvider */}
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>
);