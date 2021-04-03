import { useRef, useEffect } from 'react';
import { useFrame, useThree, extend, ReactThreeFiber } from 'react-three-fiber';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';

extend({ FirstPersonControls });

declare global {
    namespace JSX {
      interface IntrinsicElements {
        'firstPersonControls': ReactThreeFiber.Object3DNode<FirstPersonControls, typeof FirstPersonControls>;
      }
    }
}

interface CameraControlsProps {
    enabled: boolean;
}

function CameraControls(props: CameraControlsProps) {
    const {
      camera,
      size,
      gl: { domElement },
    } = useThree();
    const controls = useRef<FirstPersonControls>();

    useEffect(() => controls.current?.handleResize(), [size]);
    useFrame((state, delta) => controls.current?.update(delta));

    domElement.addEventListener('mouseleave', () => {
        if (controls.current && props.enabled) controls.current.enabled = false;
    });
    domElement.addEventListener('mouseenter', () => {
        if (controls.current && props.enabled) controls.current.enabled = true;
    });

    return (
        <firstPersonControls ref={controls} args={[camera, domElement]} enabled={props.enabled} movementSpeed={0.8} lookSpeed={0.01} />
    );
}

export default CameraControls;