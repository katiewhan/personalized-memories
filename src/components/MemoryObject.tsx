import { useState, useEffect } from 'react';
import { useLoader } from 'react-three-fiber';
import { Vector3 } from 'three';
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
    const [hovered, setHovered] = useState(false);
    const [count, setCount] = useState(1);
    const [hasUpdate, setHasUpdate] = useState(false);

    const onClick = () => {
        if (hasUpdate) setHasUpdate(false);

        if (count < 4) props.play(`${props.videoPath}-${count}`);
        setCount(count + 1);

        // timeout for update animation
    };

    useEffect(() => {
        document.body.style.cursor = hovered ? 'pointer' : 'auto';
    }, [hovered]);

    return (
        <primitive object={gltf.scene} 
            position={props.position} 
            scale={props.scale} 
            onClick={() => onClick()}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        />
    );
}

export default MemoryObject;
