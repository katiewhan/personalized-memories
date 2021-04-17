interface AboutProps {
    close: () => void;
}

function About(props: AboutProps) {
    return (
        <div className='popup-wrapper'>
            <div className='x-button' onClick={props.close}><img src='assets/images/x.png' alt='exit button'></img></div>
            <div className='sub-title'>About the project</div>
        </div>
    )
}

export default About;