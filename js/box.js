var camera, scene, renderer;
			var mesh;
			init();
			animate();
			function init() {
				camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.position.z = 400;
				scene = new THREE.Scene();
				var geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
				var material = new THREE.MeshBasicMaterial();
				mesh = new THREE.Mesh( geometry, material );
				scene.add( mesh );
				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth * 0.98, window.innerHeight * 0.98);
				document.getElementById("box").appendChild( renderer.domElement );
				//
				window.addEventListener( 'resize', onWindowResize, false );
			}
			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth * 0.98, window.innerHeight * 0.98);
			}
			function animate() {
				requestAnimationFrame( animate );
				mesh.rotation.x += 0.005;
				mesh.rotation.y += 0.003;
				renderer.render( scene, camera );
			}