import { useState } from 'react';

interface FooterProps {
    showTitle: boolean;
    allowAbout: boolean;
    triggerAbout: () => void;
}

function Footer(props: FooterProps) {
    const [showHelp, setShowHelp] = useState(false);
    const [read, setRead] = useState(false);
    const toggleShowHelp = () => {
        if (!read && showHelp) setRead(true);
        setShowHelp(!showHelp);
    };

    return (
        <>
        { showHelp ?
            <div className='footer-overlay outline noselect'>
                {read ? null : <div className='p-title'><strong>New Gift!</strong></div>}
                <p>Your mom sent you scans of your childhood memories.</p>
                <p>Click on each object to live and relive through the memories and witness how they transform over time.
                Headphones are recommended for optimal experience.</p>
            </div> : null }
        <div className='footer noselect'>
            <div className='footer-item'>
                { props.showTitle ? <div className='title'>Personalized Memories</div> : null }
            </div>
            <div className='footer-item'>
                <div className='icon-button' onClick={() => toggleShowHelp()}><img src={read ? 'assets/images/message.png' : 'assets/images/message-unread.png'} alt='help icon'></img></div>
                <div className='icon-button' onClick={() => props.triggerAbout()} title='About'><img src='assets/images/about.png' alt='info icon'></img></div>
            </div>
        </div>
        </>
    );
}

export default Footer;