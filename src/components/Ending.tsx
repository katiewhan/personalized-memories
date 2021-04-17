interface EndingProps {
    close: (more: boolean) => void;
}

function Ending(props: EndingProps) {
    return (
        <div className='popup-wrapper'>
            <div className='x-button' onClick={() => props.close(false)}><img src='assets/images/x.png' alt='exit button'></img></div>
            <div className='sub-title'>Memory replay limit exceeded</div>
            <div className='sub-title'>For continued access to your memories, please subscribe to Centillion Premium at $199/mo</div>
            <div className='button outline' onClick={() => props.close(true)}>Learn more</div>
        </div>
    )
}

export default Ending;