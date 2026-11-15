// Patch percentages refer to added planting density, never trunk age.
export function lessonGrowth(step) {
 const p=(Math.max(1,Math.min(10,Number(step)||1))-1)/9;
 return [Math.min(1,p*1.8),Math.max(0,Math.min(1,(p-.12)/.88)),Math.max(0,Math.min(1,(p-.48)/.52))];
}
