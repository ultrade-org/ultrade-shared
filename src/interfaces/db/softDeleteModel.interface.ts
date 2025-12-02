import { IBaseModel } from "./baseModel.interface";

export interface ISoftDeleteModel extends IBaseModel {
  deleted_on: Date;
};
