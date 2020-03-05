const isEqual = (a, b, epsilon = .1) => Math.abs(b - a) <= epsilon;
const lessThan = (a, b, epsilon = .0001) => !isEqual(a, b, epsilon) && a < b;
const greaterThan = (a, b, epsilon = .0001) => !isEqual(a, b, epsilon) && a > b;

class Inverter {
  constructor(width, length, height, scene) {
    this.width = width;
    this.length = length;
    this.height = height;
    this.mesh = null;
    this.ray = new THREE.Ray();
    this.raycaster = new THREE.Raycaster();

    this.arrowHelpers = [];
    this.scene = scene;
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

  findIntersectionWith(house, dragNormal) {
    return this.mesh.geometry.vertices.reduce(
      (furthestIntersection, localInverterVertex, i) => {
        var inverterVertex = this.mesh.localToWorld(localInverterVertex.clone());
        if (!this.arrowHelpers[i]) {
          this.arrowHelpers[i] = new THREE.ArrowHelper(dragNormal, inverterVertex, 2);
          this.scene.add(this.arrowHelpers[i]);
        } else {
          this.arrowHelpers[i].position.copy(inverterVertex);
          this.arrowHelpers[i].setDirection(dragNormal);
        }
  
        this.raycaster.set(inverterVertex, dragNormal);
        let intersect = this.raycaster.intersectObject(house);
        const vertexOutsideHouse = intersect.length > 1;
        if (vertexOutsideHouse) {
          return furthestIntersection;
        }

        if (intersect.length > 0) {
          intersect = intersect[0];

          if (intersect && (!furthestIntersection || greaterThan(intersect.distance, furthestIntersection[0].distance))) {
            const delta = inverterVertex.clone().sub(this.mesh.position);
            return [intersect, delta];
          }
        }
        return furthestIntersection;
      },
      null,
    );
  }
};