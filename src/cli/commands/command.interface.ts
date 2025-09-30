export interface command {
  getName(): string
  execute(...parameters: string[]): void
}