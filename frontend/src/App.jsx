// import { FaMapMarkerAlt, FaFacebook } from 'react-icons/fa';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/Login" element={<Login />} />

          <Route path="/SignUp" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
