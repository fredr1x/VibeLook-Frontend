import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Wardrobe from './pages/Wardrobe';
import AISuggestions from './pages/AISuggestions';
import SavedLooks from './pages/SavedLooks';
import Profile from './pages/Profile';
import Brands from './pages/Brands';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="wardrobe" element={<Wardrobe />} />
          <Route path="ai-suggestions" element={<AISuggestions />} />
          <Route path="saved-looks" element={<SavedLooks />} />
          <Route path="profile" element={<Profile />} />
          <Route path="brands" element={<Brands />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
