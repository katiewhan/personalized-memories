import { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree, extend, ReactThreeFiber } from 'react-three-fiber';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
// import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

extend({ EffectComposer, BokehPass, RenderPass });

declare global {
    namespace JSX {
      interface IntrinsicElements {
        'effectComposer': ReactThreeFiber.Object3DNode<EffectComposer, typeof EffectComposer>;
        'bokehPass': ReactThreeFiber.Object3DNode<BokehPass, typeof BokehPass>;
        'renderPass': ReactThreeFiber.Object3DNode<RenderPass, typeof RenderPass>;
        // 'shaderPass': ReactThreeFiber.Object3DNode<ShaderPass, typeof ShaderPass>;
        // 'unrealBloomPass': ReactThreeFiber.Object3DNode<UnrealBloomPass, typeof UnrealBloomPass>;
      }
    }
}

function PostProcessing() {
    const { camera, scene, size, gl } = useThree();
    const composer = useRef<EffectComposer>();
    const bokehParams = useMemo(() => ({ focus: 0.5, aperture: 0.005, maxblur: 0.002 }), []);

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
        </effectComposer>
    );
}

export default PostProcessing;