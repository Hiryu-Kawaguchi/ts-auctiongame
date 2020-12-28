interface Game {
  scoreCards: Array<number>;
  status: string;
  round: number;
  players: Array<Player>
}

interface Player{
  id: string;
  name: string;
  hasCards: Array<number>
}