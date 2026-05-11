import 'regenerator-runtime/runtime'; // <-- Add this polyfill import at the very top
import React, { useState, useEffect, useMemo } from 'react';
import './../styles/App.css';

const App = () => {
  // 1. State for inputs, data, and UI feedback
  const [userId, setUserId] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 2. The Cache: Using useMemo to create an object that persists across renders.
  // We provide an empty dependency array [] so the object is only created once.
  const apiCache = useMemo(() => ({}), []);

  // 3. The Fetch Logic
  useEffect(() => {
    const fetchPosts = async () => {
      // Check the cache first. If we already fetched posts for this userId, use them!
      if (apiCache[userId]) {
        console.log(`Cache hit for User ${userId}`);
        setData(apiCache[userId]);
        return; // Exit the function early to prevent the API call
      }

      // If not in cache, start the fetching process
      console.log(`Fetching from API for User ${userId}...`);
      setLoading(true);

      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();

        // Save the result to our useMemo cache for future use
        apiCache[userId] = result;
        
        // Update state to render the data
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId, apiCache]); // This effect runs whenever the userId input changes

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Post Viewer</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="user-select" style={{ marginRight: '10px' }}>Select User ID: </label>
        <select 
          id="user-select" 
          value={userId} 
          onChange={(e) => setUserId(Number(e.target.value))}
          style={{ padding: '5px' }}
        >
          {/* Creating a few options to test the input change */}
          {[1, 2, 3].map((id) => (
            <option key={id} value={id}>User {id}</option>
          ))}
        </select>
      </div>

      {/* Loading State UI */}
      {loading ? (
        <p style={{ color: '#0066cc', fontWeight: 'bold' }}>Loading data...</p>
      ) : (
        /* Data Display UI */
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {data.map((post) => (
            <li key={post.id} style={{ padding: '15px', border: '1px solid #ccc', marginBottom: '10px', borderRadius: '5px' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>{post.title}</h3>
              <p style={{ margin: 0, color: '#555' }}>{post.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;