export class Ship {
  constructor(
    public name: string,
    public length: number,
    public startX: number,
    public startY: number,
    public isHorizontal: boolean,
    public currentHits: number = 0,
  ) {}

  hit(): void {
    this.currentHits++;
  }

  isSunk(): boolean {
    return this.currentHits === this.length;
  }
}
