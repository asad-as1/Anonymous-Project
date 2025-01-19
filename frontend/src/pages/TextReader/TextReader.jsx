import React, { useState, useEffect, useRef } from "react";
import "./TextReader.css"

function TextReader() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const audioRef = useRef(null);
  const speechRef = useRef(null);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.ontimeupdate = () => {
        setCurrentTime(audioRef.current.currentTime);
      };
    }
  }, [audioUrl]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    fetch(`${import.meta.env.VITE_URL}/textreader`, {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        setText(data.text);
        setError("");
      })
      .catch(error => {
        console.error("Error uploading file:", error);
        setError("Error uploading file.");
      });
  };

  const useFallbackTTS = () => {
    setIsUsingFallback(true);
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      setError("Text-to-speech is not supported in your browser.");
    }
  };

  const handleGenerateAudio = () => {
    if (!text) {
      setError("No text to convert to audio.");
      return;
    }

    fetch(`${import.meta.env.VITE_URL}/generate-audio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text })
    })
      .then(response => response.blob())
      .then(audioBlob => {
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        setIsUsingFallback(false);
        if (audioRef.current) {
          audioRef.current.play();
        }
      })
      .catch(error => {
        console.error("Error generating audio:", error);
        setError("Using browser's text-to-speech as fallback.");
        useFallbackTTS();
      });
  };

  const handlePlayAudio = () => {
    if (isUsingFallback) {
      window.speechSynthesis.resume();
    } else if (audioUrl && audioRef.current) {
      audioRef.current.play();
    }
  };

  const handlePauseAudio = () => {
    if (isUsingFallback) {
      window.speechSynthesis.pause();
    } else if (audioUrl && audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleStop = () => {
    if (isUsingFallback) {
      window.speechSynthesis.cancel();
    } else if (audioUrl && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleSliderChange = (event) => {
    const newTime = event.target.value;
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleRateChange = (event) => {
    const newRate = parseFloat(event.target.value);
    if (isUsingFallback && speechRef.current) {
      speechRef.current.rate = newRate;
    } else if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">File Upload and Audio Player</h1>

        <div className="space-y-4">
          <input
            type="file"
            accept=".pdf,.txt,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button 
            onClick={handleFileUpload}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Upload File
          </button>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        {text && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Extracted Text</h2>
            <pre className="p-4 bg-gray-50 rounded overflow-auto max-h-60">{text}</pre>

            <div className="space-y-4">
              <div className="flex space-x-2">
                <button
                  onClick={handleGenerateAudio}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Generate & Play Audio
                </button>
                {(audioUrl || isUsingFallback) && (
                  <>
                    <button
                      onClick={handlePlayAudio}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Play
                    </button>
                    <button
                      onClick={handlePauseAudio}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      Pause
                    </button>
                    <button
                      onClick={handleStop}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Stop
                    </button>
                  </>
                )}
              </div>

              {!isUsingFallback && audioUrl && (
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max={audioRef.current?.duration || 100}
                    value={currentTime}
                    onChange={handleSliderChange}
                    className="w-full"
                  />
                  <audio ref={audioRef} src={audioUrl} />
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Speed: {audioRef.current?.playbackRate || speechRef.current?.rate || 1}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={audioRef.current?.playbackRate || speechRef.current?.rate || 1}
                  onChange={handleRateChange}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TextReader;