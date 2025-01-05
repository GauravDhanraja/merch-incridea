import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing'

export function Effects() {
    return (
        (
            <EffectComposer disableNormalPass>
                <Bloom luminanceThreshold={0.5} mipmapBlur luminanceSmoothing={10} intensity={0.04} />
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
                <Noise opacity={0.02} />
            </EffectComposer>
        )
    )
}
