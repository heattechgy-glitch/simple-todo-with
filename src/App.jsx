import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TodoApp from './pages/TodoApp.jsx';
import Navbar from './components/Navbar.jsx';

function App() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/todoapp" replace />} />
        <Route path="/todoapp" element={<TodoApp />} />
      </Routes>
    </div>
  );
}

export default App;