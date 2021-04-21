import { Component, createRef } from 'react';

interface AdOverlay {
    link: string;
    timestamp: number;
    imagePath?: string;
    style?: {
        left?: string;
        top?: string;
        right?: string;
        bottom?: string;
    };
}

const AdOverlaysMap: { [name: string]: AdOverlay } = {
    'Origami-2': {
        link: 'https://www.michaels.com/',
        timestamp: 16,
        imagePath: 'assets/images/michaels.png',
        style: {
            left: '50px',
            top: '50px'
        }
    },
    'Origami-3': {
        link: 'https://apps.apple.com/us/app/pigment-adult-coloring-book/id1062006344',
        timestamp: 13
    },
    'RoadTrip-2': {
        link: 'https://www.carvana.com/',
        timestamp: 15,
        imagePath: 'assets/images/carvana.png',
        style: {
            right: '150px',
            bottom: '50px'
        }
    },
    'RoadTrip-3': {
        link: 'https://www.sixt.com/',
        timestamp: 19
    },
    'Dumpling-2': {
        link: 'https://www.ubereats.com/',
        timestamp: 17
    },
}

interface MemoryPlayerProps {
    name: string;
    url: string;
    close: () => void;
}

interface MemoryPlayerState {
    showAdOverlay: boolean;
}

class MemoryPlayer extends Component<MemoryPlayerProps, MemoryPlayerState> {
    private adSettings?: AdOverlay;
    private videoRef = createRef<HTMLVideoElement>();

    constructor(props: MemoryPlayerProps) {
        super(props);
        this.state = { showAdOverlay: false };
        this.adSettings = AdOverlaysMap[this.props.name];
    }

    componentDidMount() {
        this.videoRef.current?.addEventListener('ended', () => this.props.close());
        this.videoRef.current?.addEventListener('error', () => this.props.close());
        this.videoRef.current?.addEventListener('timeupdate', () => this.onTimeUpdate());
    }

    componentWillUnmount() {
        this.videoRef.current?.removeEventListener('ended', () => this.props.close());
        this.videoRef.current?.removeEventListener('error', () => this.props.close());
        this.videoRef.current?.removeEventListener('timeupdate', () => this.onTimeUpdate());
    }

    onTimeUpdate() {
        if (!this.adSettings || this.state.showAdOverlay || !this.videoRef.current) return;

        if (this.videoRef.current.currentTime > this.adSettings.timestamp) {
            this.setState({ showAdOverlay: true });
        }
    }

    isFullAd() {
        return this.adSettings && !this.adSettings.imagePath;
    }

    isFullAdActive() {
        return this.state.showAdOverlay && !this.adSettings?.imagePath;
    }

    isPartialAdActive() {
        return this.state.showAdOverlay && this.adSettings?.imagePath;
    }

    renderVideo() {
        return (
            <video ref={this.videoRef} src={this.props.url} preload='auto' autoPlay></video>
        );
    }

    render() {
        return (
            <div className={ this.isFullAdActive() ? 'popup-wrapper ad-wrapper-jk' : 'popup-wrapper' }>
                { this.isPartialAdActive() ? 
                    <a className='ad-overlay-jk' 
                        style={this.adSettings?.style} 
                        href={this.adSettings?.link} 
                        target='_blank' 
                        rel='noopener noreferrer'>
                        <img className='ad-jk' src={this.adSettings?.imagePath} alt='advertisement'></img>
                    </a> : null }
                { this.isFullAd() ? 
                    <a className='video-wrapper' 
                        href={this.isFullAdActive() ? this.adSettings?.link : undefined} 
                        target='_blank' 
                        rel='noopener noreferrer'>
                        {this.renderVideo()}
                    </a> : 
                    <div className='video-wrapper'>
                        {this.renderVideo()}
                    </div> }
            </div>
        );
    }
}

export default MemoryPlayer;