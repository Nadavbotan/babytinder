import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Swipe from './components/Swipe';
import Rate from './components/Rate';
import { db } from './firebase';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import './App.css';

const AppContent = ({ addName, saveName, names, setNames, savedNames, ratings, setRatings, userId }) => {
  const location = useLocation();

  return (
    <div className={`app-container ${location.pathname.slice(1)}`}>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/swipe">Swipe</Link>
          </li>
          <li>
            <Link to="/rate">Rate</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home addName={addName} names={names} savedNames={savedNames} />} />
        <Route path="/swipe" element={<Swipe names={names} saveName={saveName} setNames={setNames} userId={userId} />} />
        <Route path="/rate" element={<Rate savedNames={savedNames} ratings={ratings} setRatings={setRatings} />} />
      </Routes>
    </div>
  );
};

const App = () => {
  const [names, setNames] = useState([]);
  const [savedNames, setSavedNames] = useState([]);
  const [ratings, setRatings] = useState({});
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setUserId(userId);
    } else {
      const newUserId = prompt('Enter your user ID (e.g., user1, user2):');
      localStorage.setItem('userId', newUserId);
      setUserId(newUserId);
    }
  }, []);

  useEffect(() => {
    const docRef = doc(db, 'babyTinder', 'data');
    const unsubscribe = onSnapshot(docRef, (doc) => {
      const data = doc.data();
      if (data) {
        setNames(data.names || []);
        setSavedNames(data.savedNames || []);
        setRatings(data.ratings || {});
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const docRef = doc(db, 'babyTinder', 'data');
    setDoc(docRef, {
      names,
      savedNames,
      ratings
    }, { merge: true });
  }, [names, savedNames, ratings]);

  const addName = (name) => {
    setNames((prevNames) => [...prevNames, name]);
  };

  const saveName = (name) => {
    setSavedNames((prevSavedNames) => [...prevSavedNames, name]);
  };

  return (
    <Router>
      <AppContent
        addName={addName}
        saveName={saveName}
        names={names}
        setNames={setNames}
        savedNames={savedNames}
        ratings={ratings}
        setRatings={setRatings}
        userId={userId}
      />
    </Router>
  );
};

export default App;
