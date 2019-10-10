import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { LuminosityShader } from 'three/examples/jsm/shaders/LuminosityShader.js';
import { SobelOperatorShader } from 'three/examples/jsm/shaders/SobelOperatorShader.js';
var camera, scene, renderer, composer;
var camera, scene, renderer, composer;
var effectSobel;
var mesh;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var mouseX = 0, mouseY = 0;
var params = {
    enable: true
};

export function init() {
    //
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 0, 10, 15 );
    camera.lookAt( scene.position );
    //
    const radius = 22;
    const tubeRadius = 4;
    const radialSegments = 64;
    const tubularSegments = 64;
    const geometry = new THREE.TorusBufferGeometry(radius, tubeRadius, radialSegments, tubularSegments);
    
    var material = new THREE.MeshPhongMaterial( { color: 0xfdfdfd } );
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
    //
    var ambientLight = new THREE.AmbientLight( 0xffffff, 0.992 );
    scene.add( ambientLight );
    //var pointLight = new THREE.PointLight( 0xffffee, 0.9 );
    //camera.add( pointLight );
    scene.add( camera );
    //
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    
    document.body.appendChild( renderer.domElement );
    // postprocessing
    composer = new EffectComposer( renderer );
    var renderPass = new RenderPass( scene, camera );
    composer.addPass( renderPass );
    // color to grayscale conversion
    var effectGrayScale = new ShaderPass( LuminosityShader );
    //composer.addPass( effectGrayScale );
    // you might want to use a gaussian blur filter before
    // the next pass to improve the result of the Sobel operator
    // Sobel operator
    effectSobel = new ShaderPass( SobelOperatorShader );
    effectSobel.uniforms[ 'resolution' ].value.x = window.innerWidth * window.devicePixelRatio;
    effectSobel.uniforms[ 'resolution' ].value.y = window.innerHeight * window.devicePixelRatio;
    //composer.addPass( effectSobel );
    //var controls = new OrbitControls( camera, renderer.domElement );
    //
    //var gui = new GUI();
    //gui.add( params, 'enable' );
    //gui.open();
    //
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

    window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    composer.setSize( window.innerWidth, window.innerHeight );
    effectSobel.uniforms[ 'resolution' ].value.x = window.innerWidth * window.devicePixelRatio;
    effectSobel.uniforms[ 'resolution' ].value.y = window.innerHeight * window.devicePixelRatio;
}

function onDocumentMouseMove( event ) {
    mouseX = ( event.clientX - windowHalfX ) * 10;
    mouseY = ( event.clientY - windowHalfY ) * 10;
}
export function animate() {
    requestAnimationFrame( animate );
    render()
}

function render() {
    var time = Date.now() * 0.001;
    var rx = Math.sin( time * 0.7 ) * 0.2;
    var ry = Math.sin( time * 0.3 ) * 0.1;
    var rz = Math.sin( time * 0.2 ) * 0.1;

    //camera.position.x += ( mouseX - camera.position.x ) * 0.05;
    //camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
    camera.position.x = ( - mouseX * 0.0005 );
    camera.position.y = ( mouseY * 0.0005 );
    camera.lookAt( scene.position );

    mesh.rotation.x = rx;
    mesh.rotation.y = ry;
    mesh.rotation.z = rz;
    

    if ( params.enable === true ) {
        composer.render();
    } else {
        renderer.render( scene, camera );
    }
}