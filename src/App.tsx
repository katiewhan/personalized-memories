import { Component, createRef } from 'react';
import Scene from './components/Scene'
import MemoryPlayer from './components/MemoryPlayer';

import ShareActivity, { ShareActivityType } from './components/ShareActivity';
import Landing from './components/Landing';
import Ending from './components/Ending';
import About from './components/About';

import './App.css';
import Footer from './components/Footer';

interface StoryState {
    isPlayingMemory: boolean;
    currentMemoryName: string;
    currentMemoryUrl: string;
    currentMemoryIncrement: () => void;
    isSharingActivity: boolean;
    currentActivity: ShareActivityType;
    isLandingPage: boolean;
    isAboutPage: boolean;
    isSceneLoaded: boolean;
    isSubscriptionPage: boolean;
}

class App extends Component<{}, StoryState> {
    private scene = createRef<Scene>();

    constructor (props: {}) {
        super(props);
        this.state = { 
            isPlayingMemory: false, 
            currentMemoryName: '', 
            currentMemoryUrl: '', 
            currentMemoryIncrement: () => {},
            isSharingActivity: false, 
            currentActivity: ShareActivityType.Photo, 
            isLandingPage: true,
            isAboutPage: false,
            isSceneLoaded: false,
            isSubscriptionPage: false
        };
    }

    startExperience() {
        this.setState({ isLandingPage: false });
        this.scene.current?.setSceneEnabled(true);
    }

    finishLoading() {
        if (!this.state.isSceneLoaded) this.setState({ isSceneLoaded: true });
    }

    startMemory(name: string, url: string, increment: () => void) {
        this.setState({
            isPlayingMemory: true,
            currentMemoryName: name,
            currentMemoryUrl: url,
            currentMemoryIncrement: increment
        });
        this.scene.current?.setSceneEnabled(false);
    }

    endMemory() {
        this.setState({ isPlayingMemory: false });
        this.scene.current?.setSceneEnabled(true);

        this.state.currentMemoryIncrement();

        if (this.state.currentMemoryName === 'Origami-2') {
            this.startActivity(ShareActivityType.Photo);
        }

        if (this.state.currentMemoryName === 'RoadTrip-2') {
            this.startActivity(ShareActivityType.Location);
        }
    }

    startActivity(type: ShareActivityType) {
        this.setState({ isSharingActivity: true, currentActivity: type });
        this.scene.current?.setSceneEnabled(false);
    }

    endActivity(shared: boolean) {
        if (!shared) {
            this.state.currentMemoryIncrement();
        }

        this.setState({ isSharingActivity: false });
        this.scene.current?.setSceneEnabled(true);
    }

    startSubscriptionPage() {
        this.setState({ isSubscriptionPage: true });
        this.scene.current?.setSceneEnabled(false);
    }

    endSubscriptionPage(more: boolean) {
        this.setState({ isSubscriptionPage: false });
        this.scene.current?.setSceneEnabled(true);
        
        if (more) {
            this.startAboutPage();
        }
    }

    startAboutPage() {
        this.setState({ isAboutPage: true });
        this.scene.current?.setSceneEnabled(false);
    }

    endAboutPage() {
        this.setState({ isAboutPage: false });
        this.scene.current?.setSceneEnabled(true);
    }

    render() {
        return (
            <div className='wrapper'>
                { this.state.isLandingPage ? <Landing loaded={this.state.isSceneLoaded} close={this.startExperience.bind(this)}></Landing> : null }
                { this.state.isAboutPage ? <About close={this.endAboutPage.bind(this)}></About> : null }
                { this.state.isSharingActivity ? <ShareActivity type={this.state.currentActivity} close={this.endActivity.bind(this)}></ShareActivity> : null }
                { this.state.isPlayingMemory ? <MemoryPlayer name={this.state.currentMemoryName} url={this.state.currentMemoryUrl} close={this.endMemory.bind(this)}/> : null }
                { this.state.isSubscriptionPage ? <Ending close={this.endSubscriptionPage.bind(this)}></Ending> : null }
                <Footer showTitle={!this.state.isLandingPage} allowAbout={true} triggerAbout={this.startAboutPage.bind(this)}></Footer>
                <Scene ref={this.scene} finishLoading={this.finishLoading.bind(this)} startMemory={this.startMemory.bind(this)} startSubscription={this.startSubscriptionPage.bind(this)}></Scene>
            </div>
        );
    }
}

export default App;
