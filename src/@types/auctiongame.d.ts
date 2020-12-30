interface Game {
  scoreCards: Array<number>;
  status: "0"|"1";
  isChooseing: "0"|"1";
  round: number;
  players: Array<Player>
}

interface Player{
  id: string;
  name: string;
  hasCards: Array<number>
  useCards: Array<number> 
}