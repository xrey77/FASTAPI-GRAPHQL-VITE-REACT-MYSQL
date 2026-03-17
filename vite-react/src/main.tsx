import { Buffer } from 'buffer';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client/react'
import { client } from './apolloClient'
import './index.css'
import App from './App.tsx'


// @ts-ignore
window.Buffer = Buffer;
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>    
  </StrictMode>,
)
