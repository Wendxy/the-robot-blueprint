export type Vector = [number, number, number];

export const project = ([x,y,z]: Vector) => [200 + .86 * (x-y), 158 + .36 * (x+y) - .87*z];

// Rotate about X (roll), then Y (pitch), then Z (yaw), and translate into the world frame.
export function rigidTransform(position: Vector, angles: Vector) {
  const [a,b,c] = angles.map(v => v * Math.PI / 180);
  const [sa,sb,sc] = [Math.sin(a),Math.sin(b),Math.sin(c)];
  const [ca,cb,cc] = [Math.cos(a),Math.cos(b),Math.cos(c)];
  return ([x,y,z]: Vector): Vector => {
    const ry = y*ca - z*sa, rz = y*sa + z*ca;
    const px = x*cb + rz*sb, pz = -x*sb + rz*cb;
    return [px*cc - ry*sc + position[0], px*sc + ry*cc + position[1], pz + position[2]];
  };
}
