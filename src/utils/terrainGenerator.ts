export class TerrainGenerator {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  // Simple noise function for terrain generation
  private noise(x: number, z: number): number {
    let n = Math.sin(x * 0.01) * Math.cos(z * 0.01);
    n += Math.sin(x * 0.02) * Math.cos(z * 0.02) * 0.5;
    n += Math.sin(x * 0.04) * Math.cos(z * 0.04) * 0.25;
    return n;
  }

  // Generate height for a given x, z coordinate
  getHeight(x: number, z: number): number {
    const baseHeight = 64;
    const amplitude = 16;
    
    const height = baseHeight + this.noise(x + this.seed, z + this.seed) * amplitude;
    return Math.floor(Math.max(1, height));
  }

  // Check if a position should have a tree
  shouldPlaceTree(x: number, z: number): boolean {
    const treeNoise = this.noise(x * 0.1 + this.seed, z * 0.1 + this.seed);
    return treeNoise > 0.7 && this.getHeight(x, z) > 62;
  }
}
