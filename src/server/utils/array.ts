export function shuffle(array: any[]) {
  return array.sort((a, b) => Math.random() - 0.5);
}
