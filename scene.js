"use strict";

//  Adapted from Hunor Márton Borbély tutorial: https://www.freecodecamp.org/news/three-js-tutorial
//  Adapted from exercise 3, Script ICG 4 
//
// 		Eva Bartolomeu - Maio 2021

// To store the scene graph, and elements usefull to rendering the scene
const sceneElements = {
    sceneGraph: null,
    camera: null,
    control: null, 
    renderer: null,
};

// Functions are called
//  1. Initialize the empty scene
//  2. Add elements within the scene
//  3. Animate
helper.initEmptyScene(sceneElements);
load3DObjects(sceneElements.sceneGraph);
requestAnimationFrame(computeFrame);

// HANDLING EVENTS

// Event Listeners

window.addEventListener('resize', resizeWindow);

//To keep track of the keyboard - WASD
var keyD = false, keyA = false, keyS = false, keyW = false;
document.addEventListener('keydown', onDocumentKeyDown, false);
document.addEventListener('keyup', onDocumentKeyUp, false);

// Update render image size and camera aspect when the window is resized
function resizeWindow(eventParam) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    sceneElements.camera.aspect = width / height;
    sceneElements.camera.updateProjectionMatrix();

    sceneElements.renderer.setSize(width, height);

    var text = document.getElementById('text');
    text.style.fontSize = ((width*height) * 20) / (1811040) + 'px';
    text.style.width = ((width*height) * 100) / (1811040);
    text.style.height = ((width*height) * 100) / (1811040);
    text.style.padding = ((width*height) * 10) / (1811040) + 'px';
    text.style.border = ((width*height) * 5) / (1811040) + 'px solid gray';
    document.body.appendChild(text);
}

function onDocumentKeyDown(event) {
    switch (event.keyCode) {
        case 68: //d
            keyD = true;
            break;
        case 83: //s
            keyS = true;
            break;
        case 65: //a
            keyA = true;
            break;
        case 87: //w
            keyW = true;
            break;
    }
}
function onDocumentKeyUp(event) {
    switch (event.keyCode) {
        case 68: //d
            keyD = false;
            break;
        case 83: //s
            keyS = false;
            break;
        case 65: //a
            keyA = false;
            break;
        case 87: //w
            keyW = false;
            break;
    }
}

//////////////////////////////////////////////////////////////////

function Wheel() {
    const geometry = new THREE.BoxBufferGeometry(0.1, 0.1, 0.275);
    const material = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const wheel = new THREE.Mesh(geometry, material);
    wheel.translateY(0.05);
    wheel.castShadow = true;
    wheel.receiveShadow = true;
    return wheel;
}

function frontMirror() {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 32;
    const context = canvas.getContext("2d");
  
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 64, 32);
  
    context.fillStyle = "#666666";
    context.fillRect(8, 8, 48, 24);
  
    return new THREE.CanvasTexture(canvas);
}

function sideMirror() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 32;
    const context = canvas.getContext("2d");
  
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 128, 32);
  
    context.fillStyle = "#666666";
    context.fillRect(10, 8, 38, 24);
    context.fillRect(58, 8, 60, 24);
  
    return new THREE.CanvasTexture(canvas);
}

function Car(cor, wheelX = 0.15, mainWidth = 0.5, cabinWidth = 0.275){
    const car = new THREE.Group();

    const wheel1 = Wheel();
    wheel1.translateX(-wheelX);
    car.add(wheel1);
  
    const wheel2 = Wheel();
    wheel2.translateX(wheelX);
    car.add(wheel2);

    const main = new THREE.Mesh(
      new THREE.BoxBufferGeometry(mainWidth, 0.125, 0.25),
      new THREE.MeshPhongMaterial({ color: cor })
    );
    main.translateY(0.1);
    main.castShadow = true;
    main.receiveShadow = true;
    car.add(main);
  
    const front = frontMirror();
    const back = frontMirror();
    const right = sideMirror();
    const left = sideMirror();
    left.center = new THREE.Vector2(0.5/120, 0.5/120);
    left.rotation = Math.PI/120;
    left.flipY = false;
  
    const cabin = new THREE.Mesh(new THREE.BoxBufferGeometry(cabinWidth, 0.1, 0.2), [
      new THREE.MeshPhongMaterial({ map: front }),
      new THREE.MeshPhongMaterial({ map: back }),
      new THREE.MeshPhongMaterial({ color: 0xffffff }), // top
      new THREE.MeshPhongMaterial({ color: 0xffffff }), // bottom
      new THREE.MeshPhongMaterial({ map: right }),
      new THREE.MeshPhongMaterial({ map: left }),
    ]);
    cabin.position.x = -0.05;
    cabin.position.y = 0.2125;
    cabin.castShadow = true;
    cabin.receiveShadow = true;
    car.add(cabin);
  
    return car;
}

function getTruckFrontTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 32, 32);

  context.fillStyle = "#666666";
  context.fillRect(0, 5, 32, 10);

  return new THREE.CanvasTexture(canvas);
}

function getTruckSideTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 32, 32);

  context.fillStyle = "#666666";
  context.fillRect(17, 5, 15, 10);

  return new THREE.CanvasTexture(canvas);
}


function Truck() {
    const truck = new THREE.Group();
  
    const base = new THREE.Mesh(
      new THREE.BoxBufferGeometry(100/120, 5/120, 25/120),
      new THREE.MeshPhongMaterial({ color: 0xb4c6fc })
    );
    base.position.y = 10/120;
    truck.add(base);
  
    const cargo = new THREE.Mesh(
      new THREE.BoxBufferGeometry(75/120, 40/120, 35/120),
      new THREE.MeshPhongMaterial({ color: 0xffffff }) 
    );
    cargo.position.x = -15/120;
    cargo.position.y = 30/120;
    cargo.castShadow = true;
    cargo.receiveShadow = true;
    truck.add(cargo);
  
    const truckFrontTexture = getTruckFrontTexture();
  
    const truckLeftTexture = getTruckSideTexture();
    truckLeftTexture.center = new THREE.Vector2(0.5, 0.5);
    truckLeftTexture.rotation = Math.PI;
    truckLeftTexture.flipY = false;
  
    const truckRightTexture = getTruckSideTexture();
  
    const cabin = new THREE.Mesh(new THREE.BoxBufferGeometry(25/120, 30/120, 30/120), [
      new THREE.MeshPhongMaterial({ color: 0xa52523, map: truckFrontTexture }),
      new THREE.MeshPhongMaterial({ color: 0xa52523 }), // back
      new THREE.MeshPhongMaterial({ color: 0xa52523 }), // top
      new THREE.MeshPhongMaterial({ color: 0xa52523 }), // bottom
      new THREE.MeshPhongMaterial({ color: 0xa52523, map: truckRightTexture }),
      new THREE.MeshPhongMaterial({ color: 0xa52523, map: truckLeftTexture })
    ]);
    cabin.position.x = 40/120;
    cabin.position.y = 20/120;
    cabin.castShadow = true;
    cabin.receiveShadow = true;
    truck.add(cabin);
  
    const backWheel = Wheel();
    backWheel.position.x = -30/120;
    truck.add(backWheel);
  
    const middleWheel = Wheel();
    middleWheel.position.x = 10/120;
    truck.add(middleWheel);
  
    const frontWheel = Wheel();
    frontWheel.position.x = 38/120;
    truck.add(frontWheel);
  
    return truck;
}

function TrafficLight(name){
    const trafficLight = new THREE.Group();

    const postGeometry = new THREE.BoxBufferGeometry(0.07, 0.3, 0.1);
    const postMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const post = new THREE.Mesh(postGeometry, postMaterial);
    post.translateY(0.15);
    post.translateX(-1.70);
    post.castShadow = true;
    post.receiveShadow = true;
    trafficLight.add(post);

    const topPostGeometry = new THREE.BoxBufferGeometry(0.15, 0.5, 0.1);
    const topPostMaterial = new THREE.MeshPhongMaterial({ color: "rgb(192,192,192)" });
    const topPost = new THREE.Mesh(topPostGeometry, topPostMaterial);
    topPost.translateY(0.55);
    topPost.translateX(-1.70);
    topPost.castShadow = true;
    topPost.receiveShadow = true;
    trafficLight.add(topPost);
    
    const greenGeometry = new THREE.CircleGeometry(0.05 , 32 );
    const greenMaterial = new THREE.MeshBasicMaterial( { color: "rgb(0,128,0)" } );
    const greenCircle = new THREE.Mesh( greenGeometry, greenMaterial );
    greenCircle.translateY(0.4);
    greenCircle.translateX(-1.70);
    greenCircle.translateZ(0.051);
    trafficLight.add( greenCircle );
    greenCircle.name = name + "_green";

    const yellowGeometry = new THREE.CircleGeometry(0.05 , 32 );
    const yellowMaterial = new THREE.MeshBasicMaterial( { color: 0x000000 } );
    const yellowCircle = new THREE.Mesh( yellowGeometry, yellowMaterial );
    yellowCircle.translateY(0.55);
    yellowCircle.translateX(-1.70);
    yellowCircle.translateZ(0.051);
    trafficLight.add( yellowCircle );
    yellowCircle.name = name + "_yellow";

    const redGeometry = new THREE.CircleGeometry(0.05 , 32 );
    const redMaterial = new THREE.MeshBasicMaterial( { color: 0x000000 } );
    const redCircle = new THREE.Mesh( redGeometry, redMaterial );
    redCircle.translateY(0.7);
    redCircle.translateX(-1.70);
    redCircle.translateZ(0.051);
    trafficLight.add( redCircle );
    redCircle.name = name + "_red";

    return trafficLight;
}

function createTree(cylinderRadius = 1/6, cylinderHeight = 4/6, baseConeRadius = 2/6, coneHeight = 1) {
    // Creating a model by grouping basic geometries
    // Cylinder centered at the origin
    const cylinderGeometry = new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, cylinderHeight, 32);
    const cylinderMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;

    // Move base of the cylinder to y = 0
    cylinder.position.y = cylinderHeight / 2.0;

    // Cone
    const coneGeometry = new THREE.ConeGeometry(baseConeRadius, coneHeight, 32);
    const greenMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const cone = new THREE.Mesh(coneGeometry, greenMaterial);
    cone.castShadow = true;
    cone.receiveShadow = true;

    // Move base of the cone to the top of the cylinder
    cone.position.y = cylinderHeight + coneHeight / 2.0;

    // Tree
    var tree = new THREE.Group();
    tree.add(cylinder);
    tree.add(cone);

    return tree;
}

function createForest(sceneGraph){

    const tree1 = createTree();
    sceneGraph.add(tree1);
    tree1.translateZ(-2.25)
    tree1.translateX(2.75)
    // Set shadow property
    tree1.castShadow = true;
    tree1.receiveShadow = true;

    const tree2 = createTree();
    sceneGraph.add(tree2);
    tree2.translateZ(2.25)
    tree2.translateX(-2.75)
    // Set shadow property
    tree2.castShadow = true;
    tree2.receiveShadow = true;

    const tree3 = createTree();
    sceneGraph.add(tree3);
    tree3.translateZ(-2.50)
    tree3.translateX(-2.40)
    // Set shadow property
    tree3.castShadow = true;
    tree3.receiveShadow = true;

    const tree4 = createTree(1/8, 4/8, 2/8, 6/8);
    sceneGraph.add(tree4);
    tree4.translateZ(-1)
    tree4.translateX(-3.25)
    // Set shadow property
    tree4.castShadow = true;
    tree4.receiveShadow = true;

    const tree5 = createTree(1/8, 4/8, 2/8, 6/8);
    sceneGraph.add(tree5);
    tree5.translateZ(1)
    tree5.translateX(1)
    // Set shadow property
    tree5.castShadow = true;
    tree5.receiveShadow = true;

    const tree6 = createTree(1/9, 4/9, 2/9, 6/9);
    sceneGraph.add(tree6);
    tree6.translateZ(1.5)
    tree6.translateX(3.7)
    // Set shadow property
    tree6.castShadow = true;
    tree6.receiveShadow = true;
}


// Create and insert in the scene graph the models of the 3D scene
function load3DObjects(sceneGraph) {

    // ************************** //
    // Create a ground plane
    // ************************** //
    const planeGeometry = new THREE.PlaneGeometry(15, 6);
    //const planeGeometry = new THREE.PlaneGeometry(15, 15);
    const planeMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(154,205,50)', side: THREE.DoubleSide });
    const planeObject = new THREE.Mesh(planeGeometry, planeMaterial);
    sceneGraph.add(planeObject);
    planeObject.translateY(-0.0001);
    // Change orientation of the plane using rotation
    planeObject.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    // Set shadow property
    planeObject.receiveShadow = true;

    const circleGeometry1 = new THREE.CircleGeometry(3, 100);
    const circleMaterial1 = new THREE.MeshPhongMaterial({ color: 'rgb(200, 200, 200)', side: THREE.DoubleSide });
    const circle1 = new THREE.Mesh(circleGeometry1, circleMaterial1);
    sceneGraph.add(circle1);
    // Change orientation of the plane using rotation
    circle1.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    // Set shadow property
    circle1.receiveShadow = true;

    const circleGeometry2 = new THREE.CircleGeometry(2, 100);
    const circleMaterial2 = new THREE.MeshPhongMaterial({ color: 'rgb(154,205,50)', side: THREE.DoubleSide });
    const circle2 = new THREE.Mesh(circleGeometry2, circleMaterial2);
    sceneGraph.add(circle2);
    circle2.translateY(0.0001);
    // Change orientation of the plane using rotation
    circle2.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    // Set shadow property
    circle2.receiveShadow = true;

    const roadLineGeometry = new THREE.CircleGeometry(2.5, 100);
    roadLineGeometry.vertices.splice(0, 1); 
    const roadLine =  new THREE.LineLoop(roadLineGeometry, new THREE.LineBasicMaterial({ color: 'yellow'}));
    sceneGraph.add( roadLine );
    // Change orientation
    roadLine.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    // Set shadow property
    roadLine.receiveShadow = true;

    // ************************** //
    // Create a text box
    // ************************** //
    const width = window.innerWidth;
    const height = window.innerHeight;
    var text = document.createElement('div');
    text.setAttribute('id', 'text');
    text.style.fontFamily = 'verdana';
    text.style.fontSize = ((width*height) * 20) / (1811040) + 'px';
    text.style.position = 'absolute';
    text.style.width = ((width*height) * 100) / (1811040);
    text.style.height = ((width*height) * 100) / (1811040);
    text.style.padding = ((width*height) * 10) / (1811040) + 'px';
    text.style.border = ((width*height) * 5) / (1811040) + 'px solid gray';
    text.style.backgroundColor = "white";
    text.style.top = 0 + 'px';
    text.style.left = 0 + 'px';
    text.innerHTML = "To control the left traffic light: <ul> <li>Press 'W' KEY to change to green;</li> <li>Press 'S' KEY to change to red.</li> </ul> <br/> To control the right traffic light: <ul> <li>Press 'A' KEY to change to green;</li> <li>Press 'D' KEY to change to red.</li>";
    document.body.appendChild(text);

    // ************************** //
    // Create a Car
    // ************************** //
    const car = Car("rgb(255,140,0)");
    sceneGraph.add(car);
    car.translateZ(2.75)
    // Set shadow property
    car.castShadow = true;
    car.receiveShadow = true;

    // ************************** //
    // Create car1
    // ************************** //
    const car1 = Car("rgb(75,0,130)");
    sceneGraph.add(car1);
    car1.translateZ(2)
    car1.translateX(1)
    car1.rotation.y = 3.6
    // Set shadow property
    car1.castShadow = true;
    car1.receiveShadow = true;

    // ************************** //
    // Create car2
    // ************************** //
    const car2 = Car('#000000', 0.2, 0.75, 0.5);
    sceneGraph.add(car2);
    car2.translateZ(2.55)
    car2.translateX(-1)
    car2.rotation.y = -0.48
    // Set shadow property
    car2.castShadow = true;
    car2.receiveShadow = true;

    // ************************** //
    // Create a Truck
    // ************************** //
    const truck = Truck();
    sceneGraph.add(truck);
    truck.translateZ(2.25)
    truck.rotation.y = 3.1
    // Set shadow property
    truck.castShadow = true;
    truck.receiveShadow = true;

    // ************************** //
    // Create a trafficLight
    // ************************** //
    const trafficLight0 = TrafficLight("trafficLight0");
    sceneGraph.add(trafficLight0);
    trafficLight0.translateZ(-0.5);
    // Set shadow property
    trafficLight0.castShadow = true;
    trafficLight0.receiveShadow = true;

    // ************************** //
    // Create a trafficLight
    // ************************** //
    const trafficLight1 = TrafficLight("trafficLight1");
    sceneGraph.add(trafficLight1);
    trafficLight1.translateZ(-0.5);
    trafficLight1.translateX(4.8);
    // Set shadow property
    trafficLight1.castShadow = true;
    trafficLight1.receiveShadow = true;

    // ************************** //
    // Create Forest
    // ************************** //
    createForest(sceneGraph);

    // ************************** //
    // Create a pivots
    // ************************** //
	const pivot = new THREE.Object3D();
    pivot.add(car);
    pivot.add(car2);
    sceneGraph.add(pivot)
    pivot.name="pivot"

    const pivot2 = new THREE.Object3D();
    pivot2.add(truck);
    pivot2.add(car1);
    sceneGraph.add(pivot2)
    pivot2.name="pivot2"

}

// Displacement value

var delta = 0.1;

var yellowLit0 = false;
var redTimetoCall0 = 0;
var inCirculation0 = true;

var yellowLit1 = false;
var redTimetoCall1 = 0;
var inCirculation1 = true;

const pivot2 = sceneElements.sceneGraph.getObjectByName("pivot2");
const pivot = sceneElements.sceneGraph.getObjectByName("pivot");
const greenCircle0 = sceneElements.sceneGraph.getObjectByName("trafficLight0_green");
const yellowCircle0 = sceneElements.sceneGraph.getObjectByName("trafficLight0_yellow");
const redCircle0 = sceneElements.sceneGraph.getObjectByName("trafficLight0_red");
const greenCircle1 = sceneElements.sceneGraph.getObjectByName("trafficLight1_green");
const yellowCircle1 = sceneElements.sceneGraph.getObjectByName("trafficLight1_yellow");
const redCircle1 = sceneElements.sceneGraph.getObjectByName("trafficLight1_red");

function computeFrame(time) {
    //Stop pivot2 circulation if the traffic light is red
    if (pivot2.rotation.y == -7.799999999999922) {
        pivot2.rotation.y = -1.5000000000000009;
    }

    if (pivot2.rotation.y == -1.5000000000000009 && redCircle0.material.color.equals(new THREE.Color( "rgb(255,0,0)" ))) {
        inCirculation0= false   
    } 

    if ( !inCirculation0 && greenCircle0.material.color.equals(new THREE.Color( "rgb(0,128,0)" ))) {
        inCirculation0= true   
    } 

    //Stop pivot circulation if the traffic light is red
    if (pivot.rotation.y == 7.80000000000002) {
        pivot.rotation.y = 1.500000000000001;
    }

    if (pivot.rotation.y == 1.500000000000001 && redCircle1.material.color.equals(new THREE.Color( "rgb(255,0,0)" ))) {
        inCirculation1= false   
    } 

    if ( !inCirculation1 && greenCircle1.material.color.equals(new THREE.Color( "rgb(0,128,0)" ))) {
        inCirculation1= true   
    } 

    // Cars movement
    if (inCirculation1) {
        pivot.rotation.y += 0.03;
    }
    if (inCirculation0) {
        pivot2.rotation.y -= 0.02;
    }

    //Change the traffic light from yellow to red
    if (yellowLit0 && redTimetoCall0 < new Date().getTime() / 1000) {
        yellowCircle0.material.color = new THREE.Color( 0x000000 );     
        redCircle0.material.color = new THREE.Color( "rgb(255,0,0)" );  
        yellowLit0 = false;   
    }

    if (yellowLit1 && redTimetoCall1 < new Date().getTime() / 1000) {
        yellowCircle1.material.color = new THREE.Color( 0x000000 );     
        redCircle1.material.color = new THREE.Color( "rgb(255,0,0)" );  
        yellowLit1 = false;   
    }

    // CONTROLING THE traffic light WITH THE KEYBOARD
    if (keyW && greenCircle0.material.color.equals(new THREE.Color( 0x000000 )) && !yellowLit0) {
        redCircle0.material.color = new THREE.Color( 0x000000 );     
        greenCircle0.material.color = new THREE.Color( "rgb(0,128,0)" );  
    }

    if (keyS && redCircle0.material.color.equals(new THREE.Color( 0x000000 )) && !yellowLit0 ) {
        greenCircle0.material.color = new THREE.Color( 0x000000 );     
        yellowCircle0.material.color = new THREE.Color( 0xffff00 );  
        yellowLit0 = true;
        redTimetoCall0 = (new Date().getTime() / 1000) + 0.8; 
    }

    if (keyA && greenCircle1.material.color.equals(new THREE.Color( 0x000000 )) && !yellowLit1) {
        redCircle1.material.color = new THREE.Color( 0x000000 );     
        greenCircle1.material.color = new THREE.Color( "rgb(0,128,0)" );  
    }

    if (keyD && redCircle1.material.color.equals(new THREE.Color( 0x000000 )) && !yellowLit1 ) {
        greenCircle1.material.color = new THREE.Color( 0x000000 );     
        yellowCircle1.material.color = new THREE.Color( 0xffff00 );  
        yellowLit1 = true;
        redTimetoCall1 = (new Date().getTime() / 1000) + 0.8; 
    }

    // Rendering
    helper.render(sceneElements);

    // NEW --- Update control of the camera
    sceneElements.control.update();

    // Call for the next frame
    requestAnimationFrame(computeFrame);
}