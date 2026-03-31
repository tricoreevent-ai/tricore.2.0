const iplSourceUrl =
  'https://sports.ndtv.com/ipl-2026/ipl-2026-schedule-announced-by-bcci-rcb-vs-srh-on-day-1-mi-vs-kkr-on-day-2-11201207';

const fifaSourceUrl =
  'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/match-schedule-fixtures-results-teams-stadiums';

const withIstDateTime = (date, time) => `${date}T${time}:00+05:30`;
const withUtcWindow = (date) => ({
  startDate: `${date}T12:00:00.000Z`,
  endDate: `${date}T15:00:00.000Z`
});

const buildIplMatch = ([matchNumber, date, time, homeTeam, awayTeam, venue]) => ({
  sourceId: `ipl-2026-match-${String(matchNumber).padStart(2, '0')}`,
  title: `${homeTeam} vs ${awayTeam}`,
  stageLabel: `League Match ${matchNumber}`,
  homeTeam,
  awayTeam,
  location: venue,
  startDate: withIstDateTime(date, time),
  endDate: withIstDateTime(date, time === '15:30' ? '19:00' : '23:00'),
  description: `IPL 2026 Match ${matchNumber} at ${venue}. Scheduled for ${
    time === '15:30' ? '3:30 PM IST' : '7:30 PM IST'
  }.`, 
  metadata: {
    matchNumber,
    timeLabel: time === '15:30' ? '3:30 PM IST' : '7:30 PM IST'
  }
});

const buildFifaMatch = ([matchNumber, date, slotLabel, venue, stageLabel, homeTeam = '', awayTeam = '']) => ({
  sourceId: `fifa-2026-match-${String(matchNumber).padStart(3, '0')}`,
  title: `FIFA World Cup 2026 • Match ${matchNumber}`,
  stageLabel,
  homeTeam,
  awayTeam,
  location: venue,
  ...withUtcWindow(date),
  description:
    homeTeam || awayTeam
      ? `${slotLabel} at ${venue}. Slot pairing: ${homeTeam || 'TBD'}${awayTeam ? ` vs ${awayTeam}` : ''}.`
      : `${slotLabel} at ${venue}. Team slots follow FIFA's published match schedule placeholders.`,
  metadata: {
    matchNumber,
    slotLabel,
    timeLabel: 'Kick-off time per official FIFA schedule'
  }
});

const iplPhaseOneMatches = [
  [1, '2026-03-28', '19:30', 'Royal Challengers Bengaluru', 'Sunrisers Hyderabad', 'M. Chinnaswamy Stadium, Bengaluru'],
  [2, '2026-03-29', '19:30', 'Mumbai Indians', 'Kolkata Knight Riders', 'Wankhede Stadium, Mumbai'],
  [3, '2026-03-30', '19:30', 'Rajasthan Royals', 'Chennai Super Kings', 'Barsapara Cricket Stadium, Guwahati'],
  [4, '2026-03-31', '19:30', 'Punjab Kings', 'Gujarat Titans', 'Maharaja Yadavindra Singh International Cricket Stadium, New Chandigarh'],
  [5, '2026-04-01', '19:30', 'Lucknow Super Giants', 'Delhi Capitals', 'BRSABV Ekana Cricket Stadium, Lucknow'],
  [6, '2026-04-02', '19:30', 'Kolkata Knight Riders', 'Sunrisers Hyderabad', 'Eden Gardens, Kolkata'],
  [7, '2026-04-03', '19:30', 'Chennai Super Kings', 'Punjab Kings', 'M. A. Chidambaram Stadium, Chennai'],
  [8, '2026-04-04', '15:30', 'Delhi Capitals', 'Mumbai Indians', 'Arun Jaitley Stadium, Delhi'],
  [9, '2026-04-04', '19:30', 'Gujarat Titans', 'Rajasthan Royals', 'Narendra Modi Stadium, Ahmedabad'],
  [10, '2026-04-05', '15:30', 'Sunrisers Hyderabad', 'Lucknow Super Giants', 'Rajiv Gandhi International Stadium, Hyderabad'],
  [11, '2026-04-05', '19:30', 'Royal Challengers Bengaluru', 'Chennai Super Kings', 'M. Chinnaswamy Stadium, Bengaluru'],
  [12, '2026-04-06', '19:30', 'Kolkata Knight Riders', 'Punjab Kings', 'Eden Gardens, Kolkata'],
  [13, '2026-04-07', '19:30', 'Rajasthan Royals', 'Mumbai Indians', 'Barsapara Cricket Stadium, Guwahati'],
  [14, '2026-04-08', '19:30', 'Delhi Capitals', 'Gujarat Titans', 'Arun Jaitley Stadium, Delhi'],
  [15, '2026-04-09', '19:30', 'Kolkata Knight Riders', 'Lucknow Super Giants', 'Eden Gardens, Kolkata'],
  [16, '2026-04-10', '19:30', 'Rajasthan Royals', 'Royal Challengers Bengaluru', 'Barsapara Cricket Stadium, Guwahati'],
  [17, '2026-04-11', '15:30', 'Punjab Kings', 'Sunrisers Hyderabad', 'Maharaja Yadavindra Singh International Cricket Stadium, New Chandigarh'],
  [18, '2026-04-11', '19:30', 'Chennai Super Kings', 'Delhi Capitals', 'M. A. Chidambaram Stadium, Chennai'],
  [19, '2026-04-12', '15:30', 'Lucknow Super Giants', 'Gujarat Titans', 'BRSABV Ekana Cricket Stadium, Lucknow'],
  [20, '2026-04-12', '19:30', 'Mumbai Indians', 'Royal Challengers Bengaluru', 'Wankhede Stadium, Mumbai']
];

const fifaScheduleRows = [
  [1, '2026-06-11', 'Match 1 • Group A (Mexico #1)', 'Estadio Azteca, Mexico City', 'Group A Fixture', 'Mexico #1', 'TBD'],
  [2, '2026-06-11', 'Match 2 • Group A', 'Estadio Guadalajara, Guadalajara', 'Group A Fixture'],
  [3, '2026-06-12', 'Match 3 • Group B (Canada #1)', 'Toronto Stadium, Toronto', 'Group B Fixture', 'Canada #1', 'TBD'],
  [4, '2026-06-12', 'Match 4 • Group D (USA #1)', 'Los Angeles Stadium, Los Angeles', 'Group D Fixture', 'USA #1', 'TBD'],
  [5, '2026-06-13', 'Match 5 • Group C', 'Boston Stadium, Boston', 'Group C Fixture'],
  [6, '2026-06-13', 'Match 6 • Group D', 'BC Place, Vancouver', 'Group D Fixture'],
  [7, '2026-06-13', 'Match 7 • Group C', 'New York New Jersey Stadium, New York New Jersey', 'Group C Fixture'],
  [8, '2026-06-13', 'Match 8 • Group B', 'San Francisco Bay Area Stadium, San Francisco Bay Area', 'Group B Fixture'],
  [9, '2026-06-14', 'Match 9 • Group E', 'Philadelphia Stadium, Philadelphia', 'Group E Fixture'],
  [10, '2026-06-14', 'Match 10 • Group E', 'Houston Stadium, Houston', 'Group E Fixture'],
  [11, '2026-06-14', 'Match 11 • Group F', 'Dallas Stadium, Dallas', 'Group F Fixture'],
  [12, '2026-06-14', 'Match 12 • Group F', 'Estadio Monterrey, Monterrey', 'Group F Fixture'],
  [13, '2026-06-15', 'Match 13 • Group H', 'Miami Stadium, Miami', 'Group H Fixture'],
  [14, '2026-06-15', 'Match 14 • Group H', 'Atlanta Stadium, Atlanta', 'Group H Fixture'],
  [15, '2026-06-15', 'Match 15 • Group G', 'Los Angeles Stadium, Los Angeles', 'Group G Fixture'],
  [16, '2026-06-15', 'Match 16 • Group G', 'Seattle Stadium, Seattle', 'Group G Fixture'],
  [17, '2026-06-16', 'Match 17 • Group I', 'New York New Jersey Stadium, New York New Jersey', 'Group I Fixture'],
  [18, '2026-06-16', 'Match 18 • Group I', 'Boston Stadium, Boston', 'Group I Fixture'],
  [19, '2026-06-16', 'Match 19 • Group J', 'Kansas City Stadium, Kansas City', 'Group J Fixture'],
  [20, '2026-06-16', 'Match 20 • Group J', 'San Francisco Bay Area Stadium, San Francisco Bay Area', 'Group J Fixture'],
  [21, '2026-06-17', 'Match 21 • Group L', 'Toronto Stadium, Toronto', 'Group L Fixture'],
  [22, '2026-06-17', 'Match 22 • Group L', 'Dallas Stadium, Dallas', 'Group L Fixture'],
  [23, '2026-06-17', 'Match 23 • Group K', 'Houston Stadium, Houston', 'Group K Fixture'],
  [24, '2026-06-17', 'Match 24 • Group K', 'Estadio Azteca, Mexico City', 'Group K Fixture'],
  [25, '2026-06-18', 'Match 25 • Group A', 'Atlanta Stadium, Atlanta', 'Group A Fixture'],
  [26, '2026-06-18', 'Match 26 • Group B', 'Los Angeles Stadium, Los Angeles', 'Group B Fixture'],
  [27, '2026-06-18', 'Match 27 • Group B (Canada #2)', 'BC Place, Vancouver', 'Group B Fixture', 'Canada #2', 'TBD'],
  [28, '2026-06-18', 'Match 28 • Group A (Mexico #2)', 'Estadio Guadalajara, Guadalajara', 'Group A Fixture', 'Mexico #2', 'TBD'],
  [29, '2026-06-19', 'Match 29 • Group C', 'Philadelphia Stadium, Philadelphia', 'Group C Fixture'],
  [30, '2026-06-19', 'Match 30 • Group C', 'Boston Stadium, Boston', 'Group C Fixture'],
  [31, '2026-06-19', 'Match 31 • Group D', 'San Francisco Bay Area Stadium, San Francisco Bay Area', 'Group D Fixture'],
  [32, '2026-06-19', 'Match 32 • Group D (USA #2)', 'Seattle Stadium, Seattle', 'Group D Fixture', 'USA #2', 'TBD'],
  [33, '2026-06-20', 'Match 33 • Group E', 'Toronto Stadium, Toronto', 'Group E Fixture'],
  [34, '2026-06-20', 'Match 34 • Group E', 'Kansas City Stadium, Kansas City', 'Group E Fixture'],
  [35, '2026-06-20', 'Match 35 • Group F', 'Houston Stadium, Houston', 'Group F Fixture'],
  [36, '2026-06-20', 'Match 36 • Group F', 'Estadio Monterrey, Monterrey', 'Group F Fixture'],
  [37, '2026-06-21', 'Match 37 • Group H', 'Miami Stadium, Miami', 'Group H Fixture'],
  [38, '2026-06-21', 'Match 38 • Group H', 'Atlanta Stadium, Atlanta', 'Group H Fixture'],
  [39, '2026-06-21', 'Match 39 • Group G', 'Los Angeles Stadium, Los Angeles', 'Group G Fixture'],
  [40, '2026-06-21', 'Match 40 • Group G', 'BC Place, Vancouver', 'Group G Fixture'],
  [41, '2026-06-22', 'Match 41 • Group I', 'New York New Jersey Stadium, New York New Jersey', 'Group I Fixture'],
  [42, '2026-06-22', 'Match 42 • Group I', 'Philadelphia Stadium, Philadelphia', 'Group I Fixture'],
  [43, '2026-06-22', 'Match 43 • Group J', 'Dallas Stadium, Dallas', 'Group J Fixture'],
  [44, '2026-06-22', 'Match 44 • Group J', 'San Francisco Bay Area Stadium, San Francisco Bay Area', 'Group J Fixture'],
  [45, '2026-06-23', 'Match 45 • Group L', 'Boston Stadium, Boston', 'Group L Fixture'],
  [46, '2026-06-23', 'Match 46 • Group L', 'Toronto Stadium, Toronto', 'Group L Fixture'],
  [47, '2026-06-23', 'Match 47 • Group K', 'Houston Stadium, Houston', 'Group K Fixture'],
  [48, '2026-06-23', 'Match 48 • Group K', 'Estadio Guadalajara, Guadalajara', 'Group K Fixture'],
  [49, '2026-06-24', 'Match 49 • Group C', 'Miami Stadium, Miami', 'Group C Fixture'],
  [50, '2026-06-24', 'Match 50 • Group C', 'Atlanta Stadium, Atlanta', 'Group C Fixture'],
  [51, '2026-06-24', 'Match 51 • Group B (Canada #3)', 'BC Place, Vancouver', 'Group B Fixture', 'Canada #3', 'TBD'],
  [52, '2026-06-24', 'Match 52 • Group B', 'Seattle Stadium, Seattle', 'Group B Fixture'],
  [53, '2026-06-24', 'Match 53 • Group A (Mexico #3)', 'Estadio Azteca, Mexico City', 'Group A Fixture', 'Mexico #3', 'TBD'],
  [54, '2026-06-24', 'Match 54 • Group A', 'Estadio Monterrey, Monterrey', 'Group A Fixture'],
  [55, '2026-06-25', 'Match 55 • Group E', 'Philadelphia Stadium, Philadelphia', 'Group E Fixture'],
  [56, '2026-06-25', 'Match 56 • Group E', 'New York New Jersey Stadium, New York New Jersey', 'Group E Fixture'],
  [57, '2026-06-25', 'Match 57 • Group F', 'Dallas Stadium, Dallas', 'Group F Fixture'],
  [58, '2026-06-25', 'Match 58 • Group F', 'Kansas City Stadium, Kansas City', 'Group F Fixture'],
  [59, '2026-06-25', 'Match 59 • Group D (USA #3)', 'Los Angeles Stadium, Los Angeles', 'Group D Fixture', 'USA #3', 'TBD'],
  [60, '2026-06-25', 'Match 60 • Group D', 'San Francisco Bay Area Stadium, San Francisco Bay Area', 'Group D Fixture'],
  [61, '2026-06-26', 'Match 61 • Group I', 'Boston Stadium, Boston', 'Group I Fixture'],
  [62, '2026-06-26', 'Match 62 • Group I', 'Toronto Stadium, Toronto', 'Group I Fixture'],
  [63, '2026-06-26', 'Match 63 • Group G', 'Seattle Stadium, Seattle', 'Group G Fixture'],
  [64, '2026-06-26', 'Match 64 • Group G', 'BC Place, Vancouver', 'Group G Fixture'],
  [65, '2026-06-26', 'Match 65 • Group H', 'Houston Stadium, Houston', 'Group H Fixture'],
  [66, '2026-06-26', 'Match 66 • Group H', 'Estadio Guadalajara, Guadalajara', 'Group H Fixture'],
  [67, '2026-06-27', 'Match 67 • Group L', 'New York New Jersey Stadium, New York New Jersey', 'Group L Fixture'],
  [68, '2026-06-27', 'Match 68 • Group L', 'Philadelphia Stadium, Philadelphia', 'Group L Fixture'],
  [69, '2026-06-27', 'Match 69 • Group J', 'Kansas City Stadium, Kansas City', 'Group J Fixture'],
  [70, '2026-06-27', 'Match 70 • Group J', 'Dallas Stadium, Dallas', 'Group J Fixture'],
  [71, '2026-06-27', 'Match 71 • Group K', 'Miami Stadium, Miami', 'Group K Fixture'],
  [72, '2026-06-27', 'Match 72 • Group K', 'Atlanta Stadium, Atlanta', 'Group K Fixture'],
  [73, '2026-06-28', 'Match 73 • Group A runners-up vs Group B runners-up', 'Los Angeles Stadium, Los Angeles', 'Round of 32', 'Group A runners-up', 'Group B runners-up'],
  [74, '2026-06-29', 'Match 74 • Group E winners vs eligible third-place finisher', 'Boston Stadium, Boston', 'Round of 32', 'Group E winners', 'Group A/B/C/D/F third place'],
  [75, '2026-06-29', 'Match 75 • Group F winners vs Group C runners-up', 'Estadio Monterrey, Monterrey', 'Round of 32', 'Group F winners', 'Group C runners-up'],
  [76, '2026-06-29', 'Match 76 • Group C winners vs Group F runners-up', 'Houston Stadium, Houston', 'Round of 32', 'Group C winners', 'Group F runners-up']
];

const calendarSyncSources = [
  {
    feedKey: 'ipl-2026-phase-1',
    name: 'IPL 2026 Phase 1',
    sportType: 'Cricket',
    sourceType: 'announcement',
    sourceUrl: iplSourceUrl,
    coverageSummary:
      'Phase-one IPL 2026 fixtures published for March 28 to April 12, 2026, with confirmed teams, venues, and start times.',
    enabledByDefault: true,
    items: iplPhaseOneMatches.map(buildIplMatch)
  },
  {
    feedKey: 'fifa-world-cup-2026',
    name: 'FIFA World Cup 2026',
    sportType: 'Football',
    sourceType: 'official_schedule',
    sourceUrl: fifaSourceUrl,
    coverageSummary:
      'Published FIFA World Cup 2026 schedule placeholders through June 29, 2026, including group-stage slots and the opening Round of 32 ties.',
    enabledByDefault: true,
    items: fifaScheduleRows.map(buildFifaMatch)
  }
];

export const getCalendarSyncSources = () =>
  calendarSyncSources.map((source) => ({
    ...source,
    items: source.items.map((item) => ({
      ...item,
      metadata: { ...(item.metadata || {}) }
    }))
  }));

export const calendarSyncFeedCatalog = calendarSyncSources.map(({ items, ...source }) => ({
  ...source,
  itemCount: items.length,
  windowStart: items[0]?.startDate || null,
  windowEnd: items[items.length - 1]?.endDate || null
}));

