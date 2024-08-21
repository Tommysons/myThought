import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'


/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const foodTexture = textureLoader.load('/textures/particles/food.jpg')
const fourTwentyTexture = textureLoader.load('/textures/particles/420.jpg')
const womanTexture = textureLoader.load('/textures/particles/woman.png')
/**
 * Test cube
 */

//Particles
//foodGeometry
const foodGeometry = new THREE.BufferGeometry()
const count = 5000
const foodPositions = new Float32Array(count  * 3)
const foodColors = new Float32Array(count * 3)
//womanGeometry
const womanGeometry = new THREE.BufferGeometry()
const woamnPositions = new Float32Array(count * 3)
const womanColors = new Float32Array(count * 3)
//forTwentyGeometry
const fourTwentyGeometry = new THREE.BufferGeometry()
const fourTwentyPositions = new Float32Array(count * 3)
const fourTwentyColors = new Float32Array(count * 3)
for (let i = 0; i < count * 3; i++)
{
    foodPositions[i] = (Math.random() - 0.5) * 10
    foodColors[i] = Math.random()
    woamnPositions[i] = (Math.random() - 0.5) * 10
    womanColors[i] = Math.random()
    fourTwentyPositions[i] = (Math.random() - 0.5) * 10
    fourTwentyColors[i] = Math.random()
}
//foodGeometry bufferAttribute
foodGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(foodPositions, 3)
)
foodGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(foodColors, 3)
)
//womanGeometry bufferAttribute
womanGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(woamnPositions, 3)
)
womanGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(womanColors, 3)
)

//forTwenty bufferAttribute
fourTwentyGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(fourTwentyPositions, 3)
)
fourTwentyGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(fourTwentyColors, 3)
)
//foodMaterial
const foodMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true
})
foodMaterial.transparent = true
foodMaterial.alphaMap = foodTexture
foodMaterial.depthWrite = false
foodMaterial.blending = THREE.AdditiveBlending
foodMaterial.vertexColors = true

const foods = new THREE.Points(foodGeometry, foodMaterial)

//womanMaterial
const womanMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true

})
womanMaterial.transparent = true
womanMaterial.alphaMap = womanTexture
womanMaterial.depthWrite = false
womanMaterial.blending = THREE.AdditiveBlending
womanMaterial.vertexColors = true

const woman = new THREE.Points(womanGeometry, womanMaterial)

//forTwentyMaterial

const fourTwentyMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true
})
fourTwentyMaterial.transparent= true
fourTwentyMaterial.alphaMap = fourTwentyTexture
fourTwentyMaterial.depthWrite = false
fourTwentyMaterial.blending = THREE.AdditiveBlending
fourTwentyMaterial.vertexColors = true
const fourTwenty = new THREE.Points(fourTwentyGeometry, fourTwentyMaterial)
scene.add(foods, woman, fourTwenty)



//scene.add(woman)





//scene.add(fourTwenty)
//const cube = new THREE.Mesh(
    //new THREE.BoxGeometry(1, 1, 1),
    //new THREE.MeshBasicMaterial()
//)
//scene.add(cube)

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
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
    for(let i = 0; i< count; i++){
        const i3 = i * 3
        
        const foodGeometryPosition = foodGeometry.attributes.position.array[i3]
        foodGeometry.attributes.position.array[i3 + 2] = Math.sin((elapsedTime * 0.3 )+ foodGeometryPosition)
        const womanGeometryPosition = womanGeometry.attributes.position.array[i3]
        womanGeometry.attributes.position.array[i3 + 1] =  - Math.cos((elapsedTime * 0.3) + womanGeometryPosition)
        const forTwentyGeometryPosition = fourTwentyGeometry.attributes.position.array[i3]
        fourTwentyGeometry.attributes.position.array[i3 + 3] = Math.sin((elapsedTime * 0.01) + forTwentyGeometryPosition)
        fourTwenty.rotation.z = elapsedTime * 0.2
        //fourTwenty.position.z = elapsedTime * 0.2
        
    }
    foodGeometry.attributes.position.needsUpdate = true
    womanGeometry.attributes.position.needsUpdate = true
    fourTwentyGeometry.attributes.position.needsUpdate = true
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()