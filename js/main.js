var camera, scene, renderer;
var effect, controls;
var element, container;

var clock = new THREE.Clock();

var spheres = [];
const sphereNum = 20; // 浮き上がる球の個数
const speedRange = 1.0; // 浮き上がる球の速さの範囲
const xRange = 60;
const yRange = 40;
const zRange = 60;

var fishes = [];
var fishSpeed = 0.2; // 魚の動く速さ

const red = new THREE.Color(0xff0000);
const green = new THREE.Color(0x00ff00);
const blue = new THREE.Color(0x0000ff);
const cyan = new THREE.Color(0x00ffff);
const magenta = new THREE.Color(0xff00ff);
const yellow = new THREE.Color(0xffff00);
const white = new THREE.Color(0xffffff);
const black = new THREE.Color(0x000000);

function init() {
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x78cfff);
    element = renderer.domElement;
    container = document.getElementById('example');
    container.appendChild(element);

    //effect = new THREE.StereoEffect(renderer);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(90, 1, 0.01, 100);
    camera.position.set(0, 15, 0);
    scene.add(camera);

    controls = new THREE.OrbitControls(camera, element);
    controls.rotateUp(Math.PI / 4);
    controls.target.set(
      camera.position.x + 0.1,
      camera.position.y,
      camera.position.z
    );
    controls.noZoom = true;
    controls.noPan = true;

    function setOrientationControls(e) {
      if (!e.alpha) {
        return;
      }

      controls = new THREE.DeviceOrientationControls(camera, true);
      controls.connect();
      controls.update();

      element.addEventListener('click', fullscreen, false);

      window.removeEventListener('deviceorientation', setOrientationControls, true);
    }
    window.addEventListener('deviceorientation', setOrientationControls, true);


    var light = new THREE.HemisphereLight(0x777777, 0x000000, 0.8);
    scene.add(light);

    // add plane with texture
    var texture = THREE.ImageUtils.loadTexture(
        'textures/water.jpg'
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat = new THREE.Vector2(50, 50);
    texture.anisotropy = renderer.getMaxAnisotropy();
    var material = new THREE.MeshPhongMaterial({
      specular: 0x00ffff,
      shininess: 20,
      map: texture
    });
    var geometry = new THREE.PlaneGeometry(1000, 1000);
    var planeMesh = new THREE.Mesh(geometry, material);
    planeMesh.rotation.x = -Math.PI / 2;
    scene.add(planeMesh);
 
    /*
    var axis = new THREE.AxisHelper(1000);
    scene.add(axis);
    */

    // add spheres (bubbles)
    var sphereGeometry = new THREE.SphereGeometry(1.5);
    var sphereMaterial = new THREE.MeshBasicMaterial({color: 0x1199bb});
    sphereMaterial.opacity = 0.6;
    sphereMaterial.transparent = true;
    for(var i=0; i<sphereNum; i++) {
	var sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
	var spherePosition = setSpherePosition();
        sphereMesh.position.set(spherePosition.x, spherePosition.y, spherePosition.z);
        sphereMesh.userData.speed = setSphereSpeed();
        scene.add(sphereMesh);
        spheres.push(sphereMesh);
    }

    function setSpherePosition() {
        var posX = decideSymbol()*Math.random()*xRange;
        var posY = -1*Math.random()*yRange;
        var posZ = decideSymbol()*Math.random()*zRange;
        return new THREE.Vector3(posX, posY, posZ);

        function decideSymbol() {
	    if(Math.random() > 0.5) {
	        return 1;
	    }
	    return -1;
        }
    }

    function setSphereSpeed() {
        return Math.random()*speedRange+0.2; // offset
    }

    // add glasses
    loader = new THREE.JSONLoader();
    loader.load('model/glassA.json', function(geometry) {
	var material = new THREE.MeshBasicMaterial({color: 0x339966});
	for(var i=0; i<10; i++) {
	    var mesh = new THREE.Mesh(geometry, material);
	    mesh.scale.set(0.7, 0.7, 0.7); 
	    mesh.position.set(-50+10*i, 5, -70+Math.random()*140);
	    scene.add(mesh);
	}
    });

    loader.load('model/glassB.json', function(geometry) {
	var material = new THREE.MeshBasicMaterial({color: 0x11bb44});
	for(var i=0; i<10; i++) {
	    var mesh = new THREE.Mesh(geometry, material);
	    mesh.scale.set(0.7, 0.7, 0.7);
	    mesh.position.set(-70+Math.random()*140, 5, -50+10*i);
	    scene.add(mesh);
	}
    });

    window.addEventListener('resize', resize, false);
    setTimeout(resize, 1);
}

function addFishAX(pointX, pointY, pointZ, myScale, myColor) {
    if(!myScale) {
	myScale = 1.0;
    }
    if(!myColor) {
	myColor = new THREE.Color(0x00ffff*Math.random());
    }

    loader = new THREE.JSONLoader();
    loader.load('model/fishA.json', function(geometry) {
	var material = new THREE.MeshBasicMaterial();
	var mesh = new THREE.Mesh(geometry, material);
	mesh.material.color = myColor;
	mesh.position.set(pointX, pointY, pointZ);
	mesh.scale.set(1.5*myScale, 1.5*myScale, 1.5*myScale);
	mesh.userData.direction = 'X';
	if(pointX > 0) {
	    mesh.userData.speed = -1*fishSpeed;
	    mesh.rotation.set(0, -Math.PI/2, 0);
	}
	else {
   	    mesh.userData.speed = fishSpeed;
	    mesh.rotation.set(0, Math.PI/2, 0);
	}
	scene.add(mesh);
	fishes.push(mesh);
    });
}

function addFishAZ(pointX, pointY, pointZ, myScale, myColor) {
    if(!myScale) {
	myScale = 1.0;
    }
    if(!myColor) {
	myColor = new THREE.Color(0x00ffff*Math.random());
    }

    loader = new THREE.JSONLoader();
    loader.load('model/fishA.json', function(geometry) {
	var material = new THREE.MeshBasicMaterial();
	var mesh = new THREE.Mesh(geometry, material);
	mesh.material.color = myColor;
	mesh.position.set(pointX, pointY, pointZ);
	mesh.scale.set(1.5*myScale, 1.5*myScale, 1.5*myScale);
	mesh.userData.direction = 'Z';
	if(pointZ > 0) {
	    mesh.userData.speed = -1*fishSpeed;
	    mesh.rotation.set(Math.PI, 0, 0);
	}
	else {
	    mesh.userData.speed = fishSpeed;
	}
	scene.add(mesh);
	fishes.push(mesh);
    });
}

function addFishBX(pointX, pointY, pointZ, myScale, myColor) {
    if(!myScale) {
	myScale = 1.0;
    }
    if(!myColor) {
	myColor = new THREE.Color(0x00ffff*Math.random());
    }

    loader = new THREE.JSONLoader();
    loader.load('model/fishB.json', function(geometry) {
	var material = new THREE.MeshBasicMaterial();
	var mesh = new THREE.Mesh(geometry, material);
	mesh.material.color = myColor;
	mesh.position.set(pointX, pointY, pointZ);
	mesh.scale.set(0.2*myScale, 0.2*myScale, 0.2*myScale);
	mesh.userData.direction = 'X';
	if(pointX > 0) {
	    mesh.userData.speed = -1*fishSpeed;
	    mesh.rotation.set(0, -Math.PI/2, 0);
	}
	else {
   	    mesh.userData.speed = fishSpeed;
	    mesh.rotation.set(0, Math.PI/2, 0);
	}
	scene.add(mesh);
	fishes.push(mesh);
    });
}

function addFishBZ(pointX, pointY, pointZ, myScale, myColor) {
    if(!myScale) {
	myScale = 1.0;
    }
    if(!myColor) {
	myColor = new THREE.Color(0x00ffff*Math.random());
    }

    loader = new THREE.JSONLoader();
    loader.load('model/fishB.json', function(geometry) {
	var material = new THREE.MeshBasicMaterial();
	var mesh = new THREE.Mesh(geometry, material);
	mesh.material.color = myColor;
	mesh.position.set(pointX, pointY, pointZ);
	mesh.scale.set(0.2*myScale, 0.2*myScale, 0.2*myScale);
	mesh.userData.direction = 'Z';
	if(pointZ > 0) {
	    mesh.userData.speed = -1*fishSpeed;
	    mesh.rotation.set(Math.PI, 0, 0);
	}
	else {
	    mesh.userData.speed = fishSpeed;
	}
	scene.add(mesh);
	fishes.push(mesh);
    });
}

function addFishCX(pointX, pointY, pointZ, myScale, myColor) {
    if(!myScale) {
	myScale = 1.0;
    }
    if(!myColor) {
	myColor = new THREE.Color(0x00ffff*Math.random());
    }

    loader = new THREE.JSONLoader();
    loader.load('model/fishC.json', function(geometry) {
	var material = new THREE.MeshBasicMaterial();
	var mesh = new THREE.Mesh(geometry, material);
	mesh.material.color = myColor;
	mesh.position.set(pointX, pointY, pointZ);
	mesh.scale.set(0.2*myScale, 0.2*myScale, 0.2*myScale);
	mesh.userData.direction = 'X';
	if(pointX > 0) {
	    mesh.userData.speed = -1*fishSpeed;
	    mesh.rotation.set(0, -Math.PI/2, 0);
	}
	else {
   	    mesh.userData.speed = fishSpeed;
	    mesh.rotation.set(0, Math.PI/2, 0);
	}
	scene.add(mesh);
	fishes.push(mesh);
    });
}

function addFishCZ(pointX, pointY, pointZ, myScale, myColor) {
    if(!myScale) {
	myScale = 1.0;
    }
    if(!myColor) {
	myColor = new THREE.Color(0x00ffff*Math.random());
    }

    loader = new THREE.JSONLoader();
    loader.load('model/fishC.json', function(geometry) {
	var material = new THREE.MeshBasicMaterial();
	var mesh = new THREE.Mesh(geometry, material);
	mesh.material.color = myColor;
	mesh.position.set(pointX, pointY, pointZ);
	mesh.scale.set(0.2*myScale, 0.2*myScale, 0.2*myScale);
	mesh.userData.direction = 'Z';
	if(pointZ > 0) {
	    mesh.userData.speed = -1*fishSpeed;
	    mesh.rotation.set(Math.PI, 0, 0);
	}
	else {
	    mesh.userData.speed = fishSpeed;
	}
	scene.add(mesh);
	fishes.push(mesh);
    });
}

function resize() {
    var width = container.offsetWidth;
    var height = container.offsetHeight;
    console.log(width, height);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    //effect.setSize(width, height);
}

function update(dt) {
    for(var i=0; i<spheres.length; i++) {
	spheres[i].position.y += spheres[i].userData.speed;
	if(spheres[i].position.y > yRange) {
	    spheres[i].position.y = -3;
	}
    }

    for(var i=0; i<fishes.length; i++) {
	if(fishes[i].userData.direction == 'X') {
	    fishes[i].position.x += fishes[i].userData.speed;
	    if(Math.abs(fishes[i].position.x) > xRange) {
	        fishes[i].position.x *= -1;
	    }
	}
	else {
	    fishes[i].position.z += fishes[i].userData.speed;
	    if(Math.abs(fishes[i].position.z) > zRange) {
	        fishes[i].position.z *= -1;
	    }
	}
    }

    camera.updateProjectionMatrix();
    controls.update(dt);
}

function render(dt) {
    renderer.render(scene, camera);
    //effect.render(scene, camera);
}

function animate(t) {
    requestAnimationFrame(animate);

    update(clock.getDelta());
    render(clock.getDelta());
}

function fullscreen() {
    if (container.requestFullscreen) {
      container.requestFullscreen();
    } else if (container.msRequestFullscreen) {
      container.msRequestFullscreen();
    } else if (container.mozRequestFullScreen) {
      container.mozRequestFullScreen();
    } else if (container.webkitRequestFullscreen) {
      container.webkitRequestFullscreen();
    }
}
