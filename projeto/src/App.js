import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [birdPosition, setBirdPosition] = useState(200);
  const [gravity] = useState(3);
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [obstacleLeft, setObstacleLeft] = useState(500);
  const [obstacleHeight, setObstacleHeight] = useState(100);
  const [score, setScore] = useState(0);

  const gameHeight = 500;
  const gameWidth = 500;
  const birdSize = 30;
  const obstacleWidth = 40;
  const gap = 150;

  const gameLoop = useRef(null);

  // Bird falling
  useEffect(() => {
    if (gameHasStarted && birdPosition < gameHeight - birdSize) {
      const interval = setInterval(() => {
        setBirdPosition(prev => prev + gravity);
      }, 24);
      return () => clearInterval(interval);
    }
  }, [gameHasStarted, birdPosition]);

  // Obstacle moving
  useEffect(() => {
    if (gameHasStarted && obstacleLeft >= -obstacleWidth) {
      const timer = setInterval(() => {
        setObstacleLeft(prev => prev - 5);
      }, 24);
      return () => clearInterval(timer);
    } else {
      setObstacleLeft(gameWidth);
      setObstacleHeight(Math.floor(Math.random() * (gameHeight - gap)));
      setScore(prev => prev + 1);
    }
  }, [gameHasStarted, obstacleLeft]);

  // Collision Detection
  useEffect(() => {
    const topObstacleBottom = obstacleHeight;
    const bottomObstacleTop = obstacleHeight + gap;

    const birdHitsTop = birdPosition < topObstacleBottom;
    const birdHitsBottom = birdPosition + birdSize > bottomObstacleTop;

    if (
      obstacleLeft < birdSize + 50 &&
      obstacleLeft + obstacleWidth > 50 &&
      (birdHitsTop || birdHitsBottom)
    ) {
      endGame();
    }

    if (birdPosition >= gameHeight - birdSize) {
      endGame();
    }
  }, [birdPosition, obstacleLeft, obstacleHeight]);

  const handleClick = () => {
    let newPos = birdPosition - 60;
    setBirdPosition(newPos < 0 ? 0 : newPos);
    setGameHasStarted(true);
  };

  const endGame = () => {
    alert(`Game Over! Pontuação: ${score}`);
    setBirdPosition(200);
    setObstacleLeft(500);
    setScore(0);
    setGameHasStarted(false);
  };

  return (
    <div className="App" onClick={handleClick}>
      <h1>Flappy Bird</h1>
      <div
        style={{
          position: 'relative',
          height: gameHeight,
          width: gameWidth,
          backgroundColor: '#70c5ce',
          overflow: 'hidden',
          margin: '0 auto',
          border: '2px solid #000',
        }}
      >
        {/* Bird */}
        <div
          style={{
            position: 'absolute',
            backgroundColor: 'pink',
            height: birdSize,
            width: birdSize,
            borderRadius: '50%',
            top: birdPosition,
            left: 50,
          }}
        />

        {/* Top Obstacle */}
        <div
          style={{
            position: 'absolute',
            backgroundColor: 'green',
            height: obstacleHeight,
            width: obstacleWidth,
            left: obstacleLeft,
            top: 0,
          }}
        />

        {/* Bottom Obstacle */}
        <div
          style={{
            position: 'absolute',
            backgroundColor: 'green',
            height: gameHeight - obstacleHeight - gap,
            width: obstacleWidth,
            left: obstacleLeft,
            top: obstacleHeight + gap,
          }}
        />
      </div>

      <h2>Pontuação: {score}</h2>
      {!gameHasStarted && <p>Clique para começar e fazer o pássaro voar!</p>}
    </div>
  );
}

export default App;
