import React, { Component, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useLoader, useThree, useFrame, extend, ReactThreeFiber } from 'react-three-fiber';
import { CubeTextureLoader, Vector3 } from 'three';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

import MemoryObject from './MemoryObject';

extend({ FirstPersonControls, EffectComposer, BokehPass, RenderPass });

declare global {
    namespace JSX {
      interface IntrinsicElements {
        'firstPersonControls': ReactThreeFiber.Object3DNode<FirstPersonControls, typeof FirstPersonControls>;
        'effectComposer': ReactThreeFiber.Object3DNode<EffectComposer, typeof EffectComposer>;
        'bokehPass': ReactThreeFiber.Object3DNode<BokehPass, typeof BokehPass>;
        'renderPass': ReactThreeFiber.Object3DNode<RenderPass, typeof RenderPass>;
      }
    }
}

interface SceneState {
    isPlaying: boolean
}

function Wires() {
    const gltf = useLoader(GLTFLoader, 'assets/models/wires.glb');
    return (
      <primitive object={gltf.scene} position={[0, 0, 0]} scale={[5, 5, 5]} />
    );
}

function SkyBox() {
    const { scene } = useThree();
    const loader = new CubeTextureLoader();
    const texture = loader.load([
      'assets/images/water-dark.jpg',
      'assets/images/water-dark.jpg',
      'assets/images/water-dark.jpg',
      'assets/images/water-dark.jpg',
      'assets/images/water-dark.jpg',
      'assets/images/water-dark.jpg',
    ]);
    scene.background = texture;
    return null;
}

function CameraControls() {
    const {
      camera,
      size,
      gl: { domElement },
    } = useThree();
    const controls = useRef<FirstPersonControls>();
    useEffect(() => controls.current?.handleResize(), [size]);
    useFrame((state, delta) => controls.current?.update(delta));

    domElement.addEventListener('mouseleave', () => {
        if (controls.current) controls.current.enabled = false;
    });
    domElement.addEventListener('mouseenter', () => {
        if (controls.current) controls.current.enabled = true;
    });

    return (
        <firstPersonControls ref={controls} args={[camera, domElement]} movementSpeed={0.8} lookSpeed={0.1} />
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
};

class Scene extends Component {

    render() {
        return (
            <Canvas camera={{ position: [0, 0, 2] }}>
                {/* <SkyBox /> */}
                <CameraControls />
                <PostProcessing />
                <pointLight position={[5, 5, 5]} args={['#F2DBAE']} />
                <Suspense fallback={null}>
                    <Wires />
                    <MemoryObject meshPath='assets/models/crane.glb' position={new Vector3(0.1, 0.1, 0.1)} scale={new Vector3(0.1, 0.1, 0.1)} />
                </Suspense>
            </Canvas>
        );
    }
}

export default Scene;
