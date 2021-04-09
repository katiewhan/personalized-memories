import { Component } from 'react';

export enum ShareActivityType {
    Photo = 'photos'
}

interface ShareActivityProps {
    type: ShareActivityType;
    close: () => void;
}

class ShareActivity extends Component<ShareActivityProps> {
    constructor(props: ShareActivityProps) {
        super(props);
    }

    onButtonClick() {
        this.props.close();
    }

    renderContents() {
        return (
            <div className='share-content-wrapper'>
                <img className='share-content' src="assets/images/share-1.jpg" alt='ipad with apple pencil'></img>
                <img className='share-content' src="assets/images/share-2.jpg" alt='man drawing on ipad with apple pencil'></img>
                <img className='share-content' src="assets/images/share-3.jpg" alt='woman drawing on ipad with apple pencil'></img>
            </div>
        );
    }

    render() {
        return (
            <div className='popup-wrapper'>
                <div>Share your recent {this.props.type} with your mom!</div>
                {this.renderContents()}
                <div className='share-content-footer'>
                    <div className='button' onClick={this.onButtonClick.bind(this)}>No thanks</div>
                    <div className='button outline' onClick={this.onButtonClick.bind(this)}>Share</div>
                </div>
            </div>
        );
    }
}

export default ShareActivity;