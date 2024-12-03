export class Ship {
  public coordinates: string[] = [];

  constructor(
    public name: string,
    public length: number,
    public startX: number,
    public startY: number,
    public isHorizontal: boolean,
    public currentHits: number = 0,
  ) {
    this.calculateCoordinates();
  }

  private calculateCoordinates(): void {
    this.coordinates = [];

    for (let i = 0; i < this.length; i++) {
      const x = this.isHorizontal ? this.startX + i : this.startX;
      const y = this.isHorizontal ? this.startY : this.startY + i;
      this.coordinates.push(`${x},${y}`);
    }
  }

  hit(): void {
    this.currentHits++;
  }

  isSunk(): boolean {
    return this.currentHits === this.length;
  }
}
