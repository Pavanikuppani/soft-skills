import { useState, useRef, useCallback } from "react";

const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  const supported = "webkitSpeechRecognition" in window || "SpeechRecognition" in window;

  const startListening = useCallback(() => {
    if (!supported) {
      setError("Speech recognition not supported. Use Chrome.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let full = "";
      for (let i = 0; i < event.results.length; i++) full += event.results[i][0].transcript;
      setTranscript(full);
    };
    recognition.onerror = (event) => { setError(`Speech error: ${event.error}`); setIsListening(false); };
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    setError(null);
  }, [supported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) { recognitionRef.current.stop(); setIsListening(false); }
  }, []);

  const resetTranscript = useCallback(() => { setTranscript(""); setError(null); }, []);

  return { isListening, transcript, error, supported, startListening, stopListening, resetTranscript };
};

export default useSpeechRecognition;
