import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { PracticePage } from './pages/PracticePage';
import { ProgressPage } from './pages/ProgressPage';
import { HistoryPage } from './pages/HistoryPage';
import { storage } from './utils/storage';
import { usersApi } from './utils/api';
import './styles/globals.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [skillMemory, setSkillMemory] = useState(() => storage.getSkillMemory());

  // Initialize user session
  useEffect(() => {
    const existingId = localStorage.getItem('interviewai_userId');
    if (!existingId) {
      usersApi.create('Student')
        .then(data => localStorage.setItem('interviewai_userId', data.userId))
        .catch(() => {
          // Fallback: use a random client-side ID
          const id = `local_${Date.now()}_${Math.random().toString(36).slice(2)}`;
          localStorage.setItem('interviewai_userId', id);
        });
    }
  }, []);

  // Listen for skill memory updates
  useEffect(() => {
    const interval = setInterval(() => {
      const mem = storage.getSkillMemory();
      setSkillMemory(mem);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#13131f',
            color: '#f0f0f8',
            border: '1px solid rgba(255,255,255,0.08)',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 13
          }
        }}
      />

      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        skillMemory={skillMemory}
      />

      <main>
        {currentPage === 'home' && <PracticePage />}
        {currentPage === 'progress' && <ProgressPage />}
        {currentPage === 'history' && <HistoryPage />}
      </main>
    </div>
  );
}
