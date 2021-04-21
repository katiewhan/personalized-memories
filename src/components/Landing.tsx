import { Component, createRef } from 'react';

declare global {
    interface Window {
      webkitAudioContext: typeof AudioContext;
    }
}

interface LandingProps {
    loaded: boolean;
    close: () => void;
}

interface LandingState {
    playing: boolean;
}

class Landing extends Component<LandingProps, LandingState> {
    private audio: HTMLAudioElement;
    private audioContext: AudioContext;
    private audioAnalyser: AnalyserNode;
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

        const bufferLength = this.audioAnalyser.frequencyBinCount;
        this.dataArray = new Uint8Array(bufferLength);
    }

    componentDidMount() {
        this.audio.addEventListener('ended', () => this.onEnded());
        this.audio.addEventListener('error', () => this.onEnded());

        this.updateAnimation();
    }

    componentDidUpdate() {
        this.canvasContext = this.canvasRef.current?.getContext('2d') || undefined;
    }

    componentWillUnmount() {
        this.audio.removeEventListener('ended', () => this.onEnded());
        this.audio.removeEventListener('error', () => this.onEnded());
    }

    onClickStart() {
        this.setState({ playing: true })
        this.audioContext.resume();
        this.audio.play();
    }

    onEnded() {
        this.setState({ playing: false });
        this.props.close();
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

            const sliceWidth = (width / 14) - 8;
            let x = 0;

            for (let i = 0; i < 14; i++) {
                const v = this.dataArray[i] / 128.0;
                const y = v * height * 0.5;

                this.drawRoundRect(x, height - y, sliceWidth, y, 10);
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
        return (
            <>
            <canvas ref={this.canvasRef} width={window.innerWidth / 4} height={window.innerHeight / 6}></canvas>
            <div className='powered-by'>Powered by Centillion.</div> 
            </>
        );
    }

    renderTitlePage() {
        return (
            <>
            <div className='title-wrapper'>
                <div className='title'>Personalized Memories</div>
                <div className='sub-title'>by Katie Han</div>
            </div>
            { this.props.loaded ? 
                <div className='button outline' onClick={this.onClickStart.bind(this)}>Start</div> : 
                <div className='outline'>Loading...</div> }
            </>
            );
    }

    render() {
        return (
            <div className='popup-wrapper'>
                { !this.state.playing ? this.renderTitlePage() : this.renderAudioAnimation() }
            </div>
        );
    }
}

export default Landing; 