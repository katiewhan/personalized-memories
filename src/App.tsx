import React, { Component } from 'react';
import Scene from './components/Scene'
import MemoryPlayer from './components/MemoryPlayer';

import ShareActivity, { ShareActivityType } from './components/ShareActivity';
import Landing from './components/Landing';

import './App.css';

interface StoryState {
    isPlayingMemory: boolean;
    currentMemoryName: string;
    currentMemoryUrl: string;
    isSharingActivity: boolean;
    currentActivity: ShareActivityType;
    isLandingPage: boolean;
    isSceneLoaded: boolean;
}

class App extends Component<{}, StoryState> {
    private scene = React.createRef<Scene>();

    constructor (props: {}) {
        super(props);
        this.state = { 
            isPlayingMemory: false, 
            currentMemoryName: '', 
            currentMemoryUrl: '', 
            isSharingActivity: false, 
            currentActivity: ShareActivityType.Photo, 
            isLandingPage: true,
            isSceneLoaded: false
        };
    }

    startExperience() {
        this.setState({ isLandingPage: false });
        this.scene.current?.setSceneEnabled(true);
    }

    finishLoading() {
        if (!this.state.isSceneLoaded) this.setState({ isSceneLoaded: true });
    }

    startMemory(name: string, url: string) {
        this.setState({
            isPlayingMemory: true,
            currentMemoryName: name,
            currentMemoryUrl: url
        });
    }

    endMemory() {
        this.setState({ isPlayingMemory: false });
        this.scene.current?.setSceneEnabled(true);

        if (this.state.currentMemoryName === 'Origami-2') {
            this.startActivity(ShareActivityType.Photo);
        }
    }

    startActivity(type: ShareActivityType) {
        this.setState({ isSharingActivity: true, currentActivity: type });
        this.scene.current?.setSceneEnabled(false);
    }

    endActivity() {
        this.setState({ isSharingActivity: false });
        this.scene.current?.setSceneEnabled(true);
    }

    render() {
        return (
            <div className='wrapper'>
                { this.state.isLandingPage ? <Landing loaded={this.state.isSceneLoaded} start={this.startExperience.bind(this)}></Landing>: null }
                { this.state.isSharingActivity ? <ShareActivity type={this.state.currentActivity} close={this.endActivity.bind(this)}></ShareActivity> : null }
                { this.state.isPlayingMemory ? <MemoryPlayer name={this.state.currentMemoryName} url={this.state.currentMemoryUrl} endMemory={this.endMemory.bind(this)}/> : null }
                <Scene ref={this.scene} finishLoading={this.finishLoading.bind(this)} startMemory={this.startMemory.bind(this)}></Scene>
            </div>
        );
    }
}

export default App;
