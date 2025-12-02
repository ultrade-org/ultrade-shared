export enum SettingIds {
  ENABLED = 'company.enabled',
  APP_TITLE = 'company.appTitle',
  DOMAIN = 'company.domain',
  LOGO = 'appearance.logo',
  AMM = 'product.amm',
  OBDEX = 'product.obdex',
  THEMES = 'appearance.themes',
  DIRECT_SETTLE = 'company.directSettlement',
  AMM_FEE = 'company.ammFee',
  FEE_SHARE = 'company.feeShare',
  MIN_FEE = 'company.minFee',
  MAKER_FEE = 'company.makerFee',
  TAKER_FEE = 'company.takerFee',
  GEOBLOCK = 'company.geoblock',
  EMBEDDED_APP_URL = 'company.embeddedAppUrl',
  PRODUCT_OBDEX = 'product.obdex',
  PRODUCT_AMM = 'product.amm',
  NEW_TAB = 'appearance.newTab',
  APPEARANCE_TARGET = 'appearance.target',
  CUSTOM_MENU_ITEMS = 'appearance.customMenuItems',
  REPORT_BUTTONS = 'appearance.reportButtons',
  APPEARANCE_CHART_TYPE = 'appearance.chartType',
  APPEARANCE_CHART_INT = 'appearance.chartInt',
  PINNED_PAIRS = 'markets.pinnedPairs',
  KYC_TRADE_REQUIREMENT_ENABLED = 'markets.kycTradeRequirementEnabled',
  AFFILIATE_DASHBOARD_VISIBILITY = 'product.affiliateDashboardVisibility',
  AFFILIATE_DASHBOARD_THRESHOLD = 'product.affiliateDashboardThreshold',
  AFFILIATE_DEFAULT_FEE_SHARE = 'product.affiliateDefaultFeeShare',
  AFFILIATE_POINTS_REWARD = 'product.affiliatePointsReward',
  POINT_SYSTEM_MODE = 'product.pointSystem',
  POINT_SYSTEM_TELEGRAM_API_TOKEN = 'point-system.telegramApiToken',
  POINT_SYSTEM_TELEGRAM_ENABLED = 'point-system.telegramEnabled',
  POINT_SYSTEM_TELEGRAM_GROUP_ID = 'point-system.telegramGroupId',
  POINT_SYSTEM_TELEGRAM_BOT_NAME = 'point-system.telegramBotName',
  POINT_SYSTEM_TELEGRAM_BOT_ID = 'point-system.telegramBotId',
  POINT_SYSTEM_TELEGRAM_GROUP_NAME = 'point-system.telegramGroupName',
  POINT_SYSTEM_TELEGRAM_WEBHOOK_TOKEN = 'point-system.telegramWebhookToken',
  POINT_SYSTEM_DISCORD_CLIENT_ID = 'point-system.discordClientId',
  POINT_SYSTEM_DISCORD_CLIENT_SECRET = 'point-system.discordClientSecret',
  POINT_SYSTEM_DISCORD_SERVER_ID = 'point-system.discordServerId',
  POINT_SYSTEM_DISCORD_ENABLED = 'point-system.discordEnabled',
  POINT_SYSTEM_TWITTER_CLIENT_ID = 'point-system.twitterClientId',
  POINT_SYSTEM_TWITTER_CLIENT_SECRET = 'point-system.twitterClientSecret',
  POINT_SYSTEM_TWITTER_BEARER_TOKEN = 'point-system.twitterBearerToken',
  POINT_SYSTEM_TWITTER_REFRESH_TOKEN = 'point-system.twitterRefreshToken',
  POINT_SYSTEM_TWITTER_ENABLED = 'point-system.twitterEnabled',
  POINT_SYSTEM_TWITTER_JOB_ENABLED = 'point-system.twitterJobEnabled',
  POINT_SYSTEM_TWITTER_HASHTAGS = 'point-system.twitterHashtags',
  POINT_SYSTEM_TWITTER_TWEET_EXP_TIME = 'point-system.twitterPostDefaultExpirationTime',
  POINT_SYSTEM_TWITTER_ACCOUNT_NAME = 'point-system.twitterAccountName',
  POINT_SYSTEM_TWITTER_ACCOUNT_ID = 'point-system.twitterAccountId',
  POINT_SYSTEM_TWITTER_WEBHOOK_TOKEN = 'point-system.twitterWebhookToken',
  POINT_SYSTEM_GUIDE_LINK = 'point-system.guideLink',
}

export type OptionalSettings = {
  [key in SettingIds]?: string;
};

type ValidationFunction = (companyId: number, data: string, userId: number, roleId: number) => any;

export type SettingsValidationMap = {
  [K in SettingIds]: ValidationFunction;
};

export enum AffDashboardVisibilitySettingEnum {
  DISABLED = 'disabled',
  ENABLED_FOR_ALL = 'enabled for all',
  ENABLED_FOR_AFFILIATES = 'enabled for affiliates',
}

export enum CredentialNameEnum {
  API_TOKEN = 'apiToken',
  CLIENT_ID = 'clientId',
  CLIENT_SECRET = 'clientSecret',
  BEARER_TOKEN = 'bearerToken',
  REFRESH_TOKEN = 'refreshToken',
  ACCESS_TOKEN = 'accessToken',
}

export const settingIdToSecretType = {
  'point-system.telegramApiToken': CredentialNameEnum.API_TOKEN,
  'point-system.discordClientId': CredentialNameEnum.CLIENT_ID,
  'point-system.discordClientSecret': CredentialNameEnum.CLIENT_SECRET,
  'point-system.twitterClientSecret': CredentialNameEnum.CLIENT_SECRET,
  'point-system.twitterClientId': CredentialNameEnum.CLIENT_ID,
  'point-system.twitterBearerToken': CredentialNameEnum.BEARER_TOKEN,
  'point-system.twitterRefreshToken': CredentialNameEnum.REFRESH_TOKEN,
};

export type DiscordCredentials = {
  [CredentialNameEnum.CLIENT_ID]?: string;
  [CredentialNameEnum.CLIENT_SECRET]?: string;
};

export type TwitterCredentials = {
  [CredentialNameEnum.CLIENT_ID]: string;
  [CredentialNameEnum.CLIENT_SECRET]: string;
  [CredentialNameEnum.BEARER_TOKEN]: string;
  [CredentialNameEnum.REFRESH_TOKEN]: string;
};

export type TelegramCredentials = {
  [CredentialNameEnum.API_TOKEN]: string | null;
};

export type themeId = 'theme1' | 'theme2' | 'theme3';

export interface PostSettings {
  companyId?: number;
  settings: OptionalSettings;
}

export interface ThemeObj {
  name: string;
  id: themeId;
  active: boolean;
  colors: string;
  chartColors: string;
}

export interface DbThemes {
  theme1: {
    name: string;
    active: boolean;
    value: string;
    chartValue: string;
  };
  theme2: {
    name: string;
    active: boolean;
    value: string;
    chartValue: string;
  };
  theme3: {
    name: string;
    active: boolean;
    value: string;
    chartValue: string;
  };
}

export interface LogoObj {
  id: themeId;
  value: string;
  active: boolean;
}

export interface DbLogo {
  theme1: {
    value: string;
    active: boolean;
  };
  theme2: {
    value: string;
    active: boolean;
  };
  theme3: {
    value: string;
    active: boolean;
  };
}

export interface PinPairSetting {
  pairId: number;
  action: 'add' | 'remove' | 'up' | 'down';
}

export type PostTelegramSettings = Partial<
  Pick<Record<SettingIds, string>, SettingIds.POINT_SYSTEM_TELEGRAM_API_TOKEN | SettingIds.POINT_SYSTEM_TELEGRAM_ENABLED>
>;

export const requiredColors = [
  'primary-1',
  'primary-2',
  'main-background',
  'primary-text',
  'module-background',
  'buy-text',
  'buy-background',
  'sell-text',
  'sell-background',
  'secondary-text',
  'input-background-default',
  'input-background-hover',
  'input-background-disabled',
  'input-border-default',
  'module-border',
  'button-disabled',
  'button-border',
  'input-border-active',
  'active-element-default',
  'hover-element-default',
  'dropdown-shadow',
  'button-text',
  'pair-active-row',
] as const;

export const defaultLogoSettingValue =
  `{"theme1":{"value":"${process.env.FRONTEND_URL}/Theme%3DDark.svg","active":true},"theme2":{"value":"${process.env.FRONTEND_URL}/Theme%3DLight.svg","active":true},"theme3":{"value":"${process.env.FRONTEND_URL}/Theme%3DLight.svg","active":true}}` as const;
export const defaultThemeSettingValue =
  '{"theme1":{"name":"dark","active":true,"value":{"primary-1":"rgba(118, 63, 229, 1)","primary-2":"rgba(249, 132, 146, 1)","main-background":"rgba(1, 1, 1, 1)","primary-text":"rgba(255, 255, 255, 1)","module-background":"rgba(19, 23, 34, 1)","buy-text":"rgba(82, 164, 154, 1)","buy-background":"rgba(2, 199, 122, 0.25)","sell-text":"rgba(221, 94, 86, 1)","sell-background":"rgba(255, 59, 105, 0.25)","secondary-text":"rgba(127, 127, 127, 1)","input-background-default":"rgba(13, 15, 21, 1)","input-background-hover":"rgba(28, 33, 45, 1)","input-background-disabled":"rgba(25, 29, 41, 1)","input-border-default":"rgba(28, 33, 45, 1)","module-border":"rgba(28, 33, 45, 1)","button-disabled":"rgba(111, 113, 118, 1)","button-border":"rgba(255, 255, 255, 1)","input-border-active":"rgba(185, 163, 238, 1)","active-element-default":"rgba(230, 136, 150, 1)","hover-element-default":"rgba(185, 163, 238, 1)","dropdown-shadow":"rgba(154, 92, 253, 0.45)","button-text":"rgba(255, 255, 255, 1)","pair-active-row":"rgba(28, 33, 45, 1)"}},"theme2":{"name":"light","active":true,"value":{"primary-1":"rgba(118, 63, 229, 1)","primary-2":"rgba(249, 132, 146, 1)","main-background":"rgba(249, 248, 248, 1)","primary-text":"rgba(0, 0, 0, 1)","module-background":"rgba(255, 255, 255, 1)","buy-text":"rgba(0, 112, 98, 1)","buy-background":"rgba(0, 112, 98, 0.25)","sell-text":"rgba(195, 12, 1, 1)","sell-background":"rgba(255, 59, 105, 0.25)","secondary-text":"rgba(127, 127, 127, 1)","button-disabled":"rgba(203, 199, 199, 1)","input-background-default":"rgba(255, 255, 255, 1)","input-background-hover":"rgba(249, 248, 248, 1)","input-background-disabled":"rgba(249, 248, 248, 1)","input-border-default":"rgba(228, 225, 225, 1)","module-border":"rgba(228, 225, 225, 1)","button-border":"rgba(170, 167, 167, 1)","input-border-active":"rgba(0, 0, 0, 1)","active-element-default":"rgba(230, 136, 150, 1)","hover-element-default":"rgba(185, 163, 238, 1)","dropdown-shadow":"rgba(154, 92, 253, 0.45)","button-text":"rgba(255, 255, 255, 1)","pair-active-row":"rgb(249, 248, 248)"}},"theme3":{"name":"purple","active":true,"value":{"primary-1":"rgba(118, 63, 229, 1)","primary-2":"rgba(249, 132, 146, 1)","main-background":"rgba(255, 255, 255, 1)","primary-text":"rgba(0, 0, 0, 1)","secondary-text":"rgba(127, 127, 127, 1)","buy-text":"rgba(0, 112, 98, 1)","sell-text":"rgba(195, 12, 1, 1)","buy-background":"rgba(0, 112, 98, 0.25)","sell-background":"rgba(255, 59, 105, 0.25)","module-background":"rgba(254, 250, 255, 1)","module-border":"rgba(228, 225, 225, 1)","input-background-default":"rgba(255, 255, 255, 1)","input-background-hover":"rgba(249, 248, 248, 1)","input-background-disabled":"rgba(254, 250, 255, 1)","input-border-default":"rgba(228, 225, 225, 1)","input-border-active":"rgba(0, 0, 0, 1)","button-border":"rgba(170, 167, 167, 1)","button-disabled":"rgba(203, 199, 199, 1)","active-element-default":"rgba(230, 136, 150, 1)","hover-element-default":"rgba(185, 163, 238, 1)","dropdown-shadow":"rgba(154, 92, 253, 0.45)","button-text":"rgba(255, 255, 255, 1)","pair-active-row":"rgb(249, 248, 248)"}}}' as const;

export enum defaultThemesValue {
  theme1 = '{"name":"dark","id":"theme1","active":true, "chartColors":{"bullish_candle_color": "rgba(2, 199, 122, 0.25)","bearish_candle_color": "rgba(221, 94, 86, 1)","bullish_wick_color": "rgba(2, 199, 122, 0.25)","bearish_wick_color": "rgba(221, 94, 86, 1)","bullish_outline_color": "rgba(2, 199, 122, 0.25)","bearish_outline_color": "rgba(221, 94, 86, 1)","line_color": "rgba(41, 98, 255, 1)","chart_background": "rgba(19, 23, 34, 1)","chart_text": "rgba(127, 127, 127, 1)"}, "colors":{"primary-1":"rgba(118, 63, 229, 1)","primary-2":"rgba(249, 132, 146, 1)","main-background":"rgba(1, 1, 1, 1)","primary-text":"rgba(255, 255, 255, 1)","module-background":"rgba(19, 23, 34, 1)","buy-text":"rgba(82, 164, 154, 1)","buy-background":"rgba(2, 199, 122, 0.25)","sell-text":"rgba(221, 94, 86, 1)","sell-background":"rgba(255, 59, 105, 0.25)","secondary-text":"rgba(127, 127, 127, 1)","input-background-default":"rgba(13, 15, 21, 1)","input-background-hover":"rgba(28, 33, 45, 1)","input-background-disabled":"rgba(25, 29, 41, 1)","input-border-default":"rgba(28, 33, 45, 1)","module-border":"rgba(28, 33, 45, 1)","button-disabled":"rgba(111, 113, 118, 1)","button-border":"rgba(255, 255, 255, 1)","input-border-active":"rgba(185, 163, 238, 1)","active-element-default":"rgba(230, 136, 150, 1)","hover-element-default":"rgba(185, 163, 238, 1)","dropdown-shadow":"rgba(154, 92, 253, 0.45)","button-text":"rgba(255, 255, 255, 1)","pair-active-row":"rgba(28, 33, 45, 1)"}}',
  theme2 = '{"name":"light","id":"theme2","active":true, "chartColors":{"bullish_candle_color": "rgba(0, 112, 98, 1)","bearish_candle_color": "rgba(195, 12, 1, 1)","bullish_wick_color": "rgba(0, 112, 98, 1)","bearish_wick_color": "rgba(195, 12, 1, 1)","bullish_outline_color": "rgba(0, 112, 98, 1)","bearish_outline_color": "rgba(195, 12, 1, 1)","line_color": "rgba(41, 98, 255, 1)","chart_background": "rgba(255, 255, 255, 1)","chart_text": "rgba(127, 127, 127, 1)"}, "colors":{"primary-1":"rgba(118, 63, 229, 1)","primary-2":"rgba(249, 132, 146, 1)","main-background":"rgba(249, 248, 248, 1)","primary-text":"rgba(0, 0, 0, 1)","module-background":"rgba(255, 255, 255, 1)","buy-text":"rgba(0, 112, 98, 1)","buy-background":"rgba(0, 112, 98, 0.25)","sell-text":"rgba(195, 12, 1, 1)","sell-background":"rgba(255, 59, 105, 0.25)","secondary-text":"rgba(127, 127, 127, 1)","button-disabled":"rgba(203, 199, 199, 1)","input-background-default":"rgba(255, 255, 255, 1)","input-background-hover":"rgba(249, 248, 248, 1)","input-background-disabled":"rgba(249, 248, 248, 1)","input-border-default":"rgba(228, 225, 225, 1)","module-border":"rgba(228, 225, 225, 1)","button-border":"rgba(170, 167, 167, 1)","input-border-active":"rgba(0, 0, 0, 1)","active-element-default":"rgba(230, 136, 150, 1)","hover-element-default":"rgba(185, 163, 238, 1)","dropdown-shadow":"rgba(154, 92, 253, 0.45)","button-text":"rgba(255, 255, 255, 1)","pair-active-row":"rgb(249, 248, 248)"}}',
  theme3 = '{"name":"purple","id":"theme3","active":true, "chartColors":{"bullish_candle_color": "rgba(0, 112, 98, 1)","bearish_candle_color": "rgba(195, 12, 1, 1)","bullish_wick_color": "rgba(0, 112, 98, 1)","bearish_wick_color": "rgba(195, 12, 1, 1)","bullish_outline_color": "rgba(0, 112, 98, 1)","bearish_outline_color": "rgba(195, 12, 1, 1)","line_color": "rgba(41, 98, 255, 1)","chart_background": "rgba(254, 250, 255, 1)","chart_text": "rgba(127, 127, 127, 1)"}, "colors":{"primary-1":"rgba(118, 63, 229, 1)","primary-2":"rgba(249, 132, 146, 1)","main-background":"rgba(255, 255, 255, 1)","primary-text":"rgba(0, 0, 0, 1)","secondary-text":"rgba(127, 127, 127, 1)","buy-text":"rgba(0, 112, 98, 1)","sell-text":"rgba(195, 12, 1, 1)","buy-background":"rgba(0, 112, 98, 0.25)","sell-background":"rgba(255, 59, 105, 0.25)","module-background":"rgba(254, 250, 255, 1)","module-border":"rgba(228, 225, 225, 1)","input-background-default":"rgba(255, 255, 255, 1)","input-background-hover":"rgba(249, 248, 248, 1)","input-background-disabled":"rgba(254, 250, 255, 1)","input-border-default":"rgba(228, 225, 225, 1)","input-border-active":"rgba(0, 0, 0, 1)","button-border":"rgba(170, 167, 167, 1)","button-disabled":"rgba(203, 199, 199, 1)","active-element-default":"rgba(230, 136, 150, 1)","hover-element-default":"rgba(185, 163, 238, 1)","dropdown-shadow":"rgba(154, 92, 253, 0.45)","button-text":"rgba(255, 255, 255, 1)","pair-active-row":"rgb(249, 248, 248)"}}',
}
