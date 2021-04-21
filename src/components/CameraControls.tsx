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

    return (
        <firstPersonControls ref={controls} args={[camera, domElement]} enabled={props.enabled} movementSpeed={0.1} lookSpeed={0.02} />
    );
}

function Camera() {
  const {
    camera,
    size,
  } = useThree();
  camera.position.z = 0;

  // useEffect(() => {
  //     camera.aspect = size.width / size.height;
  // }, [size]);

  // const ref = useRef<PerspectiveCamera>();
  // const { size, setDefaultCamera } = useThree();
  // useEffect(() => {
  //   if (ref.current) {
  //     setDefaultCamera(ref.current);
  //     ref.current.aspect = size.width / size.height;
  //   }
  // }, [size, setDefaultCamera]);
  // useFrame(() => ref.current?.updateMatrixWorld());
  return ( null
      // <perspectiveCamera ref={ref} position={[0, 0, 0]} args={[80, size.width / size.height, 0.5, 2000]}>
      // </perspectiveCamera>
  );
}

export {Camera, CameraControls};