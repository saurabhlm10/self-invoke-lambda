export enum StatusValues {
  SUCCESS = "success",
  IN_PROGRESS = "in-progress",
  ERROR = "error",
}

export interface RedisEntry {
  postOffset: number;
  pageOffset: number;
  status: StatusValues;
  statusMessage: string;
}
