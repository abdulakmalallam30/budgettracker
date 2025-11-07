import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import AuthenticatedApp from './components/AuthenticatedApp';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

export default App;