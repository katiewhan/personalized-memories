interface EndingProps {
    name: string;
    fromClick: boolean;
    close: (more: boolean) => void;
}

function Ending(props: EndingProps) {
    // const memoryName = props.name.split('-')[0];
    return (
        <div className='popup-wrapper noselect'>
            <div className='x-button' onClick={() => props.close(false)}><img src='assets/images/x.png' alt='exit icon'></img></div>
            <div className='title-wrapper'>
                <div className='sub-title'>
                    <div><img src='assets/images/expired.png' alt='warning icon'></img></div>
                    <div><strong>{props.fromClick ? 'Your memory has expired.' : 'Your memory is about to expire.'}</strong></div>
                    {/* <div>{memoryName}</div> */}
                </div>
                <div className='sub-title'>For continued access to your memories, please subscribe to <div className='centillion'>Centillion Pro</div> at $199 / mo</div>
            </div>
            <div className='button accent' onClick={() => props.close(true)}>Learn more ⟶</div>
        </div>
    )
}

export default Ending;