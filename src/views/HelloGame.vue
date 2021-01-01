<template>
  <div class="home">
      <b-field label="UserName" label-position="on-border">
            <b-input v-model="name" placeholder="Kevin"></b-input>
      </b-field>
      <b-switch v-model="isNewGame">
        NewGame
      </b-switch>
      <b-field label="GameID" label-position="on-border">
            <b-input :disabled="isNewGame" v-model="gameId" placeholder="xxxxxxxxxxxxxxxx"></b-input>
      </b-field>
      <div class="buttons">
            <b-button type="is-primary" @click="onclick()" expanded>{{submitButtonTitle}}</b-button>
        </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import GameService from "../service/game";

type DataType = {
  name: string,
  gameId: string,
  isNewGame: boolean
}

export default Vue.extend({
  name: "HelloGame",
  data: function () : DataType {
    return {
      name: "",
      gameId: "",
      isNewGame: true
    };
  },
  async created () {
    const db = await GameService.connectDB();
    this.$store.commit('setDB', db);
  },
  computed: {
    submitButtonTitle: function () : string {
      return this.isNewGame ? "Create Game" : "Join Game"; 
    }
  },
  methods: {
    alert (title:string) {
      this.$buefy.dialog.alert(title);
    },
    async onclick () {
      if (!this.name){
        this.alert("Fill Out name");
        return;
      }
      this.$store.commit('setName', this.name);
      const db = this.$store.getters.db;
      if (!this.isNewGame){
        if (!this.gameId){
          this.alert("Fill Out gameID");
          return;
        }
        const gameDoc = await db.collection("game").doc(this.gameId).get();
        if (!gameDoc.exists){
          this.alert("not exists game");
          return;
        }
        const newUser = {
          id: GameService.generateUuid(),
          name: this.name,
          hasCards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
          useCards: Array(15).fill(0)
        };
        const players = gameDoc.data().players;
        players.push(newUser);
        await db.collection("game").doc(this.gameId).update({players});
        this.$store.commit('setId', gameDoc.id);
      } else {
        try {
          const scoreCards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, -1, -2, -3, -4, -5];
          const res = await db.collection("game").add({
            scoreCards: GameService.shuffle(scoreCards),
            status: "0",
            isChooseing: "0",
            round: 0,
            players: [{
              id: GameService.generateUuid(),
              name: this.name,
              hasCards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
              useCards: Array(15).fill(0)
            }]
          });
          this.$store.commit('setId', res.id);
        } catch (err){
          console.log("err", err);
        }
      }
      this.$router.push("waiting");
    }
  }
});
</script>