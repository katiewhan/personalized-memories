import ReactPlayer from 'react-player';

interface MemoryPlayerProps {
    name: string;
    url: string;
    endMemory: () => void;
}

interface AdOverlay {
    link: string;
    imagePath?: string;
    progressSeconds?: number;
}

const AdOverlaysMap: { [name: string]: AdOverlay } = {
    'Origami-2': {
        link: 'https://www.michaels.com/',
        imagePath: 'assets/images/michaels.png'
    }
}

function MemoryPlayer(props: MemoryPlayerProps) {
    return (
        <div className='popup-wrapper'>
            <ReactPlayer url={props.url} 
                playing={true}
                onError={props.endMemory}
                onEnded={props.endMemory}
                width='100%'
                height='auto'
                style={{'display': 'flex', 'minWidth': '100%', 'minHeight': '100%'}}
            />
        </div>
    );
}

export default MemoryPlayer;