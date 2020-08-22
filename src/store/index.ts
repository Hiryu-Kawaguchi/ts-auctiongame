import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    name: "",
    id: "",
    game: {
      scoreCards: [],
      status: 0,
      round: 0,
      players: [{
        id: "",
        name: "",
        hasCards: [],
      }]
    },
    db: null
  },
  mutations: {
    setName(state,payload){
      state.name = payload;
    },
    setGame(state,payload){
      state.game = payload;
    },
    setDB(state,payload){
      state.db = payload;
    },
    setId(state,payload){
      state.id = payload;
    }
  },
  getters: {
    name(state){
      return state.name;
    },
    game(state){
      return state.game;
    },
    db(state){
      return state.db;
    },
    id(state){
      return state.id;
    }
  },
  actions: {
  },
  modules: {
  }
});
