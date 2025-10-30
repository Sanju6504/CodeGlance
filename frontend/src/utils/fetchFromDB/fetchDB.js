async function fetchFromDB(setBatchData) {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/all-users`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const studentsData = await response.json();
      console.log('studentsData: ', studentsData);
      setBatchData(studentsData);
      console.log("useEffect Invoked");
    } catch (error) {
      console.error("Error fetching data from backend:", error);
    }
  }
  
  export { fetchFromDB };