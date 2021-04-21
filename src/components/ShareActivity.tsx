import { Component } from 'react';

export enum ShareActivityType {
    Photo = 'photos',
    Location = 'trip destination'
}

interface ShareActivityProps {
    type: ShareActivityType;
    close: (shared: boolean) => void;
}

const LocationsList = [
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14910.215814644926!2d-121.86522924778153!3d36.61169009499007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808de45f0ee8e01b%3A0xeef63ab6bf9a2e34!2sMonterey%20State%20Beach!5e0!3m2!1sen!2sus!4v1618018471787!5m2!1sen!2sus',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d198182.65236798907!2d-120.18505100859836!3d39.092718242032845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x809978a1b91f1151%3A0x8c3f1fafeeafb520!2sLake%20Tahoe!5e0!3m2!1sen!2sus!4v1618017846586!5m2!1sen!2sus'
]

class ShareActivity extends Component<ShareActivityProps> {
    onShare() {
        this.props.close(true);
    }

    onNoThanks() {
        this.props.close(false);
    }

    renderContents() {
        switch (this.props.type) {
            case ShareActivityType.Photo:
                return (
                    <div className='share-content-wrapper'>
                        <img className='share-content-3' src='assets/images/share-1.jpg' alt='ipad with apple pencil'></img>
                        <img className='share-content-3' src='assets/images/share-2.jpg' alt='man drawing on ipad with apple pencil'></img>
                        <img className='share-content-3' src='assets/images/share-3.jpg' alt='woman drawing on ipad with apple pencil'></img>
                    </div>
                );
            case ShareActivityType.Location:
                const url = LocationsList[Math.round(Math.random())]
                return (
                    <div className='share-content-wrapper'>
                        <iframe title='map' width='100%' height='100%' style={{'border': 0}} allowFullScreen={false} loading='lazy' src={url}></iframe>
                    </div>
                );
        }
    }

    render() {
        return (
            <div className='popup-wrapper noselect'>
                <div className='sub-title'>Share your recent {this.props.type} with your mom!</div>
                {this.renderContents()}
                <div className='share-content-footer'>
                    <div className='button' onClick={this.onNoThanks.bind(this)}>No thanks</div>
                    <div className='button outline' onClick={this.onShare.bind(this)}>Share</div>
                </div>
                <div className='powered-by'>Powered by Centillion.</div> 
            </div>
        );
    }
}

export default ShareActivity;