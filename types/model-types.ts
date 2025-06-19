// model-types.ts
export type ModelObjectType = 'cube' | 'sphere' | 'cylinder' | 'cone' | 'torus' | 'plane' | 'wedge' | 'custom-mesh'
function isValidModelType(type: string): type is ModelObjectType {
  return [
    'cube', 'sphere', 'cylinder', 'cone', 'torus', 
    'plane', 'wedge', 'custom-mesh' // New types added
  ].includes(type)
}