import React, { Component, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useLoader, useThree, useFrame, extend, ReactThreeFiber } from 'react-three-fiber';
import { Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// import AdditiveBlendingShader from '../shaders/AdditiveBlendingShader'
import CameraControls from './CameraControls';
import MemoryObject from './MemoryObject';

extend({ EffectComposer, BokehPass, RenderPass, ShaderPass, UnrealBloomPass });

declare global {
    namespace JSX {
      interface IntrinsicElements {
        'effectComposer': ReactThreeFiber.Object3DNode<EffectComposer, typeof EffectComposer>;
        'bokehPass': ReactThreeFiber.Object3DNode<BokehPass, typeof BokehPass>;
        'renderPass': ReactThreeFiber.Object3DNode<RenderPass, typeof RenderPass>;
        'shaderPass': ReactThreeFiber.Object3DNode<ShaderPass, typeof ShaderPass>;
        'unrealBloomPass': ReactThreeFiber.Object3DNode<UnrealBloomPass, typeof UnrealBloomPass>;
      }
    }
}

function Wires() {
    const gltf = useLoader(GLTFLoader, 'assets/models/wires.glb');
    return (
      <primitive object={gltf.scene} position={[0, 0, 0]} scale={[5, 5, 5] }/>
    );
}

function PostProcessing() {
    const { camera, scene, size, gl } = useThree();
    const composer = useRef<EffectComposer>();

    useEffect(() => {
        composer.current?.setSize(size.width, size.height);
    }, [size]);
    useFrame(() => {
        composer.current?.render();
    }, 2);

    const bokehParams = useMemo(() => ({ focus: 0.5, aperture: 0.005, maxblur: 0.002 }), []);

    return (
        <effectComposer ref={composer} args={[gl]}>
            <renderPass attachArray='passes' scene={scene} camera={camera} />
            {/* <shaderPass attachArray='passes' args={[AdditiveBlendingShader]} uniforms-tAdd-value={occlusionRenderTarget.texture} /> */}
            <bokehPass attachArray='passes' args={[scene, camera, bokehParams]} />
        </effectComposer>
    );
}

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

interface SceneState {
    enabled: boolean;
    hovered: boolean;
    loaded: boolean
}

interface SceneProps {
    startMemory: (name: string) => void;
}

class Scene extends Component<SceneProps, SceneState> {    
    constructor (props: SceneProps) {
        super(props);
        this.state = { enabled: true, hovered: true, loaded: false };
    }

    setSceneEnabled(enabled: boolean) {
        this.setState({ enabled });
    }

    setHovered(hovered: boolean) {
        this.setState({ hovered });
    }
    
    playMemory(name: string) {
        this.setSceneEnabled(false);
        this.props.startMemory(name);
    }

    finishLoading() {
        if (!this.state.loaded) this.setState({ loaded: true });
    }

    render() {
        return (
            <Canvas camera={{ position: [0, 0, 0] }}
                onMouseEnter={this.setHovered.bind(this, true)}
                onMouseLeave={this.setHovered.bind(this, false)}>
                <CameraControls enabled={this.state.enabled && this.state.hovered && this.state.loaded} />
                <PostProcessing />
                <pointLight position={[3, 3, 3]} args={['#F2DBAE']} />
                <pointLight position={[-3, -3, -3]} args={['#D0EFF2']} />
                <Suspense fallback={<Loading loadFinished={this.finishLoading.bind(this)}/>}>
                    <Wires />
                    <MemoryObject meshPath='assets/models/crane.glb' 
                        videoPath='Origami' 
                        play={this.playMemory.bind(this)}
                        position={new Vector3(0.8, -0.1, -0.5)} 
                        scale={new Vector3(0.1, 0.1, 0.1)} />
                    {/* <MemoryObject meshPath='assets/models/cloud.glb' 
                        videoPath='RoadTrip' 
                        play={this.playMemory.bind(this)}
                        position={new Vector3(-2, -0.4, 0.1)} 
                        scale={new Vector3(0.1, 0.1, 0.1)} />
                    <MemoryObject meshPath='assets/models/tennis.glb' 
                        videoPath='Tennis' 
                        play={this.playMemory.bind(this)}
                        position={new Vector3(1, -1, -1)} 
                        scale={new Vector3(0.1, 0.1, 0.1)} />
                    <MemoryObject meshPath='assets/models/beauty.glb' 
                        videoPath='Dog' 
                        play={this.playMemory.bind(this)}
                        position={new Vector3(0.5, 1.2, 2)} 
                        scale={new Vector3(0.05, 0.05, 0.05)} /> */}
                </Suspense>
            </Canvas>
        );
    }
}

export default Scene;
