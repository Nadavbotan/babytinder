import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './Swipe.css';

const Swipe = ({ names, saveName, setNames, userId }) => {
  const [index, setIndex] = useState(0);
  const [deltaX, setDeltaX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);

  const fetchRandomImage = async () => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=baby&client_id=43dqignfvBYDiqkIRXOlxcacKjPzb0hPYP2DBK0M104`
      );
      const data = await response.json();

      // Check if the response contains the 'urls' object and 'small' property
      if (data && data.urls && data.urls.small) {
        setImageUrls((prevUrls) => [...prevUrls, data.urls.small]);
      } else {
        console.error('Error: Image URL not found in the response', data);
        // You can add a fallback image URL here if needed
        setImageUrls((prevUrls) => [...prevUrls, 'https://via.placeholder.com/200']);
      }
    } catch (error) {
      console.error('Error fetching random image:', error);
      // You can add a fallback image URL here if the fetch fails
      setImageUrls((prevUrls) => [...prevUrls, 'https://via.placeholder.com/200']);
    }
  };

  useEffect(() => {
    if (names.length > 0 && imageUrls.length < names.length) {
      fetchRandomImage();
    }
  }, [names, imageUrls]);

  const handleSwipe = async (direction) => {
    setIsDragging(false);
    setDeltaX(0);
    if (direction === 'right') {
      console.log(`Swiped right on: ${names[index]}`);
      await updateSwipe(names[index], 'right');
    } else {
      console.log(`Swiped left on: ${names[index]}`);
      await updateSwipe(names[index], 'left');
    }
    if (index + 1 < names.length) {
      setIndex(index + 1);
    } else {
      setNames([]);
    }
  };

  const updateSwipe = async (name, direction) => {
    const docRef = doc(db, 'babyTinder', 'data');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const swipes = data.swipes || {};
      const userSwipes = swipes[userId] || {};
      userSwipes[name] = direction;
      swipes[userId] = userSwipes;

      // Log the updated swipes for debugging
      console.log('Updated swipes:', swipes);

      const bothSwipedRight = Object.values(swipes).every(userSwipe => userSwipe[name] === 'right');
      if (bothSwipedRight) {
        console.log(`Both swiped right on: ${name}. Adding to saved names.`);
        saveName(name);
      }

      await updateDoc(docRef, { swipes });
    } else {
      const initialSwipes = { [userId]: { [name]: direction } };
      console.log('Creating initial swipes:', initialSwipes);
      await updateDoc(docRef, { swipes: initialSwipes });
    }
  };

  const swipeHandlers = useSwipeable({
    onSwiping: (eventData) => {
      setIsDragging(true);
      setDeltaX(eventData.deltaX);
    },
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div className="swipe-container" {...swipeHandlers}>
      {index < names.length ? (
        <div
          className={`swipe-card ${isDragging ? 'dragging' : ''}`}
          style={{ transform: `translateX(${deltaX}px)`, opacity: 1 - Math.abs(deltaX) / 300 }}
        >
          {imageUrls[index] ? (
            <img
              src={imageUrls[index]}
              alt="Baby"
              className="swipe-image"
            />
          ) : (
            <div>Loading...</div>
          )}
          <h2>{names[index]}</h2>
          <div className="icons">
            {deltaX > 50 && <span role="img" aria-label="like" className="like-icon">👍</span>}
            {deltaX < -50 && <span role="img" aria-label="dislike" className="dislike-icon">👎</span>}
          </div>
        </div>
      ) : (
        <p>No more names to swipe</p>
      )}
    </div>
  );
};

export default Swipe;
