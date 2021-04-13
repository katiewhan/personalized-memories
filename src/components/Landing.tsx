import { Component, createRef } from 'react';

declare global {
    interface Window {
      webkitAudioContext: typeof AudioContext;
    }
}

interface LandingProps {
    loaded: boolean;
    start: () => void;
}

interface LandingState {
    playing: boolean;
}

class Landing extends Component<LandingProps, LandingState> {
    private audio: HTMLAudioElement;
    private audioContext: AudioContext;
    private audioAnalyser: AnalyserNode;
    private bufferLength: number;
    private dataArray: Uint8Array;
    private canvasRef = createRef<HTMLCanvasElement>();
    private canvasContext?: CanvasRenderingContext2D;

    constructor(props: LandingProps) {
        super(props);
        this.state = { playing: false };
        this.audio = new Audio('https://personalized-memories.s3.amazonaws.com/videos/INTRO.wav');
        this.audio.crossOrigin = 'anonymous';

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();
        this.audioAnalyser = this.audioContext.createAnalyser();
        this.audioAnalyser.fftSize = 32;

        const track = this.audioContext.createMediaElementSource(this.audio);
        track.connect(this.audioAnalyser);
        this.audioAnalyser.connect(this.audioContext.destination);
        this.audioContext.resume();

        this.bufferLength = this.audioAnalyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
    }

    componentDidMount() {
        this.audio.addEventListener('ended', () => this.props.start());
        this.audio.addEventListener('error', () => this.props.start());

        this.updateAnimation();
    }

    componentDidUpdate() {
        this.canvasContext = this.canvasRef.current?.getContext('2d') || undefined;
    }

    componentWillUnmount() {
        this.audio.removeEventListener('ended', () => this.props.start());
        this.audio.removeEventListener('error', () => this.props.start());
    }

    onClickStart() {
        this.setState({ playing: true })
        this.audio.play();
    }

    updateAnimation() {
        requestAnimationFrame(this.updateAnimation.bind(this));
        this.audioAnalyser.getByteFrequencyData(this.dataArray);

        if (this.canvasContext && this.state.playing) {
            this.canvasContext.lineWidth = 2;
            this.canvasContext.strokeStyle = 'rgb(255, 255, 255)';

            const width = this.canvasRef.current?.width || 0;
            const height = this.canvasRef.current?.height || 0;
            this.canvasContext.clearRect(0, 0, width, height);

            const sliceWidth = width * 0.5 / this.bufferLength;
            let x = 0;

            for (let i = 0; i < this.bufferLength; i++) {
                const v = this.dataArray[i] / 128.0;
                const y = v * height * 0.5;

                this.drawRoundRect(x, height - y, sliceWidth, y, 8);
                x += sliceWidth + 8;
            }
        } 
    }

    drawRoundRect(x: number, y: number, width: number, height: number, radius: number) {
        if (!this.canvasContext) return;

        if (width < 2 * radius) radius = width / 2;
        if (height < 2 * radius) radius = height / 2;

        this.canvasContext.beginPath();
        this.canvasContext.moveTo(x + radius, y);
        this.canvasContext.arcTo(x + width, y, x + width, y + height, radius);
        this.canvasContext.arcTo(x + width, y + height, x, y + height, radius);
        this.canvasContext.arcTo(x, y + height, x, y, radius);
        this.canvasContext.arcTo(x, y, x + width, y, radius);
        this.canvasContext.closePath();

        this.canvasContext.stroke();
    }

    renderAudioAnimation() {
        return <canvas ref={this.canvasRef} width={window.innerWidth / 4} height={window.innerHeight / 6}></canvas>
    }

    renderTitlePage() {
        return (this.props.loaded ? 
            <div className='button outline' onClick={this.onClickStart.bind(this)}>Start</div> : 
            <div className='outline'>Loading...</div>);
    }

    render() {
        return (
            <div className='popup-wrapper'>
                <div className='title'>Personalized Memories</div>
                { !this.state.playing ? this.renderTitlePage() : this.renderAudioAnimation() }
            </div>
        );
    }
}

export default Landing; 