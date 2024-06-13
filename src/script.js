import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// /**
//  * Spector JS
//  */
// const SPECTOR = require('spectorjs')
// const spector = new SPECTOR.Spector()
// spector.displayUI()

/**
 * Base
 */
// Debug
const gui = new GUI({
    width: 400
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Textures
 */
const bakedTexture = textureLoader.load('my-room-real-final-bake-merge-exclude-chair-2.jpg')
bakedTexture.flipY = false
bakedTexture.colorSpace = THREE.SRGBColorSpace

const chairTexture = textureLoader.load('chairs.jpg')
console.log('chairTexture',chairTexture)
chairTexture.flipY = false
chairTexture.colorSpace = THREE.SRGBColorSpace

/**
 * Materials
 */
// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })
const chairMaterial = new THREE.MeshBasicMaterial({ map: chairTexture })
const bakedMaterial2 = new THREE.MeshBasicMaterial({ color: 0xffffff  })

// Portal light material
const portalLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })

// Pole light material
const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 })
const light = new THREE.AmbientLight( 0xffffe5 );
scene.add(light);
// scene.add( light );
/**
 * Model
 */
gltfLoader.load(
    'my-room-real-final-bake-merge-exclude-chair.glb',
    (gltf) => {
        const bakedMesh = gltf.scene.children.find(child => child.name === 'materials')

        // const portalLightMesh = gltf.scene.children.find(child => child.name === 'portalLight')
        // const poleLightAMesh = gltf.scene.children.find(child => child.name === 'poleLightA')
        // const poleLightBMesh = gltf.scene.children.find(child => child.name === 'poleLightB')

        // bakedMesh.material = bakedMaterial
        gltf.scene.traverse((child) => {
            child.material = bakedMaterial
        })
        // portalLightMesh.material = portalLightMaterial
        // poleLightAMesh.material = poleLightMaterial
        // poleLightBMesh.material = poleLightMaterial
         gltf.scene.position.y = -3;
        scene.add(gltf.scene)
    }
)

gltfLoader.load(
    'chair.glb',
    (gltf) => {
        // const chairMesh = gltf.scene.children.find(child => child.name === 'materials')

        // const portalLightMesh = gltf.scene.children.find(child => child.name === 'portalLight')
        // const poleLightAMesh = gltf.scene.children.find(child => child.name === 'poleLightA')
        // const poleLightBMesh = gltf.scene.children.find(child => child.name === 'poleLightB')

        // bakedMesh.material = bakedMaterial
        gltf.scene.traverse((child) => {
            child.material = chairMaterial
        });

        gltf.scene.traverse((child) => {
          console.log('child mateiral', child.material);
        })
        // portalLightMesh.material = portalLightMaterial
        // poleLightAMesh.material = poleLightMaterial
        // poleLightBMesh.material = poleLightMaterial
         gltf.scene.position.y = -3;
        scene.add(gltf.scene)
    }
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 19
camera.position.y = 9
camera.position.z = 23
camera.zoom = 1.5
camera.updateProjectionMatrix()
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()