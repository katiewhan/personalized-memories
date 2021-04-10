import { Component } from 'react';
import { Vector3, Texture, TextureLoader, Object3D, Mesh, MeshStandardMaterial } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface MemoryObjectProps {
    meshPath: string;
    texturePath: string;
    videoPath: string;
    position: Vector3;
    scale: Vector3;
    enabled: boolean;
    play: (name: string, url: string) => void;
}

interface MemoryObjectState {
    count: number;
    hasUpdate: boolean;
}

function isMesh(object: Object3D): object is Mesh {
    return object.type === 'Mesh';
}

function isMeshStandardMaterial(material: any): material is MeshStandardMaterial {
    return material.type === 'MeshStandardMaterial';
}

class MemoryObject extends Component<MemoryObjectProps, MemoryObjectState> {
    private gltf?: GLTF;
    private message?: Texture;
    private texture?: Texture;
    private memoryCache: Map<string, string> = new Map();

    constructor(props: MemoryObjectProps) {
        super(props);
        this.state = { count: 0, hasUpdate: false };
    }
    
    componentDidMount() {
        new GLTFLoader().load(this.props.meshPath, (gltf) => this.gltf = gltf);

        const textureLoader = new TextureLoader();
        textureLoader.load('assets/images/update-message.png', (message) => this.message = message);
        textureLoader.load(this.props.texturePath, (texture) => this.texture = texture);

        this.preloadMemory(this.state.count + 1);
    }

    componentWillUnmount() {
        this.memoryCache.clear();
    }

    setHovered(hovered: boolean) {
        document.body.style.cursor = hovered ? 'pointer' : 'auto';
    }

    onClick() {
        if (!this.props.enabled) return;

        if (this.state.hasUpdate) this.setState({ hasUpdate: false });

        const newCount = this.state.count + 1;
        if (newCount < 3) setTimeout(() => this.setState({ hasUpdate: true }), 60000);

        if (newCount === 3) {
            this.gltf?.scene.traverse((object: Object3D) => {
                if (isMesh(object) && isMeshStandardMaterial(object.material) && this.texture) {
                    object.material.map = this.texture;
                }
            });
        }

        if (newCount < 4) {
            const name = `${this.props.videoPath}-${newCount}`;
            const url = this.memoryCache.get(name) || `https://personalized-memories.s3.amazonaws.com/videos/${name}.mp4`;
            this.props.play(name, url);

            this.preloadMemory(newCount + 1);
        } else {
            // ending pop up
        }

        this.setState({ count: newCount });
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
        return (
            <sprite position={[0, 3, 0]} scale={[2.5, 2, 2]}>
                <spriteMaterial attach="material" map={this.message} />
            </sprite>
        );
    }

    render() {
        return this.gltf ? (
            <primitive object={this.gltf.scene} 
                position={this.props.position} 
                scale={this.props.scale} 
                onClick={this.onClick.bind(this)}
                onPointerOver={this.setHovered.bind(this, true)}
                onPointerOut={this.setHovered.bind(this, false)}>
                {this.state.hasUpdate ? this.renderSprite() : null}
            </primitive>
        ) : null;
    }
}

export default MemoryObject;
