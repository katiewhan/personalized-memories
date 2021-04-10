import { Component } from 'react';

interface LandingProps {
    loaded: boolean;
    start: () => void;
}

interface LandingState {
    playing: boolean
}

class Landing extends Component<LandingProps, LandingState> {
    private audio: HTMLAudioElement;

    constructor(props: LandingProps) {
        super(props);
        this.state = { playing: false };
        this.audio = new Audio('https://personalized-memories.s3.amazonaws.com/videos/INTRO.wav');
    }

    componentDidMount() {
        this.audio.addEventListener('ended', () => this.props.start());
        this.audio.addEventListener('error', () => this.props.start());
    }

    componentWillUnmount() {
        this.audio.removeEventListener('ended', () => this.props.start());
        this.audio.removeEventListener('error', () => this.props.start());
    }

    onClickStart() {
        this.setState({ playing: true })
        this.audio.play();
    }

    renderTitlePage() {
        return (this.props.loaded ? 
            <div className='button outline' onClick={this.onClickStart.bind(this)}>Start</div> : 
            <div className='outline'>Loading...</div>);
    }

    render() {
        return (
            <div className='popup-wrapper'>
                <div>Personalized Memories</div>
                { !this.state.playing ? this.renderTitlePage() : <div>hello</div> }
            </div>
        );
    }
}

export default Landing; 