<template>
  <div>
    <b-steps :value="activeStep" :animated="false" :has-navigation="false" :mobile-mode="null">
        <b-step-item step="1" label="待機中..">
        </b-step-item>
        <b-step-item step="2" label="選択中..">
        </b-step-item>
        <b-step-item step="3" label="確認中..">
        </b-step-item>
        <b-step-item step="4" label="終了..">
        </b-step-item>
    </b-steps>
    <h3 class="general_title">ゲームNo: {{gameId}}</h3>
    <h3 class="general_title">ユーザーネーム: {{yourName}}</h3>
    <div v-if="isWaiting">
      <h3 class="general_title">現在参加者数: {{joinPlayerNum}}</h3>
      <p>※3人以上から開始可能</p>
      <b-button @click="start()" :disabled="canStartPlayerNum" expanded>ゲーム開始</b-button>
    </div>
    <div v-else-if="isPlaying">
      <h3 class="general_title">ラウンド: {{computedRound}}</h3>
      <h3 class="general_value">スコアカード: {{scoreCard}}</h3>
      <h3 class="general_title">ラウンド点数: {{roundScore}}</h3>
      <div class="general_value" v-for="p in game.players" :key="p.id">
        <strong>ユーザー: {{p.name}} </strong>
        <select v-if="p.name === yourName & p.useCards[game.round] === 0" v-model="chooseCard" id="choose_card" name="choose_card">
          <option v-for="c in canUseCard(p.hasCards,p.useCards)" :key="c.id" :value="c">{{c}}</option>
        </select>
        <button v-if="p.name === yourName & p.useCards[game.round] === 0" v-on:click="submitCard()">提出</button>
        <strong v-if="p.useCards[game.round] !== 0"> 選択完了</strong>
        <strong v-if="p.useCards[game.round] === 0"> 選択中..</strong>
      </div>
      <button v-if="canGoResult" v-on:click="goResult()">GoResult</button>
      <button v-if="canGoNextRound" v-on:click="nextRound()">nextRound</button>
      <b-field label="Log" label-position="on-border">
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
        if (this.game.status === GAME_STATUS.DONE){
          let log = "GAME FINISHED";
          const players = this.computedGameWinner();
          Object.keys(players).forEach((key) => log = log + `${key}: ${players[key]}`);
          this.log = log;
        } else if (this.game.isChooseing === "1"){
          let log = "";
          this.game.players.forEach(p => {
            log = log + `${p.name}: ${p.useCards[this.game.round]}\n`;
          });
          const winner = this.computedWinner(this.game.round);
          log = log + `Round Winner: ${winner}`;
          this.log = log;
        }
      });
  },
  computed: {
    activeStep: function (): string {
      if (this.game.status  === GAME_STATUS.WAITING){
        return "1";
      } else if (this.game.status  === GAME_STATUS.PLAYING){
        return this.game.isChooseing === "0" ? "2" : "3";
      } else {
        return "4";
      }
    },
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
    scoreCard: function ():number {
      return this.game.scoreCards[this.game.round];
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
      if (15 < nextRound){
        await db.collection("game").doc(this.gameId).update({status: "2", isChooseing: "0"});
      } else {
        await db.collection("game").doc(this.gameId).update({round: nextRound, isChooseing: "0"});
      }
    },
    canUseCard (hasCards:Array<number>, useCards:Array<number>): Array<number>{
      return hasCards.filter(c => !useCards.includes(c));
    },
    computedRoundScore (round:number, addScore: number): number{
      const scoreCards = this.game.scoreCards[round];
      if (round === 0){
        return addScore + scoreCards;
      } else if (round > 0){
        const usedCardsBeforeRound = this.game.players.map(p => p.useCards[round - 1]);
        const removeDuplicate = Array.from(new Set(usedCardsBeforeRound));
        if (removeDuplicate.length === 1 && removeDuplicate[0] !== 0){
          return this.computedRoundScore(round - 1, addScore + scoreCards);
        } else {
          return addScore + scoreCards;
        }
      }
      return 0;
    },
    computedWinner (round:number): string{
      const isMinusScore = this.computedRoundScore(round, 0) > 0;
      const players = this.game.players;
      const distinctList = players.map(p => p.useCards[round]).filter((x, i, self) => self.indexOf(x) !== self.lastIndexOf(x));
      const notDisstinctList = players.map(p => p.useCards[round]).filter(c => !distinctList.includes(c));
      if (!notDisstinctList?.length){
        return "No Winner";
      }
      if (isMinusScore){
        const min = notDisstinctList.reduce((a, b)=>Math.min(a, b));
        const minPlayers = players.filter(p => p.useCards[round] === min);
        return minPlayers[0].name;
      } else {
        const max = notDisstinctList.reduce((a, b)=>Math.max(a, b));
        const maxPlayers = players.filter(p => p.useCards[round] === max);
        return maxPlayers[0].name;
      }
    },
    computedGameWinner (){
      const roundArray = Array(15).fill(0).map((_, i) => i);
      let players :{ [key:string] : number } = {};
      this.game.players.forEach(p => {
        players[p.name] = 0;
      });
      const roundScoreList = roundArray.map(i => this.computedRoundScore(i, 0));
      const roundWinnerList = roundArray.map(i => this.computedWinner(i));
      roundWinnerList.forEach((v:string, i:number) => {
        if (v !== "No Winner"){
          players[v] = players[v] + roundScoreList[i];
        }
      });
      return players;
    }
  }
});
</script>
<style>
.general_title{
  margin: 3%;
  font-size: 15px;
  text-align: center;
}
.general_value{
  margin: 1%;
  text-align: center;
}
</style>