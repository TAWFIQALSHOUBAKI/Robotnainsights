export interface Row { seg: string; spend: number; results: number; impressions: number; reach: number; cpr: number }
export interface AdRow { name: string; adset: string; spend: number; results: number; impressions: number; reach: number; cpr: number }
export interface WeekRow { week: string; spend: number; results: number; impressions: number; reach: number; cpr: number }
export interface AdSetRow { name: string; spend: number; results: number; impressions: number; reach: number; cpr: number }

export const META = {
  campaign:   'Engagements_Robotna_',
  objective:  'Outcome Engagement',
  status:     'Active',
  account:    '36890470',
  campaignId: '6939423326522',
  source:     'Analysis-Report.csv',
}

export const CORE = {
  spend:       96.57,
  avgDaily:    48.28,
  reach:       148000,
  impressions: 176458,
  results:     72410,
  cpr:         0.001334,
  engRate:     41.04,
}

export const WEEKLY: WeekRow[] = [
  { week: 'May 7–13',  spend: 68.570, results: 50428, impressions: 126407, reach: 103297, cpr: 0.001360 },
  { week: 'May 14–15', spend: 27.996, results: 21982, impressions:  50051, reach:  44703, cpr: 0.001274 },
]

export const ADSETS: AdSetRow[] = [
  { name: 'DM_Broad_AMM_ZAR_IRB', spend: 62.78, results: 46285, impressions: 115964, reach: 97504, cpr: 0.001356 },
  { name: 'Parents_Braod_AMM',    spend: 33.79, results: 26125, impressions:  60494, reach: 50496, cpr: 0.001293 },
]

export const ADS: AdRow[] = [
  { name: 'لغة الأرقام_Reel',            adset: 'DM_Broad_AMM_ZAR_IRB', spend: 58.67, results: 43857, impressions: 107078, reach: 89162, cpr: 0.001338 },
  { name: 'رسالة لكل أب وأم_Reel',      adset: 'Parents_Braod_AMM',    spend: 33.79, results: 26125, impressions:  60494, reach: 50496, cpr: 0.001293 },
  { name: 'شغف الطالب عندما يعود_Reel', adset: 'DM_Broad_AMM_ZAR_IRB', spend:  1.44, results:   743, impressions:   2850, reach:  2644, cpr: 0.001938 },
  { name: 'نشاط الروبوتكس اليوم_Reel',  adset: 'DM_Broad_AMM_ZAR_IRB', spend:  1.19, results:   724, impressions:   2398, reach:  2264, cpr: 0.001644 },
  { name: 'الفرق بين حصة حاسوب_Reel',   adset: 'DM_Broad_AMM_ZAR_IRB', spend:  0.88, results:   585, impressions:   2277, reach:  2143, cpr: 0.001504 },
  { name: 'شراء أجهزة حديثة_Reel',      adset: 'DM_Broad_AMM_ZAR_IRB', spend:  0.60, results:   376, impressions:   1361, reach:  1291, cpr: 0.001596 },
]

export const AGE: Row[] = [
  { seg: '18–24', spend:  1.00, results:  1069, impressions:  2681, reach:  2353, cpr: 0.000936 },
  { seg: '25–34', spend: 24.44, results: 17129, impressions: 45662, reach: 37367, cpr: 0.001427 },
  { seg: '35–44', spend: 21.99, results: 15045, impressions: 41810, reach: 34976, cpr: 0.001462 },
  { seg: '45–54', spend: 33.17, results: 24045, impressions: 60659, reach: 50421, cpr: 0.001380 },
  { seg: '55–64', spend:  6.32, results:  6014, impressions: 11142, reach: 10176, cpr: 0.001050 },
  { seg: '65+',   spend:  9.64, results:  9108, impressions: 14504, reach: 12707, cpr: 0.001059 },
]

export const GENDER: Row[] = [
  { seg: 'Male',    spend: 54.56, results: 41008, impressions: 106511, reach: 88099, cpr: 0.001331 },
  { seg: 'Female',  spend: 41.50, results: 31028, impressions:  69091, reach: 59175, cpr: 0.001338 },
  { seg: 'Unknown', spend:  0.50, results:   374, impressions:    856, reach:   726, cpr: 0.001338 },
]

export const AGE_BY_ADSET: Record<string, Row[]> = {
  'DM_Broad_AMM_ZAR_IRB': [
    { seg: '18–24', spend:  0.69, results:   705, impressions:  1856, reach:  1604, cpr: 0.000980 },
    { seg: '25–34', spend: 15.17, results: 10526, impressions: 29415, reach: 24067, cpr: 0.001442 },
    { seg: '35–44', spend: 14.12, results:  9522, impressions: 27391, reach: 22931, cpr: 0.001483 },
    { seg: '45–54', spend: 21.18, results: 15021, impressions: 38799, reach: 32347, cpr: 0.001410 },
    { seg: '55–64', spend:  4.77, results:  4307, impressions:  8143, reach:  7458, cpr: 0.001107 },
    { seg: '65+',   spend:  6.84, results:  6204, impressions: 10360, reach:  9097, cpr: 0.001103 },
  ],
  'Parents_Braod_AMM': [
    { seg: '18–24', spend:  0.31, results:   364, impressions:   825, reach:   749, cpr: 0.000852 },
    { seg: '25–34', spend:  9.27, results:  6603, impressions: 16247, reach: 13300, cpr: 0.001404 },
    { seg: '35–44', spend:  7.87, results:  5523, impressions: 14419, reach: 12045, cpr: 0.001425 },
    { seg: '45–54', spend: 11.99, results:  9024, impressions: 21860, reach: 18074, cpr: 0.001329 },
    { seg: '55–64', spend:  1.55, results:  1707, impressions:  2999, reach:  2718, cpr: 0.000908 },
    { seg: '65+',   spend:  2.80, results:  2904, impressions:  4144, reach:  3610, cpr: 0.000964 },
  ],
}
