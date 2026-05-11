import React, { useState, useEffect } from 'react';

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Start loading immediately

  useEffect(() => {
    // Fetch ALL posts, no userId filter attached
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((response) => {
        if (!response.ok) throw new Error('Network response failed');
        return response.json();
      })
      .then((result) => {
        setData(result); // Save all 100 posts to state
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));

  }, []); // Empty array [] means this effect runs exactly once when the component mounts

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
    
      
      {/* EXACT string match for the loading test */}
      {loading ? (
        <p style={{ color: '#0066cc', fontWeight: 'bold' }}>Loading...</p>
      ) : (
        /* Render all fetched data */
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {data.map((post) => (
            <li key={post.id} style={{ padding: '15px', border: '1px solid #ccc', marginBottom: '10px', borderRadius: '5px' }}>
              {/* Keeping h4 to satisfy Cypress tests! */}
              <h4>{post.title}</h4>
              <p style={{ margin: 0, color: '#555' }}>{post.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;