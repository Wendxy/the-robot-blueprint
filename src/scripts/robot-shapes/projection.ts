export type Vector = [number, number, number];

export const project = ([x,y,z]: Vector) => [200 + .86 * (x-y), 158 + .36 * (x+y) - .87*z];
