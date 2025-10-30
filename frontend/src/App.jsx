import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom'; // Import useLocation
import './App.css';
import Navbar from './components/common/NavBar';
import Footer from './components/common/Footer';
import BatchReport from './pages/BatchReport';
import { fetchFromDB } from './utils/fetchFromDB/fetchDB';
import StudentReport from './pages/StudentReport';
import CPReport from './pages/CpReport';
import ComparePage from './pages/ComparePage';
import Home from './pages/Home';

function App() {
  const [batchData, setBatchData] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  const location = useLocation(); // Get current route

  useEffect(() => {
    const fetchData = async () => {
      await fetchFromDB(setBatchData);
      setIsFetched(true);
    };
    fetchData();
  }, []);

  // Hide Navbar and Footer only on Home page
  const hideNavbarFooter = location.pathname === '/';

  return (
    <div className="w-screen min-h-screen flex flex-col">
      {!hideNavbarFooter && <Navbar />} {/* Conditionally render Navbar */}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/batch-report" element={<BatchReport batchData={batchData} isFetched={isFetched} />} />
        <Route path="/student-report" element={<StudentReport batchData={batchData} />} />
        <Route path="/cp-report" element={<CPReport />} />
        <Route path="/compare" element={<ComparePage />} />
      </Routes>

      {!hideNavbarFooter && <Footer />} {/* Conditionally render Footer */}
    </div>
  );
}

export default App;
