import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import VocabularyPage from './pages/VocabularyPage';
import LearnStep3Page from './pages/LearnStep3Page';
import { useVocabularyStore } from './store/vocabularyStore';

function App() {
  const loadVocabulary = useVocabularyStore((s) => s.loadVocabulary);
  useEffect(() => {
    loadVocabulary();
  }, [loadVocabulary]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="vocabulary" element={<VocabularyPage />} />
        </Route>
        <Route path="/learn/step3" element={<LearnStep3Page />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
