import React, { useState, useEffect } from 'react';

const Home = ({ addName, names, savedNames }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // success or error

  const handleAddName = () => {
    if (name.trim() !== '') {
      if (names.includes(name) || savedNames.includes(name)) {
        setMessageType('error');
        setMessage('Name already exists!');
      } else {
        addName(name);
        setMessageType('success');
        setMessage('Name added successfully!');
        setName('');
      }
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddName();
    }
  };

  return (
    <div className="container">
      <h1>Add Baby Names</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Enter a baby name"
      />
      <button onClick={handleAddName}>Add Name</button>
      {message && <p className={`message ${messageType}`}>{message}</p>}
    </div>
  );
};

export default Home;
