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
    play: (name: string) => void;
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

    constructor(props: MemoryObjectProps) {
        super(props);
        this.state = { count: 0, hasUpdate: false };
    }
    
    async componentDidMount() {
        this.gltf = await new GLTFLoader().loadAsync(this.props.meshPath);

        const textureLoader = new TextureLoader();
        this.message = await textureLoader.loadAsync('assets/images/update-message.png');
        this.texture = await textureLoader.loadAsync(this.props.texturePath);
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
            this.props.play(`${this.props.videoPath}-${newCount}`);
        } else {
            // ending pop up
        }

        this.setState({ count: newCount });
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
            <primitive object={this.gltf?.scene} 
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
