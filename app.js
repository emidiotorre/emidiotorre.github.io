
			var SEPARATION = 50, AMOUNTX = 6, AMOUNTY = 6;

			var container, stats;

			var camera, controls, scene, renderer;

			var particles, particle, count = 0;

			var start = Date.now();

			var mouseX = 0, mouseY = 0;

			var windowHalfX = window.innerWidth / 2;

			var windowHalfY = window.innerHeight / 2;

			init();
			animate();

			function init() {

				var width = window.innerWidth || 2;
				var height = window.innerHeight || 2;

				container = document.createElement( 'div' );
				//container.classList.add('container')
				container.style.position = 'fixed';
				document.body.appendChild( container );
				var renderedContainer = document.querySelectorAll('.container');
				//var width = renderedContainer.offsetWidth;
				//var height = renderedContainer.offsetHeight;

				var info = document.createElement( 'div' );
				info.style.position = 'absolute';
				info.style.top = '10px';
				info.style.width = '100%';
				info.style.height = '100%';
				info.style.textAlign = 'center';



				container.appendChild(info);

				camera = new THREE.PerspectiveCamera( 35, width / height, 1, 1000 );
				camera.position.y = 150;
				camera.position.z = 500;


				scene = new THREE.Scene();

				particles = new Array();

				var light = new THREE.PointLight( 0xFFFFFF );
				light.position.set( 500, 500, 500 );
				scene.add( light );

				var light = new THREE.PointLight( 0xFFFFFF, 0.25 );
				light.position.set( - 500, - 500, - 500 );
				scene.add( light );

				var PI2 = Math.PI * 2;
				var material = new THREE.MeshLambertMaterial( { shading: THREE.FlatShading });

				var i = 0;

				for ( var ix = 0; ix < AMOUNTX; ix ++ ) {

					for ( var iy = 0; iy < AMOUNTY; iy ++ ) {

						particle = particles[ i ++ ] = new THREE.Mesh( new THREE.CubeGeometry( 10,10,10, 1,1,1), material );
						particle.position.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
						particle.position.z = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 );
						scene.add( particle );

					}

				}

				renderer = new THREE.CanvasRenderer();
				renderer.setSize( width, height );
				 //container.appendChild( renderer.domElement );

				effect = new THREE.AsciiEffect( renderer,undefined, {block: ''});
				effect.setSize( width, height );
				container.appendChild( effect.domElement );



				document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				document.addEventListener( 'touchstart', onDocumentTouchStart, false );
				document.addEventListener( 'touchmove', onDocumentTouchMove, false );

				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );
				effect.setSize( window.innerWidth, window.innerHeight );

			}

			//

			function onDocumentMouseMove( event ) {

				mouseX = event.clientX - windowHalfX;
				mouseY = event.clientY - windowHalfY;

			}

			function onDocumentTouchStart( event ) {

				if ( event.touches.length === 1 ) {

					event.preventDefault();

					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					mouseY = event.touches[ 0 ].pageY - windowHalfY;

				}

			}

			function onDocumentTouchMove( event ) {

				if ( event.touches.length === 1 ) {

					event.preventDefault();

					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					mouseY = event.touches[ 0 ].pageY - windowHalfY;

				}

			}

			function animate() {

				requestAnimationFrame( animate );

				render();


			}

			function render() {

				camera.position.x += ( mouseX - camera.position.x ) * .05;
				camera.position.y += ( - mouseY - camera.position.y ) * .05;
				camera.lookAt( scene.position );

				var i = 0;

				for ( var ix = 0; ix < AMOUNTX; ix ++ ) {

					for ( var iy = 0; iy < AMOUNTY; iy ++ ) {

						particle = particles[ i++ ];
						particle.position.y = ( Math.sin( ( ix + count ) * 0.3 ) * 50 ) +
							( Math.sin( ( iy + count ) * 0.5 ) * 50 );
						particle.scale.x = particle.scale.y = ( Math.sin( ( ix + count ) * 0.5 ) + 1 ) * 2 +
							( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 2;

					}

				}

				effect.render( scene, camera );

				count += 0.03;

			}
