import React, { Component } from 'react';
import Scene from './components/Scene'
import MemoryPlayer from './components/MemoryPlayer';

import './App.css';
import ShareActivity, { ShareActivityType } from './components/ShareActivity';

interface StoryState {
    isPlayingMemory: boolean;
    currentMemoryName: string;
    isSharingActivity: boolean;
    currentActivity: ShareActivityType;
}

class App extends Component<{}, StoryState> {
    private scene = React.createRef<Scene>();

    constructor (props: {}) {
        super(props);
        this.state = { isPlayingMemory: false, currentMemoryName: '', isSharingActivity: false, currentActivity: ShareActivityType.Photo };
    }

    startMemory(name: string) {
        this.setState({
            isPlayingMemory: true,
            currentMemoryName: name
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
                {this.state.isSharingActivity ? <ShareActivity type={this.state.currentActivity} close={this.endActivity.bind(this)}></ShareActivity> : null }
                {this.state.isPlayingMemory ? <MemoryPlayer name={this.state.currentMemoryName} endMemory={this.endMemory.bind(this)}/> : null}
                <Scene ref={this.scene} startMemory={this.startMemory.bind(this)}></Scene>
            </div>
        );
    }
}

export default App;
