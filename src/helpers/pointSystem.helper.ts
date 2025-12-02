import { SettingIds } from '@types';
import { ICompanySetting } from '@interfaces';

export const transformPointSystemSettings = (pointSystemSettings: ICompanySetting[]) => {
  const settingsObj: Record<SettingIds, string | boolean | undefined> = {} as Record<SettingIds, string | undefined>;
  pointSystemSettings.forEach(({ settingId, value, setting }) => {
    if (setting.type === 'boolean') {
      settingsObj[settingId as SettingIds] = value === 'true';
    } else {
      settingsObj[settingId as SettingIds] = value;
    }
  });

  return {
    discordEnabled: settingsObj[SettingIds.POINT_SYSTEM_DISCORD_ENABLED],
    telegramBotName: settingsObj[SettingIds.POINT_SYSTEM_TELEGRAM_BOT_NAME],
    telegramBotId: settingsObj[SettingIds.POINT_SYSTEM_TELEGRAM_BOT_ID],
    telegramEnabled: settingsObj[SettingIds.POINT_SYSTEM_TELEGRAM_ENABLED],
    telegramGroupId: settingsObj[SettingIds.POINT_SYSTEM_TELEGRAM_GROUP_ID],
    telegramGroupName: settingsObj[SettingIds.POINT_SYSTEM_TELEGRAM_GROUP_NAME],
    twitterAccountId: settingsObj[SettingIds.POINT_SYSTEM_TWITTER_ACCOUNT_ID],
    twitterAccountName: settingsObj[SettingIds.POINT_SYSTEM_TWITTER_ACCOUNT_NAME],
    twitterEnabled: settingsObj[SettingIds.POINT_SYSTEM_TWITTER_ENABLED],
    twitterJobEnabled: settingsObj[SettingIds.POINT_SYSTEM_TWITTER_JOB_ENABLED],
    guideLink: settingsObj[SettingIds.POINT_SYSTEM_GUIDE_LINK],
  };
};
