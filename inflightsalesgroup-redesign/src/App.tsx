import Header from './components/Header';
import IsometricCabin from './components/IsometricCabin';
import Hero from './components/Hero';

function App() {
  return (
    <div className="relative min-h-screen bg-paper text-ink overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <IsometricCabin />
      <Header />
      <Hero />
      <div className="h-screen" />
    </div>
  );
}

export default App;
