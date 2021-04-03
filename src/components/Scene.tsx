import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useLoader, useThree, useFrame, extend, ReactThreeFiber } from 'react-three-fiber';
import { Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

import CameraControls from './CameraControls';
import MemoryObject from './MemoryObject';

extend({ EffectComposer, BokehPass, RenderPass });

declare global {
    namespace JSX {
      interface IntrinsicElements {
        'effectComposer': ReactThreeFiber.Object3DNode<EffectComposer, typeof EffectComposer>;
        'bokehPass': ReactThreeFiber.Object3DNode<BokehPass, typeof BokehPass>;
        'renderPass': ReactThreeFiber.Object3DNode<RenderPass, typeof RenderPass>;
      }
    }
}

function Wires() {
    const gltf = useLoader(GLTFLoader, 'assets/models/wires.glb');
    return (
      <primitive object={gltf.scene} position={[0, 0, 0]} scale={[5, 5, 5]} />
    );
}

function PostProcessing() {
    const { camera, scene, size, gl } = useThree();
    const composer = useRef<EffectComposer>();
    useEffect(() => composer.current?.setSize(size.width, size.height), [size]);
    useFrame(() => composer.current?.render(), 2);

    const params = useMemo(() => ({ focus: 0.5, aperture: 0.01, maxblur: 0.01 }), []);
    return (
        <effectComposer ref={composer} args={[gl]}>
            <renderPass attachArray='passes' scene={scene} camera={camera} />
            <bokehPass attachArray='passes' args={[scene, camera, params]} />
        </effectComposer>
    );
}

function Scene() {
    const [sceneEnabled, setSceneEnabled] = useState(true);
    const playVideo = (name: string) => {
        setSceneEnabled(false);
    };

    return (
        <Canvas camera={{ position: [0, 0, 2] }}>
            <CameraControls enabled={sceneEnabled} />
            <PostProcessing />
            <pointLight position={[5, 5, 5]} args={['#F2DBAE']} />
            <Suspense fallback={null}>
                <Wires />
                <MemoryObject meshPath='assets/models/crane.glb' 
                    videoPath='Origami' 
                    play={playVideo}
                    position={new Vector3(0.1, -0.1, 0.1)} 
                    scale={new Vector3(0.1, 0.1, 0.1)} />
            </Suspense>
        </Canvas>
    );
}

export default Scene;
