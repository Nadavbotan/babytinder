import React, { useState, useEffect } from 'react';

const Rate = ({ savedNames, ratings, setRatings }) => {
  useEffect(() => {
    const storedRatings = JSON.parse(localStorage.getItem('ratings')) || {};
    setRatings(storedRatings);
  }, [setRatings]);

  useEffect(() => {
    localStorage.setItem('ratings', JSON.stringify(ratings));
  }, [ratings]);

  const handleRating = (name, rating) => {
    setRatings((prevRatings) => ({ ...prevRatings, [name]: rating }));
  };

  // Debugging: Check if savedNames is received correctly
  console.log("Saved Names:", savedNames);

  const sortedNames = [...savedNames].sort((a, b) => (ratings[b] || 0) - (ratings[a] || 0));

  return (
    <div className="container">
      <h1>Rate Saved Names</h1>
      <div className="rate-container">
        <div className="rate-inputs">
          {savedNames.length > 0 ? (
            sortedNames.map((name) => (
              <div key={name} className="name-container">
                <h2>{name}</h2>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={ratings[name] || ''}
                  onChange={(e) => handleRating(name, e.target.value)}
                  placeholder="Rate 1-5"
                  className="rating-input"
                  style={{ fontSize: '1.5rem' }}
                />
              </div>
            ))
          ) : (
            <p>No saved names to rate</p>
          )}
        </div>
        <div className="rating-table">
          <h2>Rating Table</h2>
          <ul>
            {sortedNames.map((name) => (
              <li key={name}>
                {name}: {ratings[name]} <span role="img" aria-label="star">⭐</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Rate;


