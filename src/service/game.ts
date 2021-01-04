import firebase from "firebase";

export default class GameService {
  
  static async connectDB (){
    const response = await fetch('/__/firebase/init.json');
    firebase.initializeApp(await response.json());
    return firebase.firestore();
  }

  static async anonymousAuth (){
    try {
      await firebase.auth().signInAnonymously();
    } catch (err){
      // 特に何もしない
    }
  }

  static generateUuid (){
    const chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");
    for (let i = 0, len = chars.length; i < len; i++) {
      switch (chars[i]) {
      case "x":
        chars[i] = Math.floor(Math.random() * 16).toString(16);
        break;
      case "y":
        chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
        break;
      }
    }
    return chars.join("");
  }

  static shuffle ([...array]) {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}