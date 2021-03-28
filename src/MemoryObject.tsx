import { useState, useEffect } from 'react';
import { useLoader } from 'react-three-fiber';
import { Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface MemoryObjectProps {
    meshPath: string;
    position: Vector3;
    scale: Vector3;
}

enum MemoryState {
    Idle,
    Playing,
    Updating,
    UpdateReady,
    Updated
}

function MemoryObject(props: MemoryObjectProps) {
    const gltf = useLoader(GLTFLoader, props.meshPath);
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        document.body.style.cursor = hovered ? 'pointer' : 'auto';
    }, [hovered]);

    return (
        <primitive object={gltf.scene} 
            position={props.position} 
            scale={props.scale} 
            onClick={() => console.log('click')}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        />
    );
}

export default MemoryObject;
