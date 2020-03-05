class Inverter {
  constructor(width, length, height, scene) {
    this.width = width;
    this.length = length;
    this.height = height;
    this.mesh = null;
    this.ray = new THREE.Ray();
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

    // const axes = new THREE.AxesHelper();
    // axes.material.depthTest = false;
    // axes.renderOrder = 1;
    // this.mesh.add(axes);
  }

  storeVertices() {
    this.storedVertices = this.mesh.geometry.vertices.map((vertex) => this.mesh.localToWorld(vertex.clone()));
    this.clearArrows();
  }

  clearArrows() {
    this.arrowHelpers.forEach((ah) => this.scene.remove(ah));
    this.arrowHelpers.length = 0;
  }

  getNearestIntersect(house, maxDistance = .25) {
    const result = this.mesh.geometry.vertices.reduce(
      (nearestIntersect, inverterVertex) => {
        inverterVertex = this.mesh.localToWorld(inverterVertex.clone());
        for (let { face, invertedNormal } of house.faceData) {
          this.ray.set(inverterVertex, invertedNormal);

          // Already in world space
          const a = house.vertices[face.a];
          const b = house.vertices[face.b];
          const c = house.vertices[face.c];
          
          const target = new THREE.Vector3();
          let intersect = this.ray.intersectTriangle(a, b, c, true, target);
          if (intersect) {
            const distance = intersect.distanceTo(inverterVertex);
            if (distance <= maxDistance && distance < nearestIntersect.distance) {
              nearestIntersect.face = face;
              nearestIntersect.point = intersect;
              nearestIntersect.distance = distance;
            }
          }
        }

        return nearestIntersect;
      },
      {
        face: null,
        point: null,
        distance: Infinity,
      },
    );

    return result.point ? result : null;
  }
};