import { useState, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export default function VoiceInput({ onResult, fieldLabel }) {
  const { t } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  const isSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const startRecording = () => {
    if (!isSupported) {
      setError(t('voiceUnsupported'));
      return;
    }

    setError('');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';

    recognition.onstart = () => setIsRecording(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onResult) onResult(transcript);
      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      if (event.error === 'not-allowed') {
        setError('Microphone access denied.');
      }
    };

    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  return (
    <div>
      <button
        type="button"
        className={`voice-btn${isRecording ? ' recording' : ''}`}
        onClick={isRecording ? stopRecording : startRecording}
        title={isRecording ? 'Stop recording' : t('voicePrompt')}
      >
        {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
      </button>
      {error && <div className="form-error" style={{ marginTop: 4 }}>{error}</div>}
    </div>
  );
}
