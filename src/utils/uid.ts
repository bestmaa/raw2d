let currentId = 0;

export function uid(prefix: string): string {
  currentId += 1;
  return `${prefix}-${currentId}`;
}
