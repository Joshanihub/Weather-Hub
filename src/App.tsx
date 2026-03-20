import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/layout/Navigation';
import Home from './pages/Home';
import Search from './pages/Search';
import Forecast from './pages/Forecast';
import Map from './pages/Map';
import Saved from './pages/Saved';
import Settings from './pages/Settings';
import { SettingsProvider } from './contexts/SettingsContext.tsx';

function App() {
  return (
    <SettingsProvider>
      <Router>
        <div className="min-h-screen bg-surface-50">
          <Navigation />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/forecast" element={<Forecast />} />
              <Route path="/map" element={<Map />} />
              <Route path="/saved" element={<Saved />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </Router>
    </SettingsProvider>
  );
}

export default App;
