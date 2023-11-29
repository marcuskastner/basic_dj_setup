import React, { ChangeEvent } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { AudioAnalyzer } from "./lib/audio-analyzer";
import Visualizer from "./Visualizer";

function App() {
  const [analyzer, setAnalyzer] = React.useState<AudioAnalyzer | null>(null);
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null);
  const audioElmRef = React.useRef<HTMLAudioElement>(null!);

  function connectAudioAPI() {
    try {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then(function (stream) {
          const newAnalyzer = new AudioAnalyzer();
          setAnalyzer(newAnalyzer.analyzeAudio(stream));
        })
        .catch(function (err) {
          alert(err);
        });
    } catch (e) {
      alert(e);
    }
  }

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAudioUrl(URL.createObjectURL(file));
    const newAnalyzer = new AudioAnalyzer();
    setAnalyzer(newAnalyzer.analyzeMedia(audioElmRef.current));
  };

  return (
    <div>
      <Canvas
        style={{
          width: "100vw",
          height: "calc(100vh - 80px)",
          backgroundColor: "black",
        }}
      >
        <OrbitControls />
        {analyzer && <Visualizer analyzer={analyzer} lineWidth={0.08} />}
      </Canvas>
      <div
        style={{
          height: 80,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <input type="file" accept="audio/*" onChange={onFileChange} />
        <audio src={audioUrl ?? ""} controls ref={audioElmRef} />
        <button onClick={connectAudioAPI}>Use Microphone</button>
      </div>
    </div>
  );
}

export default App;
