export class AudioAnalyzer {
  #ctx: AudioContext;
  #analyzerNode: AnalyserNode;

  constructor() {
    this.#ctx = new AudioContext();
    this.#analyzerNode = this.#ctx.createAnalyser();
  }

  analyzeMedia(audioElement: HTMLAudioElement): AudioAnalyzer {
    let sourceNode: MediaElementAudioSourceNode;

    sourceNode = this.#ctx.createMediaElementSource(audioElement);

    this.#analyzerNode.minDecibels = -60;
    this.#analyzerNode.smoothingTimeConstant = 0.8;

    sourceNode.connect(this.#analyzerNode);
    sourceNode.connect(this.#ctx.destination);

    return this;
  }

  analyzeAudio(stream: any) {
    this.#analyzerNode.fftSize = 2048;
    let sourceNode;

    sourceNode = this.#ctx.createMediaStreamSource(stream);
    sourceNode.connect(this.#analyzerNode);

    return this;
  }

  getFFT(): Uint8Array {
    const data = new Uint8Array(this.#analyzerNode.frequencyBinCount);
    this.#analyzerNode.getByteFrequencyData(data);
    return data;
  }
}
