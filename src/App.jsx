 import React, { useState, useRef, useEffect } from 'react';

const App = () => {
  const [playlist, setPlaylist] = useState([]); 
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true); 
  const audioRef = useRef(null);

  const handleFileChange = (event) => {
    const files = event.target.files;
    const newPlaylist = [...playlist, ...files];
    setPlaylist(newPlaylist);

    
    if (!audioRef.current) {
      setCurrentTrack(0);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handlePlay = (index) => {
    setCurrentTrack(index);
    setIsPlaying(true);
  };

  const handleNext = () => {
    setCurrentTrack((prevTrack) => (prevTrack + 1) % playlist.length);
    setIsPlaying(true);
  };

  useEffect(() => {
 
    localStorage.setItem('currentTrack', currentTrack);
  }, [currentTrack]);

  useEffect(() => {
    const storedTrack = localStorage.getItem('currentTrack');
    if (storedTrack !== null) {
      setCurrentTrack(parseInt(storedTrack, 10));
    }
  }, []);

  useEffect(() => {
    if (playlist.length > 0 && audioRef.current) {
      const audio = audioRef.current;

       
      audio.src = URL.createObjectURL(playlist[currentTrack]);

  
      audio.addEventListener('ended', handleNext);

  
      return () => {
        audio.removeEventListener('ended', handleNext);
        URL.revokeObjectURL(audio.src);
      };
    }
  }, [playlist, currentTrack]);

  useEffect(() => {
     
    if (audioRef.current) {
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <div>
      <h2>Audio Player</h2>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      {playlist.length > 0 && (
        <div>
          <audio ref={audioRef} autoPlay />
          <p>Now Playing: {playlist[currentTrack].name}</p>
          <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
          <button onClick={handleNext}>Next</button>
          <ul>
            {playlist.map((file, index) => (
              <li key={index}>
                <button onClick={() => handlePlay(index)}>{file.name}</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
