import { DBAffiliate } from '@interfaces';

export interface SummaryStat {
  value: number | null;
  trend: number | null;
}

export interface TrendStat {
  value: number;
  time: number;
}

// Affiliate dashboard types

export interface AffiliateStats<StatType> {
  totalRevenue: StatType;
  linkClicks: StatType;
  registrations: StatType;
  firstTimeDepositors: StatType;
  totalTradingVolume: StatType;
  totalFees: StatType;
}

export interface DashboardInfo {
  feeShare: number;
  referralLink: string;
  summaryStats: SummaryStats;
  trendStats: TrendStats | null;
}

export interface RegularStats extends AffiliateStats<number> {}
export interface SummaryStats extends AffiliateStats<SummaryStat> {}
export interface TrendStats extends AffiliateStats<TrendStat[]> {}

// WL Admin Affiliate dashboard types

export interface WLAffiliateStats<StatType> {
  totalRevenue: StatType;
  conversionRate: StatType;
  registrations: StatType;
  totalTradingVolume: StatType;
  qualifiedReferrers: StatType;
  totalAffiliateRevenue: StatType;
}

export interface WLRegularStats {
  totalRevenue: number;
  registrations: number;
  totalTradingVolume: number;
  totalAffiliateRevenue: number;
  firstTimeDepositors: number;
}

export interface WLSummaryStats extends WLAffiliateStats<SummaryStat> {}
export interface WLTrendStats extends WLAffiliateStats<TrendStat[]> {}

export interface WLDashboardInfo {
  summaryStats: WLSummaryStats;
  trendStats: WLTrendStats | null;
}

export interface MappedAffiliateData extends DBAffiliate {
  totalAffiliateRevenue: number;
  totalCompanyRevenueFromAffiliate: number;
}

export interface CompanyAffiliateStats {
  address: string;
  createdAt: Date;
  tradingVolume: number;
  referrals: number;
  feeShare: number;
}

export interface AffiliatePerformance {
  totalUsersReferred: SummaryStat;
  totalRevenue: SummaryStat;
  currentMonthReferrals: SummaryStat;
  currentMonthRevenue: SummaryStat;
  averageUserValue: SummaryStat;
  conversionRate: SummaryStat;
}
