import ReactPlayer from 'react-player';

import '../styles/MemoryPlayer.css';

interface MemoryPlayerProps {
    name: string
}

function MemoryPlayer(props: MemoryPlayerProps) {
    return (
        <div className='player-wrapper'>
            <ReactPlayer url={`https://personalized-memories.s3.amazonaws.com/videos/${props.name}.mp4`} 
                playing={true}
                width='94%'
                height='auto'
                style={{'display': 'flex', 'maxHeight': '94%', 'maxWidth': '94%'}}
            />
        </div>
    );
}

export default MemoryPlayer;