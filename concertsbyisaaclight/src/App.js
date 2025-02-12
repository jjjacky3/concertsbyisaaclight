import LoginPage from './pages/LoginPage';
import ArtistPage from './pages/ArtistPage';
import './App.css';
import AlecBenjamin from '../src/models/Artists/AlecBenjamin'

function App() {
  return <ArtistPage artist={AlecBenjamin} />;
}

export default App;
