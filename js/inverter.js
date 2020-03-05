class Inverter {
  constructor(width, length, height) {
    this.width = width;
    this.length = length;
    this.height = height;
    this.mesh = null;
  }

  updatePosition(newPosition, newTransform) {
    if (this.mesh == null) { return; }
    this.mesh.position.set(newPosition.x, newPosition.y, newPosition.z);
    if (newTransform != null) {
      this.mesh.quaternion.copy(newTransform);
    }
  }

  get draggable() {
    return true;
  }

  initGeometry(scene) {
    let geometry = new THREE.BoxGeometry(this.width, this.height, this.length);
    geometry.translate(0, this.height / 2, 0);
    let material = new THREE.MeshStandardMaterial({ color: 0x887766 });
    this.mesh = new THREE.Mesh(geometry, material);
    scene.add(this.mesh);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = false;

    let axis = new THREE.Vector3(0, 1, 0);
    let newTransform = new THREE.Quaternion().setFromAxisAngle(axis, Math.PI / 3);
    this.updatePosition(new THREE.Vector3(0, 0, 0), newTransform);
  }
};