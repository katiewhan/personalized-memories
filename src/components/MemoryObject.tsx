import { Component, useEffect } from 'react';
import { useFrame, useLoader } from 'react-three-fiber';
import { Vector3, Texture, TextureLoader, Object3D } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { isMesh, isMeshStandardMaterial } from './Scene';

interface PrimitiveObjectProps {
    mesh: string;
    texture: string;
    position: Vector3;
    scale: Vector3;
    spinning: boolean;
    onClick: () => void;
    hover: (object: Object3D, hovered: boolean) => void;
    register: (object: Object3D, flag: boolean) => void;
}

function PrimitiveObject(props: PrimitiveObjectProps) {
    const gltf = useLoader(GLTFLoader, props.mesh);
    const tex = useLoader(TextureLoader, props.texture);
    gltf.scene.traverse((object: Object3D) => {
        if (isMesh(object) && isMeshStandardMaterial(object.material)) {
            tex.flipY = false;
            object.material.roughness = 0.8;
            object.material.metalness = 0.3;
            object.material.map = tex;
        }
    });

    useEffect(() => props.register(gltf.scene, props.spinning), [props.spinning, gltf.scene]);

    useFrame(() => {
        if (props.spinning) gltf.scene.rotateY(0.005);
    });

    const setHovered = (hovered: boolean) => {
        if (props.spinning) props.hover(gltf.scene, hovered);
    };

    return (
        <primitive object={gltf.scene} 
            position={props.position} 
            scale={props.scale} 
            onClick={props.onClick}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}>
        </primitive>
    );
}

interface MemoryObjectProps {
    meshPath: string;
    texturePath: string;
    videoPath: string;
    position: Vector3;
    scale: Vector3;
    enabled: boolean;
    totalNum: number;
    play: (name: string, url: string, increment: () => boolean) => void;
    prompt: () => void;
    hover: (object: Object3D, hovered: boolean) => void;
    register: (object: Object3D, flag: boolean) => void;
}

interface MemoryObjectState {
    count: number;
    hasUpdate: boolean;
    isSpinning: boolean;
    currentTexturePath: string;
}

class MemoryObject extends Component<MemoryObjectProps, MemoryObjectState> {
    private message?: Texture;
    private messageAudio: HTMLAudioElement;
    private memoryCache: Map<string, string> = new Map();
    private updateTimeout?: number;

    constructor(props: MemoryObjectProps) {
        super(props);
        this.messageAudio = new Audio('assets/sounds/alert.mp3');
        this.state = { count: 1, hasUpdate: false, isSpinning: true, currentTexturePath: this.props.texturePath + '.png' };
    }
    
    componentDidMount() {
        const textureLoader = new TextureLoader();
        textureLoader.load('assets/images/updated.png', (message) => this.message = message);

        this.preloadMemory(this.state.count + 1);
    }

    componentWillUnmount() {
        this.memoryCache.clear();
    }

    onClick() {
        if (!this.props.enabled || !this.state.isSpinning) return;

        if (this.updateTimeout) {
            window.clearTimeout(this.updateTimeout);
            this.updateTimeout = undefined;
        }

        this.setState({ hasUpdate: false });

        if (this.state.count < this.props.totalNum) {
            const name = `${this.props.videoPath}-${this.state.count}`;
            const url = this.memoryCache.get(name) || `https://personalized-memories.s3.amazonaws.com/videos/${name}.mp4`;
            this.props.play(name, url, this.increaseCount.bind(this));

            this.preloadMemory(this.state.count + 1);
        } else {
            this.props.prompt();
        }
    }

    increaseCount() {
        let promptSubscription = false;

        if (this.updateTimeout) {
            window.clearTimeout(this.updateTimeout);
            this.updateTimeout = undefined;
        }

        const newCount = this.state.count + 1;

        if (newCount === this.props.totalNum) {
            this.setState({ hasUpdate: false, isSpinning: false, currentTexturePath: this.props.texturePath + '-tex.png' });
            promptSubscription = true;
        } else if (newCount < this.props.totalNum) {
            this.updateTimeout = window.setTimeout(() => {
                this.setState({ hasUpdate: true });
                this.messageAudio.play();
                this.updateTimeout = undefined;
            }, 600);
        }

        this.setState({ count: newCount });
        return promptSubscription;
    }

    preloadMemory(nextCount: number) {
        const name = `${this.props.videoPath}-${nextCount}`;
        const url = `https://personalized-memories.s3.amazonaws.com/videos/${name}.mp4`;
        fetch(url).then((response) => {
            return response.blob();
        }).then((blob) => {
            const blobUrl = window.URL.createObjectURL(blob);
            this.memoryCache.set(name, blobUrl);
        })
    }

    renderSprite() {
        const spritePos = new Vector3(this.props.position.x, this.props.position.y + 0.3, this.props.position.z);
        return (
            <sprite position={spritePos} scale={[0.354, 0.23, 1]} renderOrder={9}>
                <spriteMaterial attach='material' map={this.message} depthTest={false}/>
            </sprite>
        );
    }

    render() {
        return (
            <>
            <PrimitiveObject mesh={this.props.meshPath} 
                texture={this.state.currentTexturePath}
                position={this.props.position} 
                scale={this.props.scale}
                spinning={this.state.isSpinning}
                onClick={this.onClick.bind(this)}
                hover={this.props.hover} 
                register={this.props.register} />
            {this.state.hasUpdate ? this.renderSprite() : null}
            </>
        );
    }
}

export default MemoryObject;
