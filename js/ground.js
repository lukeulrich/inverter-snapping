class Ground {
  constructor(width, length) {
    this.width = width;
    this.length = length;
    this.mesh = null;
    this.plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  }

  updatePosition(newPosition, newTransform) {
    if (this.mesh == null) { return; }
    this.mesh.position.set(newPosition.x, newPosition.y, newPosition.z);
    if (newTransform != null) {
      this.mesh.quaternion.copy(newTransform);
    }
  }

  initGeometry(scene) {
    let geometry = new THREE.PlaneGeometry(this.width, this.length);
    let material = new THREE.MeshLambertMaterial({ color: 0x44ff11, side: THREE.DoubleSide });
    this.mesh = new THREE.Mesh(geometry, material);
    scene.add(this.mesh);
    this.mesh.castShadow = false;
    this.mesh.receiveShadow = true;

    let axis = new THREE.Vector3(1, 0, 0);
    let newTransform = new THREE.Quaternion().setFromAxisAngle(axis, -Math.PI / 2);
    this.updatePosition(new THREE.Vector3(0, 0, 0), newTransform);

    // const axes = new THREE.AxesHelper();
    // axes.material.depthTest = false;
    // axes.renderOrder = 1;
    // this.mesh.add(axes);

    // const grid = new THREE.GridHelper(10, 10);
    // grid.material.depthTest = false;
    // grid.renderOrder = 1;
    // this.mesh.add(grid);
  }
};