interface AboutProps {
    close: () => void;
}

function About(props: AboutProps) {
    return (
        <div className='popup-wrapper priority'>
            <div className='x-button' onClick={props.close}><img src='assets/images/x.png' alt='exit icon'></img></div>
            <div className='about'>
                <div className='p-title'>
                    <em>Personalized Memories</em> is an interactive, non-linear fictional storytelling experience by <a href='https://www.katiewhan.com/' target='_blank' rel='noopener noreferrer'>Katie Han</a>. 
                    The semi-autobiographical narrative puts the viewer in the shoes of the main character, 
                    Jung, a daughter of Asian American immigrant parents. Throughout the experience, 
                    Jung’s childhood memories slowly morph to deliver advertisements in the voice of her mother.
                </div>
                <div className='p-title'>
                    As a critique of surveillance capitalism, which extracts monetary value from human experiences 
                    at the cost of the individuals’ privacy, it points at the unsettling reality and the urgency with which we as a society must tackle it.
                    In many ways, this project is an amalgamation of <a href='https://shoshanazuboff.com/book/about/' target='_blank' rel='noopener noreferrer'>Shoshana Zuboff</a>’s 
                    research on surveillance capitalism and <a href='https://kenliu.name/blog/book/the-paper-menagerie-and-other-stories/' target='_blank' rel='noopener noreferrer'>Ken Liu</a>’s 
                    inspirational short stories. By sharing her narratives through the critical lens of a tech ethicist, 
                    Katie hopes to encourage viewers to think more deeply about the tech landscape that we are currently living in.
                </div>
                <div className='p-title'>
                    Special thanks to Nancy Hechinger, Dana Elkis, Mia Rovegno, and ‘the sis’ crew for their generous feedback, guidance, and emotional support. 
                    This project would not have been possible without the help of Leona Khong, Young Chen, and Jimmy Xia.
                </div>
                <div className='p-title'>
                    Dedicated to James and Erin. Hoping for a better future.
                </div>
            </div>
        </div>
    )
}

export default About;