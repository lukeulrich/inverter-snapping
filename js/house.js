class House {
  constructor(width, length, height, roofSlope) {
    this.width = width;
    this.length = length;
    this.height = height;
    this.roofSlope = roofSlope;

    this.mesh = null;
  }

  updatePosition(newPosition) {
    if (this.mesh == null) { return; }
    this.mesh.position.set(newPosition.x, newPosition.y, 0);
  }

  initGeometry(scene) {
    // Calculate height of walls
    const wallHeight = this.height;
    const peakHeight = wallHeight + (Math.tan(this.roofSlope) * (this.width / 2));
    // Create walls
    this.vertices = [];
    this.faces = []
    this.vertices.push(new THREE.Vector3(-this.width / 2, 0, -this.length / 2));
    this.vertices.push(new THREE.Vector3(-this.width / 2, wallHeight, this.length / 2));
    this.vertices.push(new THREE.Vector3(-this.width / 2, wallHeight, -this.length / 2));
    this.vertices.push(new THREE.Vector3(-this.width / 2, 0, this.length / 2));
    this.vertices.push(new THREE.Vector3(-this.width / 2, peakHeight, 0));
    this.faces.push(new THREE.Face3(0, 1, 2));
    this.faces.push(new THREE.Face3(0, 3, 1));
    this.faces.push(new THREE.Face3(1, 4, 2));

    this.vertices.push(new THREE.Vector3(this.width / 2, 0, -this.length / 2));
    this.vertices.push(new THREE.Vector3(this.width / 2, wallHeight, this.length / 2));
    this.vertices.push(new THREE.Vector3(this.width / 2, wallHeight, -this.length / 2));
    this.vertices.push(new THREE.Vector3(this.width / 2, 0, this.length / 2));
    this.vertices.push(new THREE.Vector3(this.width / 2, peakHeight, 0));
    this.faces.push(new THREE.Face3(5, 7, 6));
    this.faces.push(new THREE.Face3(5, 6, 8));
    this.faces.push(new THREE.Face3(6, 7, 9));

    this.faces.push(new THREE.Face3(3, 6, 1));
    this.faces.push(new THREE.Face3(3, 8, 6));
    this.faces.push(new THREE.Face3(5, 2, 7));
    this.faces.push(new THREE.Face3(5, 0, 2));

    // Create roof
    this.faces.push(new THREE.Face3(1, 9, 4));
    this.faces.push(new THREE.Face3(1, 6, 9));
    this.faces.push(new THREE.Face3(7, 4, 9));
    this.faces.push(new THREE.Face3(7, 2, 4));

    let geometry = new THREE.Geometry();
    geometry.vertices.push(...this.vertices);
    geometry.faces.push(...this.faces);
    geometry.computeFlatVertexNormals();

    let material = new THREE.MeshStandardMaterial({ color: 0xbb2266, side: THREE.DoubleSide });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = false;
    scene.add(this.mesh);
  }
};