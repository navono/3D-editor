import * as THREE from 'three';

export interface Annotation {
  title: string;
  description: string;
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
  descriptionDomElement?: HTMLElement;
}
