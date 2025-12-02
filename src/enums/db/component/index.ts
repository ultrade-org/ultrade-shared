
export enum ComponentStatusType {
  ACTIVE = "ACTIVE",
  FAILED = "FAILED",
  STARTING = "STARTING",
  DRAINING = "DRAINING",
  TERMINATING = "TERMINATING",
  TERMINATED = "TERMINATED",
}

export enum ComponentType {
  MATCHING_ENGINE = "me",
  ORDER_SERVICE = "ors",
  API = "api",
  SOCKET_SERVICE = "ws",
  TRANSACTION_SERVICE = "tns",
}

export enum PairComponentStatusType {
  ACTIVE = "ACTIVE",
  FAILED = "FAILED",
  UNASSIGNED = "UNASSIGNED",
  ASSIGNED = "ASSIGNED",
  STARTING = "STARTING",
}
