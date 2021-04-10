import ReactPlayer from 'react-player';

import '../styles/MemoryPlayer.css';

interface MemoryPlayerProps {
    name: string;
    url: string;
    endMemory: () => void;
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
                style={{'display': 'flex', 'objectFit': 'fill'}}
            />
        </div>
    );
}

export default MemoryPlayer;