<template>
  <div class="home">
    <p>GameID: {{gameId}}</p>
    <p>yourName: {{yourName}}</p>
    <div v-if="isWaiting">
      <p>Waiting......</p>
      <p>JoinMenber:{{joinPlayerNum}}</p>
      <b-button @click="start()" :disabled="canStartPlayerNum">GameStart</b-button>
    </div>
    <div v-else-if="isPlaying">
      <p>Playing......</p>
      <p>Round: {{computedRound}}</p>
      <p>ScoreCard: {{roundScore}}</p>
      <div v-for="p in game.players" :key="p.id">
        <strong>Name: {{p.name}}</strong>
        <select v-if="p.name === yourName & p.useCards[game.round] === 0" v-model="chooseCard" id="choose_card" name="choose_card">
          <option v-for="c in p.hasCards" :key="c.id" :value="c">{{c}}</option>
        </select>
        <button v-if="p.name === yourName & p.useCards[game.round] === 0" v-on:click="submitCard()">submit</button>
        <strong v-if="p.useCards[game.round] !== 0"> Done</strong>
        <strong v-if="p.useCards[game.round] === 0"> Choosing</strong>
      </div>
      <button v-if="canGoResult" v-on:click="goResult()">GoResult</button>
      <button v-if="canGoNextRound" v-on:click="nextRound()">nextRound</button>
      <b-field label="Log">
        <b-input maxlength="200" type="textarea" v-model="log" readonly></b-input>
      </b-field>
    </div>
  </div>
</template>

<script lang="ts">
/// <reference path="../@types/auctiongame.d.ts" />
import Vue from "vue";
import {GAME_STATUS} from "../utils/code.js";

type DataType = {
  gameId: string;
  yourName: string;
  chooseCard: number;
  log: string;
  game: Game;
  unsubscribe: () => void;
}

export default Vue.extend({
  name: "Waiting",
  data: function (): DataType {
    return {
      gameId: "",
      yourName: "",
      chooseCard: 0,
      log: "",
      game: {
        scoreCards:[],
        status: "0",
        isChooseing: "0",
        round: 0,
        players: [{
          id: "",
          name: "",
          hasCards: [],
          useCards: []
        }]
      },
      unsubscribe: () => {}
    };
  },
  async created () {
    const db: firebase.firestore.Firestore = this.$store.getters.db;
    this.gameId = this.$store.getters.id;
    this.yourName = this.$store.getters.name;
    if (!this.gameId || !this.yourName){
      this.$router.push("/");
    }
    this.unsubscribe = db.collection("game").doc(this.gameId)
      .onSnapshot((doc: any) => {
        this.game = doc.data();
        if (this.game.isChooseing === "1"){
          const winner = this.computedWinner(this.game.round);
          this.log = `Round${this.game.round + 1} Finished\nWinner Player: ${winner}\n` + this.log;
        }
      });
  },
  computed: {
    isWaiting: function (): boolean {
      return this.game.status === GAME_STATUS.WAITING;
    },
    isPlaying: function (): boolean {
      return this.game.status === GAME_STATUS.PLAYING;
    },
    joinPlayerNum: function (): number {
      return this.game.players.length;
    },
    canStartPlayerNum: function (): boolean {
      return this.joinPlayerNum < 3;
    },
    computedRound: function (): string {
      return String(this.game.round + 1);
    },
    roundScore: function (): number{
      return this.computedRoundScore(this.game.round, 0);
    },
    canGoResult: function (): boolean{
      return this.game.players.find(p => p.useCards[this.game.round] === 0) === undefined && this.game.isChooseing === "0";
    },
    canGoNextRound: function (): boolean{
      return this.game.players.find(p => p.useCards[this.game.round] === 0) === undefined && this.game.isChooseing === "1";
    }
  },
  methods: {
    async start () : Promise<void>{
      const db: firebase.firestore.Firestore = this.$store.getters.db;
      await db.collection("game").doc(this.gameId).update({status: "1"});
    },
    async submitCard () : Promise<void>{
      const db: firebase.firestore.Firestore = this.$store.getters.db;
      let players = this.game.players;
      let youIndex = players.findIndex(p => p.name === this.yourName);
      let you = players[youIndex];
      you.useCards[this.game.round] = this.chooseCard;
      players[youIndex] = you;
      await db.collection("game").doc(this.gameId).update({players: players});
    },
    async goResult (): Promise<void> {
      const db: firebase.firestore.Firestore = this.$store.getters.db;
      await db.collection("game").doc(this.gameId).update({isChooseing: "1"});
    },
    async nextRound (): Promise<void> {
      const db: firebase.firestore.Firestore = this.$store.getters.db;
      const nextRound = this.game.round + 1;
      await db.collection("game").doc(this.gameId).update({round: nextRound, isChooseing: "0"});
    },
    computedRoundScore (round:number, addScore: number): number{
      const scoreCards = this.game.scoreCards[round];
      if (round === 0){
        return addScore + scoreCards;
      } else if (round > 0){
        const usedCardsBeforeRound = this.game.players.map(p => p.useCards[round - 1]);
        const removeDuplicate = Array.from(new Set(usedCardsBeforeRound));
        if (removeDuplicate.length === 1 && removeDuplicate[0] !== 0){
          this.computedRoundScore(round - 1, addScore + scoreCards);
        } else {
          return addScore + scoreCards;
        }
      }
      return 0;
    },
    computedWinner (round:number): string{
      const roundScore = this.computedRoundScore(round, 0);
      const players = this.game.players;
      const min = players.map(p => p.useCards[round]).reduce((a, b)=>Math.min(a, b));
      const max = players.map(p => p.useCards[round]).reduce((a, b)=>Math.max(a, b));
      if (roundScore < 0){
        if (min === 0){
          return "Notyet Round";
        } else {
          const minPlayers = players.filter(p => p.useCards[round] === min);
          if (minPlayers.length !== 1){
            return "No Winner";
          }
          return minPlayers[0].name;
        }
      } else if (0 < roundScore){
        if (max === 0){
          return "Notyet Round";
        } else {
          const maxPlayers = players.filter(p => p.useCards[round] === max);
          if (maxPlayers.length !== 1){
            return "No Winner";
          }
          return maxPlayers[0].name;
        }
      } else {
        return "Notyet Round";
      }
    }
  }
});
</script>