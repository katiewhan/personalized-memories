import ReactPlayer from 'react-player';

import '../styles/MemoryPlayer.css';

interface MemoryPlayerProps {
    name: string;
    endMemory: () => void;
}

function MemoryPlayer(props: MemoryPlayerProps) {
    return (
        <div className='popup-wrapper'>
            <ReactPlayer url={`https://personalized-memories.s3.amazonaws.com/videos/${props.name}.mp4`} 
                playing={true}
                onEnded={props.endMemory}
                width='100%'
                height='auto'
                style={{'display': 'flex', 'objectFit': 'fill'}}
            />
        </div>
    );
}

export default MemoryPlayer;