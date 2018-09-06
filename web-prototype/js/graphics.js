var container = document.getElementById('canvas-container');/*
var containerStyle = getComputedStyle(container, null);
var canvasHeight = parseInt(containerStyle.getPropertyValue('height'));
var canvasWidth = parseInt(contaierStyle.getPropertyValue('width'));*/

var camera, scene, renderer;
var width = window.innerWidth;
var height = window.innerWidth;
var mesh;
init();
animate();
function init() {
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight*.8, 1, 1000 );
	camera.position.z = 400;
	scene = new THREE.Scene();
	var texture = new THREE.TextureLoader().load( 'textures/crate.gif' );
	var geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
	var material = new THREE.MeshBasicMaterial();
	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	
	//document.body.appendChild( renderer.domElement );
	
	renderer.setSize( window.innerWidth*.55, 500)
	//renderer.setSize(container.innerWidth*.80, container.innerHeight*.8);
	container.appendChild(renderer.domElement);

	window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
	//camera.aspect = window.innerWidth / window.innerHeight;
	//camera.updateProjectionMatrix();
	//renderer.setSize( window.innerWidth, window.innerHeight);
}
function animate() {
	requestAnimationFrame( animate );
	mesh.rotation.x += 0.005;
	mesh.rotation.y += 0.01;
	renderer.render( scene, camera );
}

