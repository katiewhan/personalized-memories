import { useState } from 'react';

interface FooterProps {
    showTitle: boolean;
    allowAbout: boolean;
    triggerAbout: () => void;
}

function Footer(props: FooterProps) {
    const [showHelp, setShowHelp] = useState(false);
    const toggleShowHelp = () => setShowHelp(!showHelp);

    return (
        <>
        { showHelp ?
            <div className='footer-overlay outline'>
                You’ve received a gift from your mom containing scans of your childhood memories! 
                <br/><br/>
                Click on each object to play the memories and witness how they transform over time.
                Headphones are recommended for optimal experience.
            </div> : null }
        <div className='footer noselect'>
            <div className='footer-item'>
                { props.showTitle ? <div className='title'>Personalized Memories</div> : null }
            </div>
            <div className='footer-item'>
                <div className='icon-button' onClick={() => toggleShowHelp()} title='Help'><img src='assets/images/help.png' alt='help icon'></img></div>
                <div className='icon-button' onClick={() => props.triggerAbout()} title='About'><img src='assets/images/info.png' alt='info icon'></img></div>
            </div>
        </div>
        </>
    );
}

export default Footer;