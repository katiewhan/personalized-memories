import { Component, Suspense, useEffect } from 'react';
import { Canvas, useLoader, useThree } from 'react-three-fiber';
import { Vector3, Object3D, Mesh, MeshStandardMaterial, Color } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import MemoryObject from './MemoryObject';
import PostProcessing from './PostProcessing';

function isMesh(object: Object3D): object is Mesh {
    return object.type === 'Mesh';
}

function isMeshStandardMaterial(material: any): material is MeshStandardMaterial {
    return material.type === 'MeshStandardMaterial';
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

function Camera() {
    const { camera, size, gl: { domElement } } = useThree();
    camera.position.z = 0;

    useEffect(() => {
        const onMouseMove = (event: MouseEvent) => {
            const mouseX = event.pageX - size.width / 2;
            const mouseY = event.pageY - size.height / 2;

            camera.position.x = mouseX * 0.000015;
            camera.position.y = mouseY * 0.000015;
        };
    
        domElement.addEventListener('mousemove', onMouseMove);
    }, [domElement, camera, size]);

    return null;
}  

function Wires() {
    const gltf = useLoader(GLTFLoader, 'assets/models/wires.glb');

    gltf.scene.traverse((object: Object3D) => {
        if (isMesh(object) && isMeshStandardMaterial(object.material)) {
            object.material.transparent = true;
            object.material.opacity = 0.5;
            object.material.color = new Color('black');
            object.material.roughness = 1;
            object.material.metalness = 0.5;
        }
    });

    return (
      <primitive object={gltf.scene} position={[0, 0, 0]} scale={[5, 5, 5] }/>
    );
}

interface SceneState {
    enabled: boolean;
    selectedObjects: Object3D[];
    allObjects: Object3D[];
}

interface SceneProps {
    startMemory: (name: string, url: string, increment: () => boolean) => void;
    startSubscription: () => void;
    finishLoading: () => void;
}

class Scene extends Component<SceneProps, SceneState> {    
    constructor (props: SceneProps) {
        super(props);
        this.state = { enabled: false, selectedObjects: [], allObjects: [] };
    }

    setSceneEnabled(enabled: boolean) {
        this.setState({ enabled });
    }

    registerObject(object: Object3D, flag: boolean) {
        let allObjects = [...this.state.allObjects];
        const index = allObjects.indexOf(object);
        if (flag && index < 0) {
            allObjects.push(object);
        } else if (!flag && index > -1) {
            allObjects.splice(index, 1);
        }
        this.setState({ allObjects: allObjects });
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
                <pointLight position={[0.5, 1, -2]} args={['#A2DEF8']} />
                <pointLight position={[-0.7, 0.5, 0]} args={['#F4EAD5']} />
                <pointLight position={[0, -1, -1]} args={['#F5DDAE']} />
                <PostProcessing selectedObjects={this.state.selectedObjects} allObjects={this.state.allObjects}/>
                <Suspense fallback={<Loading loadFinished={this.props.finishLoading.bind(this)}/>}>
                    <Wires />
                    <MemoryObject meshPath='assets/models/crane.glb' 
                        texturePath='assets/images/crane' 
                        videoPath='Origami' 
                        play={this.props.startMemory.bind(this)}
                        prompt={this.props.startSubscription.bind(this)}
                        hover={this.hoverMemory.bind(this)}
                        register={this.registerObject.bind(this)}
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
                        register={this.registerObject.bind(this)}
                        enabled={this.state.enabled}
                        totalNum={4}
                        position={new Vector3(-0.25, 0.35, -1)} 
                        scale={new Vector3(0.12, 0.12, 0.12)} />
                    <MemoryObject meshPath='assets/models/pan.glb' 
                        texturePath='assets/images/pan' 
                        videoPath='Dumpling' 
                        play={this.props.startMemory.bind(this)}
                        prompt={this.props.startSubscription.bind(this)}
                        register={this.registerObject.bind(this)}
                        hover={this.hoverMemory.bind(this)}
                        enabled={this.state.enabled}
                        totalNum={3}
                        position={new Vector3(-0.7, -0.21, -0.86)}
                        scale={new Vector3(0.1, 0.1, 0.1)} />
                </Suspense>
            </Canvas>
        );
    }
}

export { Scene, isMesh, isMeshStandardMaterial };
