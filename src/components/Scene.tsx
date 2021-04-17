import { Component, Suspense, useEffect } from 'react';
import { Canvas, useLoader } from 'react-three-fiber';
import { Vector3, Object3D } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { Camera, CameraControls } from './CameraControls';
import MemoryObject from './MemoryObject';
import PostProcessing from './PostProcessing';

interface LoadingProps {
    loadFinished: () => void;
}

function Loading(props: LoadingProps) {
    useEffect(() => {
        // clean up function
        return () => {
            props.loadFinished();
        }
    });
    return null;
}

function Wires() {
    const gltf = useLoader(GLTFLoader, 'assets/models/wires.glb');
    return (
      <primitive object={gltf.scene} position={[0, 0, 0]} scale={[5, 5, 5] }/>
    );
}

interface SceneState {
    enabled: boolean;
    hovered: boolean;
    selectedObjects: Object3D[];
}

interface SceneProps {
    startMemory: (name: string, url: string, increment: () => void) => void;
    startSubscription: () => void;
    finishLoading: () => void;
}

class Scene extends Component<SceneProps, SceneState> {    
    constructor (props: SceneProps) {
        super(props);
        this.state = { enabled: false, hovered: true, selectedObjects: [] };
    }

    setSceneEnabled(enabled: boolean) {
        this.setState({ enabled });
    }

    setHovered(hovered: boolean) {
        this.setState({ hovered });
    }
    
    hoverMemory(object: Object3D, hovered: boolean) {
        if (hovered) this.setState({ selectedObjects: [object] });
        else this.setState({ selectedObjects: [] });
    }

    render() {
        return (
            <Canvas
                onMouseOver={this.setHovered.bind(this, true)}
                onMouseOut={this.setHovered.bind(this, false)}>
                <Camera />
                <CameraControls enabled={this.state.enabled && this.state.hovered} />
                <PostProcessing selectedObjects={this.state.selectedObjects} />
                <Suspense fallback={<Loading loadFinished={this.props.finishLoading.bind(this)}/>}>
                    <Wires />
                    <MemoryObject meshPath='assets/models/crane.glb' 
                        texturePath='assets/images/crane-tex.png' 
                        videoPath='Origami' 
                        play={this.props.startMemory.bind(this)}
                        prompt={this.props.startSubscription.bind(this)}
                        hover={this.hoverMemory.bind(this)}
                        enabled={this.state.enabled}
                        position={new Vector3(0.5, -0.5, -0.5)} 
                        scale={new Vector3(0.1, 0.1, 0.1)} />
                    <MemoryObject meshPath='assets/models/cloud.glb' 
                        texturePath='assets/images/cloud-tex.png' 
                        videoPath='RoadTrip' 
                        play={this.props.startMemory.bind(this)}
                        prompt={this.props.startSubscription.bind(this)}
                        hover={this.hoverMemory.bind(this)}
                        enabled={this.state.enabled}
                        position={new Vector3(-0.5, 0.3, 0.4)} 
                        scale={new Vector3(0.03, 0.03, 0.03)} />
                    <MemoryObject meshPath='assets/models/pan.glb' 
                        texturePath='assets/images/pan-tex.png' 
                        videoPath='Dumpling' 
                        play={this.props.startMemory.bind(this)}
                        prompt={this.props.startSubscription.bind(this)}
                        hover={this.hoverMemory.bind(this)}
                        enabled={this.state.enabled}
                        position={new Vector3(0.5, -0.1, 0.5)} 
                        scale={new Vector3(0.1, 0.1, 0.1)} />
                    {/* <MemoryObject meshPath='assets/models/beauty.glb'
                        texturePath='assets/images/beauty-tex.png' 
                        videoPath='Dog' 
                        play={this.props.startMemory.bind(this)}
                        prompt={this.props.startSubscription.bind(this)}
                        hover={this.hoverMemory.bind(this)}
                        enabled={this.state.enabled}
                        position={new Vector3(-0.5, -0.5, 0.5)} 
                        scale={new Vector3(0.05, 0.05, 0.05)} /> */}
                </Suspense>
            </Canvas>
        );
    }
}

export default Scene;
