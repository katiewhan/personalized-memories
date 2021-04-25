import { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree, extend, ReactThreeFiber } from 'react-three-fiber';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { Vector2, Color, Object3D } from 'three';

extend({ EffectComposer, BokehPass, RenderPass, OutlinePass });

declare global {
    namespace JSX {
      interface IntrinsicElements {
        'effectComposer': ReactThreeFiber.Object3DNode<EffectComposer, typeof EffectComposer>;
        'bokehPass': ReactThreeFiber.Object3DNode<BokehPass, typeof BokehPass>;
        'renderPass': ReactThreeFiber.Object3DNode<RenderPass, typeof RenderPass>;
        // 'shaderPass': ReactThreeFiber.Object3DNode<ShaderPass, typeof ShaderPass>;
        'outlinePass': ReactThreeFiber.Object3DNode<OutlinePass, typeof OutlinePass>;
      }
    }
}

interface PostProcessingProps {
    selectedObjects: Object3D[];
    allObjects: Object3D[];
}

function PostProcessing(props: PostProcessingProps) {
    const { camera, scene, size, gl } = useThree();
    scene.background = new Color('#000000');
    const composer = useRef<EffectComposer>();
    const bokehParams = useMemo(() => ({ focus: 0.5, aperture: 0.005, maxblur: 0.002 }), []);
    const resolution = useMemo(() => new Vector2(size.width, size.height), [size]);

    useEffect(() => {
        composer.current?.setSize(size.width, size.height);
    }, [size]);
    useFrame(() => {
        composer.current?.render();
    }, 2);

    return (
        <effectComposer ref={composer} args={[gl]}>
            <renderPass attachArray='passes' scene={scene} camera={camera} />
            {/* <shaderPass attachArray='passes' args={[AdditiveBlendingShader]} uniforms-tAdd-value={occlusionRenderTarget.texture} /> */}
            <bokehPass attachArray='passes' args={[scene, camera, bokehParams]} />
            <outlinePass attachArray='passes' args={[resolution, scene, camera, props.allObjects]}/>
            <outlinePass attachArray='passes' args={[resolution, scene, camera, props.selectedObjects]} edgeThickness={4} edgeStrength={8}/>
        </effectComposer>
    );
}

export default PostProcessing;