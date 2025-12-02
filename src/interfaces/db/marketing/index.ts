export interface IActionTable {
  id: number;
  action_dict: string;
  unique_id: string;
}

export interface IUserRecord {
  id: number;
  points: number;
  twitter_user_id: string;
  telegram_user_id: string;
  discord_user_id: string;
  reddit_user_id: string;
  unique_id: string;
  last_deducted_timestamp: number;
  received_award_ids: string;
}

export interface ITrackInvitesModel {
  id: number;
  inviter_id: string;
  invitee_id: string;
  unique_id: string;
}

export interface IMessagingModel {
  id: number;
  unique_id: number;
  data: string;
  msg_type: string;
  active: boolean;
}

export interface IWeeklyDeductionTable {
  id: number;
  length: number;
  unique_id: string;
  values_array: string;
}

export interface ITrackUserPoints {
  id: number;
  user_record_id: string;
  event: string;
  point_difference: number;
  unique_id: string;
}

export interface IVipLevelTable {
  id: number;
  length: number;
  unique_id: string;
  values_array: string;
}

