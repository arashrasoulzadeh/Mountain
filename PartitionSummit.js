import MountainStore from "./MountainStore";

export default class PartitionSummit extends MountainStore {

  static privateApi;

  constructor() {
    super("Partition");
  }

}
