import { useState, useEffect } from 'react';
import { useLoader } from 'react-three-fiber';
import { Vector3, TextureLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface MemoryObjectProps {
    meshPath: string;
    videoPath: string;
    position: Vector3;
    scale: Vector3;
    play: (name: string) => void;
}

function MemoryObject(props: MemoryObjectProps) {
    const gltf = useLoader(GLTFLoader, props.meshPath);
    const texture = useLoader(TextureLoader, 'assets/images/update-message.png');

    const [hovered, setHovered] = useState(false);
    const [count, setCount] = useState(1);
    const [hasUpdate, setHasUpdate] = useState(false);

    const onClick = () => {
        if (hasUpdate) setHasUpdate(false);

        if (count < 4) props.play(`${props.videoPath}-${count}`);
        setCount(count + 1);

        setTimeout(() => setHasUpdate(true), 45000);
    };

    const renderSprite = () => {
        return (
            <sprite position={[0, 3, 0]} scale={[2.5, 2, 2]}>
                <spriteMaterial attach="material" map={texture} />
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
