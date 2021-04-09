import { useState, useEffect } from 'react';
import { useLoader } from 'react-three-fiber';
import { Vector3, TextureLoader, Object3D, Mesh, MeshStandardMaterial } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface MemoryObjectProps {
    meshPath: string;
    texturePath: string;
    videoPath: string;
    position: Vector3;
    scale: Vector3;
    play: (name: string) => void;
}

function isMesh(object: Object3D): object is Mesh {
    return object.type === 'Mesh';
}

function isMeshStandardMaterial(material: any): material is MeshStandardMaterial {
    return material.type === 'MeshStandardMaterial';
}

function MemoryObject(props: MemoryObjectProps) {
    const gltf = useLoader(GLTFLoader, props.meshPath);
    const message = useLoader(TextureLoader, 'assets/images/update-message.png');
    const texture = useLoader(TextureLoader, props.texturePath);
    texture.flipY = false;

    const [hovered, setHovered] = useState(false);
    const [count, setCount] = useState(0);
    const [hasUpdate, setHasUpdate] = useState(false);

    const onClick = () => {
        if (hasUpdate) setHasUpdate(false);

        const newCount = count + 1;
        if (newCount < 3) setTimeout(() => setHasUpdate(true), 45000);

        if (newCount === 3) {
            gltf.scene.traverse((object: Object3D) => {
                if (isMesh(object) && isMeshStandardMaterial(object.material)) {
                    object.material.map = texture;
                }
            });
        }

        if (newCount < 4) {
            props.play(`${props.videoPath}-${newCount}`);
        } else {
            // ending pop up
        }

        setCount(newCount);
    };

    const renderSprite = () => {
        return (
            <sprite position={[0, 3, 0]} scale={[2.5, 2, 2]}>
                <spriteMaterial attach="material" map={message} />
            </sprite>
        );
    }

    useEffect(() => {
        document.body.style.cursor = hovered ? 'pointer' : 'auto';
    }, [hovered]);

    return (
        <primitive object={gltf.scene} 
            position={props.position} 
            scale={props.scale} 
            onClick={() => onClick()}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}>
            {hasUpdate ? renderSprite() : null}
        </primitive>
    );
}

export default MemoryObject;
