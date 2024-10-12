import React from 'react';
import logo from './logo.svg';
import './App.css';
import DocumentUploader from './components/DocumentUploader';
import Dashboard from './components/Dashboard';
import { DocumentProvider } from './hooks/useDocuments';

function App() {
  return (
    <DocumentProvider>
      <Dashboard/>
      <DocumentUploader/>
    </DocumentProvider>
  );
}

export default App;
