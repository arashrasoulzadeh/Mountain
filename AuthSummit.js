import MountainStore from "./MountainStore";

export default class AuthSummit extends MountainStore {

  static privateApi;

  constructor() {
    super("Authentication");
  }

}
