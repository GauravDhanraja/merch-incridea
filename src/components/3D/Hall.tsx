import {useGLTF} from "@react-three/drei";

export default function Hall({ ...props }) {
    const { scene } = useGLTF('/models/hall-transformed.glb')
    return <primitive object={scene} {...props} />
}