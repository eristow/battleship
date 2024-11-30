export class Ship {
  constructor(
    public name: string,
    public length: number,
    private currentHits: number = 0,
  ) {}

  hit(): void {
    this.currentHits++;
  }

  isSunk(): boolean {
    return this.currentHits === this.length;
  }
}
