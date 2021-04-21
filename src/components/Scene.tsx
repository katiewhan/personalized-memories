import { Component, Suspense, useEffect } from 'react';
import { Canvas, useLoader, useThree } from 'react-three-fiber';
import { Vector3, Object3D } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

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

function Camera() {
    const { camera } = useThree();
    camera.position.z = 0;
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
        this.state = { enabled: false, selectedObjects: [] };
    }

    setSceneEnabled(enabled: boolean) {
        this.setState({ enabled });
    }
    
    hoverMemory(object: Object3D, hovered: boolean) {
        const hoverActive = hovered && this.state.enabled;
        document.body.style.cursor = hoverActive ? 'pointer' : 'auto';

        if (hoverActive) this.setState({ selectedObjects: [object] });
        else this.setState({ selectedObjects: [] });
    }

    render() {
        return (
            <Canvas>
                <Camera />
                <pointLight position={[0, 0.5, -0.5]} args={['#F2DBAE']} />
                <PostProcessing selectedObjects={this.state.selectedObjects} />
                <Suspense fallback={<Loading loadFinished={this.props.finishLoading.bind(this)}/>}>
                    <Wires />
                    <MemoryObject meshPath='assets/models/crane.glb' 
                        texturePath='assets/images/crane' 
                        videoPath='Origami' 
                        play={this.props.startMemory.bind(this)}
                        prompt={this.props.startSubscription.bind(this)}
                        hover={this.hoverMemory.bind(this)}
                        enabled={this.state.enabled}
                        totalNum={4}
                        position={new Vector3(0.7, -0.4, -1)} 
                        scale={new Vector3(0.1, 0.1, 0.1)} />
                    <MemoryObject meshPath='assets/models/cloud.glb' 
                        texturePath='assets/images/cloud' 
                        videoPath='RoadTrip' 
                        play={this.props.startMemory.bind(this)}
                        prompt={this.props.startSubscription.bind(this)}
                        hover={this.hoverMemory.bind(this)}
                        enabled={this.state.enabled}
                        totalNum={4}
                        position={new Vector3(-0.3, 0.35, -1.1)} 
                        scale={new Vector3(0.05, 0.05, 0.05)} />
                    <MemoryObject meshPath='assets/models/pan.glb' 
                        texturePath='assets/images/pan' 
                        videoPath='Dumpling' 
                        play={this.props.startMemory.bind(this)}
                        prompt={this.props.startSubscription.bind(this)}
                        hover={this.hoverMemory.bind(this)}
                        enabled={this.state.enabled}
                        totalNum={3}
                        position={new Vector3(-0.65, -0.2, -0.9)}       
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
