import { AsyncStorage } from "react-native";

export default class MountainStore {

  tape = "global";
  debug = false;

  constructor(tape = "global") {
    this.tape = tape;
    if (this.debug) console.log("loaded " + this.__proto__.constructor.name);
  }

  toObject(names, values) {
    var result = {};
    for (var i = 0; i < names.length; i++)
      result[names[i]] = values[i][1];
    return result;
  }

  dumpRaw = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);
      return this.toObject(keys, items);
    } catch (error) {
      console.log(error, "problemo");
    }
  };

  strongTypeEmulator() {

  }


  async setIfNot(key, value) {
    const currentValue = this.get(key, null);
    if (currentValue === null) {
      return this.set(key, value);
    }
    return 0;
  }

  colorTrace(msg, color) {
    console.log("%c" + msg, "color:" + color + ";font-weight:bold;");
  }

  async set(key, value, convert = false) {
    try {

      await AsyncStorage.setItem(this.tape + key, convert ? JSON.stringify(value) : value);
      if (this.debug) this.colorTrace(this.__proto__.constructor.name + " " + key + "=>" + (convert ? JSON.stringify(value) : value), "green");
      return 1;
    } catch (error) {
      // Error saving data
      console.error("MountainStore Exception (set) : " + error.message);
      return 0;
    }
  }

  bindKeyToState(context, key, convert = false) {
    this.get(key).then((value) => {
      context.setState({
        [key]: convert ? JSON.parse(value) : value
      });
      this.bindKeyToState(context, key, convert);
    });
  }

  bindKeyToStateWithPrefix(context, suffix, key, convert = false) {
    this.get(suffix + "_" + key).then((value) => {
      context.setState({
        [key]: convert ? JSON.parse(value) : value
      });
      this.bindKeyToStateWithPrefix(context, key, convert);
    });
  }


  async get(key, defaultValue = null) {
    try {
      const value = await AsyncStorage.getItem(this.tape + key);
      if (value !== null) {
        if (this.debug) this.colorTrace(this.__proto__.constructor.name + " " + key + "=>" + value, "blue");
        // We have data!!
        return value;
      }
    } catch (error) {
      return defaultValue;
    }

  }


}
