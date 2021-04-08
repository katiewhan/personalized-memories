import React, { Component } from 'react';
import Scene from './components/Scene'
import MemoryPlayer from './components/MemoryPlayer';

import './App.css';

interface StoryState {
    isPlayingMemory: boolean;
    currentMemoryName: string;
}

class App extends Component<{}, StoryState> {
    private scene = React.createRef<Scene>();

    constructor (props: {}) {
        super(props);
        this.state = { isPlayingMemory: false, currentMemoryName: '' };
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
    }

    render() {
        return (
            <div className='wrapper'>
                {this.state.isPlayingMemory ? <MemoryPlayer name={this.state.currentMemoryName} endMemory={this.endMemory.bind(this)}/> : null}
                <Scene ref={this.scene} startMemory={this.startMemory.bind(this)}></Scene>
            </div>
        );
    }
}

export default App;
