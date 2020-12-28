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
      <p>Round: {{game.round}}</p>
      <p v-for="p in game.players" :key="p.id">PlayerName: {{p.name}}</p>
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
  game: Game;
  unsubscribe: () => void;
}

export default Vue.extend({
  name: "Waiting",
  data: function(): DataType {
    return {
      gameId: "",
      yourName: "",
      game: {
        scoreCards:[],
        status: "0",
        round: 0,
        players: [{
          id: "",
          name: "",
          hasCards: [],
        }]
      },
      unsubscribe: () => {}
    };
  },
  async created() {
    const db: firebase.firestore.Firestore = this.$store.getters.db;
    this.gameId = this.$store.getters.id;
    this.yourName = this.$store.getters.name;
    this.unsubscribe = db.collection("game").doc(this.gameId)
      .onSnapshot((doc: any) => {
        this.game = doc.data();
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
    }
  },
  methods: {
    async start() {
      const db: firebase.firestore.Firestore = this.$store.getters.db;
      await db.collection("game").doc(this.gameId).update({status: "1"});
    }
  }
});
</script>