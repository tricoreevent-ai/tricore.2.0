import { sortMatchesBySchedule } from './matchAdmin.js';

const normalizeText = (value) => String(value || '').trim();

const KNOCKOUT_MATCH_TYPES = new Set([
  'quarterfinal',
  'semifinal',
  'final',
  'third place',
  'knockout'
]);

const MATCH_TONE_BY_TYPE = {
  league: 'matchLeague',
  'group stage': 'matchLeague',
  quarterfinal: 'matchKnockout',
  semifinal: 'matchKnockout',
  final: 'matchFinal',
  'third place': 'matchFinal',
  knockout: 'matchKnockout'
};

const EVENT_NODE_STYLE = {
  fill: '#241805',
  stroke: '#d4af37',
  text: '#fff7db',
  detailText: '#f7d77a',
  accent: '#f59e0b',
  forceSize: 72,
  forceShape: 'square'
};

const STAGE_NODE_STYLE = {
  fill: '#121a28',
  stroke: '#5b8cff',
  text: '#f8fafc',
  detailText: '#a8b8d8',
  accent: '#74a6ff',
  chipFill: '#74a6ff',
  chipText: '#08111f',
  forceSize: 58,
  forceShape: 'square'
};

const DEFAULT_TEAM_STYLE = {
  fill: '#121821',
  stroke: '#475569',
  text: '#f8fafc',
  detailText: '#94a3b8',
  accent: '#64748b',
  chipFill: '#64748b',
  chipText: '#f8fafc',
  forceSize: 40,
  forceShape: 'circle'
};

const MATCH_STYLE_BY_TONE = {
  matchLeague: {
    fill: '#121a28',
    stroke: '#475569',
    text: '#f8fafc',
    detailText: '#a8b8d8',
    accent: '#64748b',
    forceSize: 46,
    forceShape: 'hexagon'
  },
  matchKnockout: {
    fill: '#1b1530',
    stroke: '#8b5cf6',
    text: '#f5f3ff',
    detailText: '#ddd6fe',
    accent: '#a78bfa',
    forceSize: 48,
    forceShape: 'hexagon'
  },
  matchFinal: {
    fill: '#241805',
    stroke: '#f59e0b',
    text: '#fff7db',
    detailText: '#fde68a',
    accent: '#fbbf24',
    forceSize: 50,
    forceShape: 'triangle'
  },
  matchCompleted: {
    fill: '#112018',
    stroke: '#10b981',
    text: '#ecfdf5',
    detailText: '#a7f3d0',
    accent: '#34d399',
    forceSize: 48,
    forceShape: 'hexagon'
  },
  matchWarning: {
    fill: '#261219',
    stroke: '#f43f5e',
    text: '#fff1f2',
    detailText: '#fecdd3',
    accent: '#fb7185',
    forceSize: 48,
    forceShape: 'hexagon'
  }
};

const createDarkGroupSwatch = ({
  stageFill,
  teamFill,
  seedFill,
  matchFill,
  stroke,
  accent,
  detailText,
  chipText = '#08111f'
}) => ({
  stageFill,
  stageStroke: stroke,
  stageText: '#f8fafc',
  stageDetailText: detailText,
  stageAccent: accent,
  teamFill,
  teamStroke: stroke,
  teamText: '#f8fafc',
  detailText,
  seedFill,
  seedStroke: accent,
  seedText: '#f8fafc',
  matchFill,
  matchStroke: stroke,
  matchText: '#f8fafc',
  chipFill: accent,
  chipText,
  accent
});

const GROUP_COLOR_SWATCHES = [
  createDarkGroupSwatch({
    stageFill: '#111d33',
    teamFill: '#10192c',
    seedFill: '#14233d',
    matchFill: '#111b2f',
    stroke: '#3b82f6',
    accent: '#74a6ff',
    detailText: '#aac8ff'
  }),
  createDarkGroupSwatch({
    stageFill: '#0f201a',
    teamFill: '#0e1a16',
    seedFill: '#10251c',
    matchFill: '#102018',
    stroke: '#10b981',
    accent: '#34d399',
    detailText: '#a7f3d0',
    chipText: '#04110c'
  }),
  createDarkGroupSwatch({
    stageFill: '#261a08',
    teamFill: '#1d1609',
    seedFill: '#2a1d0b',
    matchFill: '#241808',
    stroke: '#f59e0b',
    accent: '#fbbf24',
    detailText: '#fde68a',
    chipText: '#1b1204'
  }),
  createDarkGroupSwatch({
    stageFill: '#29111a',
    teamFill: '#211019',
    seedFill: '#2d121d',
    matchFill: '#251019',
    stroke: '#f43f5e',
    accent: '#fb7185',
    detailText: '#fecdd3',
    chipText: '#17080d'
  }),
  createDarkGroupSwatch({
    stageFill: '#1c1330',
    teamFill: '#171129',
    seedFill: '#21153a',
    matchFill: '#1a122d',
    stroke: '#8b5cf6',
    accent: '#a78bfa',
    detailText: '#ddd6fe',
    chipText: '#12091b'
  }),
  createDarkGroupSwatch({
    stageFill: '#0d2127',
    teamFill: '#0d1b21',
    seedFill: '#10262e',
    matchFill: '#0d2026',
    stroke: '#06b6d4',
    accent: '#22d3ee',
    detailText: '#a5f3fc',
    chipText: '#051217'
  }),
  createDarkGroupSwatch({
    stageFill: '#0d1d2a',
    teamFill: '#0d1823',
    seedFill: '#102231',
    matchFill: '#0d1d2b',
    stroke: '#0ea5e9',
    accent: '#38bdf8',
    detailText: '#bae6fd',
    chipText: '#07121a'
  }),
  createDarkGroupSwatch({
    stageFill: '#23101e',
    teamFill: '#1d0f18',
    seedFill: '#28121f',
    matchFill: '#200f1a',
    stroke: '#ec4899',
    accent: '#f472b6',
    detailText: '#fbcfe8',
    chipText: '#180911'
  })
];

const TEAM_PLACEHOLDER_PATTERN = /winner|loser|runner-up|slot|bye|group|pool/i;

const stagePriority = (match = {}) => {
  const stageLabel = normalizeText(match.roundLabel || match.matchType).toLowerCase();

  if (stageLabel.includes('final') && !stageLabel.includes('semi') && !stageLabel.includes('quarter')) {
    return 60;
  }

  if (stageLabel.includes('third place')) {
    return 55;
  }

  if (stageLabel.includes('semi')) {
    return 50;
  }

  if (stageLabel.includes('quarter')) {
    return 45;
  }

  if (stageLabel.includes('knockout')) {
    return 40;
  }

  if (stageLabel.includes('group')) {
    return 20;
  }

  if (stageLabel.includes('league')) {
    return 10;
  }

  return Number(match.roundNumber || 0);
};

const pluralize = (count, label) => `${count} ${label}${count === 1 ? '' : 's'}`;

const truncate = (value, maxLength = 42) => {
  const normalizedValue = normalizeText(value);

  if (!normalizedValue || normalizedValue.length <= maxLength) {
    return normalizedValue;
  }

  return `${normalizedValue.slice(0, maxLength - 1)}...`;
};

const getMatchLabel = (match = {}) =>
  normalizeText(match.roundLabel || match.matchType || `Match ${match.matchNumber || ''}`) ||
  'Fixture';

const getFixtureTitle = (match = {}) =>
  truncate(`${match.teamA || 'Team A'} vs ${match.teamB || 'Team B'}`, 34) || 'Fixture pending';

const getFixtureMetaLabel = (match = {}, groupKey = '', statusLabel = '') => {
  const normalizedGroupKey = extractGroupKey(groupKey, match.groupName, match.roundLabel);
  const normalizedStatus = normalizeText(statusLabel || match.status) || 'Scheduled';

  return [
    normalizedGroupKey || getMatchLabel(match),
    normalizedStatus,
    normalizeText(match.date),
    normalizeText(match.time),
    truncate(normalizeText(match.venue), 18)
  ]
    .filter(Boolean)
    .join(' • ');
};

const getMatchTone = (match = {}) => {
  const normalizedStatus = normalizeText(match.status).toLowerCase();

  if (normalizedStatus === 'completed') {
    return 'matchCompleted';
  }

  if (['postponed', 'abandoned', 'cancelled'].includes(normalizedStatus)) {
    return 'matchWarning';
  }

  const normalizedType = normalizeText(match.matchType).toLowerCase();
  return MATCH_TONE_BY_TYPE[normalizedType] || 'matchLeague';
};

const hasScoreValue = (value) => {
  if (typeof value === 'number') {
    return true;
  }

  if (typeof value === 'string' && value.trim()) {
    return !Number.isNaN(Number(value));
  }

  return false;
};

const buildCricketScore = (runs, wickets, overs) => {
  if (!hasScoreValue(runs)) {
    return '';
  }

  const runsLabel = `${runs}`;
  const wicketsLabel = hasScoreValue(wickets) ? `/${wickets}` : '';
  const oversLabel = normalizeText(overs) ? ` (${overs} ov)` : '';
  return `${runsLabel}${wicketsLabel}${oversLabel}`;
};

const getMatchScoreLine = (match = {}) => {
  if (hasScoreValue(match.teamAGoals) || hasScoreValue(match.teamBGoals)) {
    return `${match.teamA || 'Team A'} ${match.teamAGoals ?? '-'} - ${match.teamBGoals ?? '-'} ${match.teamB || 'Team B'}`;
  }

  const teamAScore = buildCricketScore(match.teamARuns, match.teamAWickets, match.teamAOvers);
  const teamBScore = buildCricketScore(match.teamBRuns, match.teamBWickets, match.teamBOvers);

  if (teamAScore || teamBScore) {
    return `${match.teamA || 'Team A'} ${teamAScore || '-'} • ${match.teamB || 'Team B'} ${teamBScore || '-'}`;
  }

  return '';
};

const normalizeReferenceKey = (value) =>
  normalizeText(value)
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .trim();

const extractGroupKey = (...values) => {
  for (const rawValue of values) {
    const normalizedValue = normalizeText(rawValue);

    if (!normalizedValue) {
      continue;
    }

    const directMatch = normalizedValue.match(/(?:group|pool)\s+([a-z0-9]+)/i);

    if (directMatch?.[1]) {
      return `Group ${directMatch[1].toUpperCase()}`;
    }
  }

  return '';
};

const getGroupPalette = (groupKey = '') => {
  const normalizedGroupKey = extractGroupKey(groupKey);

  if (!normalizedGroupKey) {
    return null;
  }

  const token = normalizedGroupKey.replace(/^Group\s+/i, '').trim().toUpperCase();
  const hashValue = [...token].reduce((total, character) => total + character.charCodeAt(0), 0);
  return GROUP_COLOR_SWATCHES[hashValue % GROUP_COLOR_SWATCHES.length];
};

const applyNodeStyle = (node, style) => ({
  ...node,
  fill: style.fill,
  stroke: style.stroke,
  textColor: style.text,
  detailTextColor: style.detailText,
  accentColor: style.accent,
  chipFill: style.chipFill || style.fill,
  chipTextColor: style.chipText || style.text,
  forceSize: style.forceSize,
  forceShape: style.forceShape
});

const buildTeamGroupLookup = (matches = []) => {
  const lookup = new Map();

  const remember = (teamName, groupKey) => {
    const normalizedTeamName = normalizeText(teamName);
    const normalizedGroupKey = extractGroupKey(groupKey);

    if (!normalizedTeamName || !normalizedGroupKey || TEAM_PLACEHOLDER_PATTERN.test(normalizedTeamName)) {
      return;
    }

    const key = normalizeReferenceKey(normalizedTeamName);

    if (!lookup.has(key)) {
      lookup.set(key, normalizedGroupKey);
    }
  };

  (Array.isArray(matches) ? matches : []).forEach((match) => {
    const groupKey = extractGroupKey(match.groupName, match.roundLabel);

    remember(match.teamA, groupKey);
    remember(match.teamB, groupKey);
  });

  return lookup;
};

const buildParticipantDescriptor = (label, teamGroupLookup, preferredGroupKey = '') => {
  const fullLabel = normalizeText(label);
  const groupKey =
    extractGroupKey(fullLabel, preferredGroupKey) ||
    teamGroupLookup.get(normalizeReferenceKey(fullLabel)) ||
    extractGroupKey(preferredGroupKey);
  const palette = getGroupPalette(groupKey);

  return {
    label: truncate(fullLabel, 20) || 'Team',
    fullLabel: fullLabel || 'Team',
    groupKey,
    fill: palette?.chipFill || '#334155',
    stroke: palette?.accent || '#64748b',
    text: palette?.chipText || '#f8fafc'
  };
};

const getTeamNodeStyle = (groupKey = '', isSeed = false) => {
  const palette = getGroupPalette(groupKey);

  if (!palette) {
    return DEFAULT_TEAM_STYLE;
  }

  return {
    fill: isSeed ? palette.seedFill : palette.teamFill,
    stroke: isSeed ? palette.seedStroke : palette.teamStroke,
    text: isSeed ? palette.seedText : palette.teamText,
    detailText: palette.detailText,
    accent: palette.accent,
    chipFill: palette.chipFill,
    chipText: palette.chipText,
    forceSize: isSeed ? 38 : 36,
    forceShape: 'circle'
  };
};

const getStageNodeStyle = (groupKey = '') => {
  const palette = getGroupPalette(groupKey);

  if (!palette) {
    return STAGE_NODE_STYLE;
  }

  return {
    fill: palette.stageFill || palette.teamFill,
    stroke: palette.stageStroke || palette.teamStroke,
    text: palette.stageText || palette.teamText,
    detailText: palette.stageDetailText || palette.detailText,
    accent: palette.stageAccent || palette.accent,
    chipFill: palette.chipFill,
    chipText: palette.chipText,
    forceSize: 58,
    forceShape: 'square'
  };
};

const getStyledMatchStyle = (match = {}, groupKey = '') => {
  const tone = getMatchTone(match);

  if (tone === 'matchLeague' || (tone === 'matchCompleted' && extractGroupKey(groupKey))) {
    const palette = getGroupPalette(groupKey);

    if (palette) {
      return {
        fill: palette.matchFill,
        stroke: palette.matchStroke,
        text: palette.matchText,
        detailText: palette.detailText,
        accent: palette.accent,
        chipFill: palette.chipFill,
        chipText: palette.chipText,
        forceSize: 42,
        forceShape: 'hexagon'
      };
    }
  }

  return MATCH_STYLE_BY_TONE[tone] || MATCH_STYLE_BY_TONE.matchLeague;
};

const createTeamLeafNode = (
  label,
  fallbackLabel = '',
  teamGroupLookup = new Map(),
  preferredGroupKey = ''
) => {
  const normalizedLabel = normalizeText(label) || normalizeText(fallbackLabel) || 'Slot pending';
  const groupKey =
    extractGroupKey(normalizedLabel, fallbackLabel, preferredGroupKey) ||
    teamGroupLookup.get(normalizeReferenceKey(normalizedLabel)) ||
    teamGroupLookup.get(normalizeReferenceKey(fallbackLabel)) ||
    extractGroupKey(preferredGroupKey);
  const currentLabel =
    normalizeText(fallbackLabel) && normalizeText(fallbackLabel) !== normalizedLabel
      ? `Current slot: ${truncate(fallbackLabel, 24)}`
      : '';
  const isSeed = /group|runner-up|winner|loser|slot|bye/i.test(normalizedLabel);
  const style = getTeamNodeStyle(groupKey, isSeed);

  return applyNodeStyle(
    {
      name: truncate(normalizedLabel, 30) || 'Slot pending',
      fullLabel: normalizedLabel,
      tone: isSeed ? 'seed' : 'team',
      kind: isSeed ? 'seed' : 'team',
      badgeLabel: groupKey || (isSeed ? 'Seed' : 'Team'),
      groupKey,
      teamName: isSeed ? '' : normalizedLabel,
      sourceLabel: isSeed ? normalizedLabel : '',
      details: [
        truncate(
          [groupKey || (isSeed ? 'Qualifier slot' : 'Team slot'), isSeed ? 'Planning source' : 'Ready for planning']
            .filter(Boolean)
            .join(' • '),
          56
        ),
        currentLabel
      ]
        .filter(Boolean)
        .slice(0, 2),
      participants: normalizedLabel
        ? [buildParticipantDescriptor(normalizedLabel, teamGroupLookup, groupKey)]
        : [],
      children: []
    },
    style
  );
};

const buildAliasMap = (matches = []) => {
  const aliases = new Map();

  const addAlias = (alias, match) => {
    const key = normalizeReferenceKey(alias);

    if (key && !aliases.has(key)) {
      aliases.set(key, match);
    }
  };

  (Array.isArray(matches) ? matches : []).forEach((match) => {
    addAlias(match.roundLabel, match);
    addAlias(match.matchType, match);
    addAlias(`Match ${match.matchNumber}`, match);
  });

  return aliases;
};

const resolveSourceReference = (source, aliasMap) => {
  const normalizedSource = normalizeText(source);

  if (!normalizedSource) {
    return null;
  }

  const exactMatch = aliasMap.get(normalizeReferenceKey(normalizedSource));

  if (exactMatch) {
    return exactMatch;
  }

  const strippedSource = normalizedSource.replace(/^(winner|loser)(?:\s+of)?\s+/i, '').trim();
  return aliasMap.get(normalizeReferenceKey(strippedSource)) || null;
};

const hasDependencySource = (value) => /winner|loser|match\s+\d+/i.test(normalizeText(value));

const isDependencyCandidate = (match = {}) =>
  KNOCKOUT_MATCH_TYPES.has(normalizeText(match.matchType).toLowerCase()) ||
  Number(match.roundNumber || 0) > 1 ||
  hasDependencySource(match.teamASource) ||
  hasDependencySource(match.teamBSource);

const createMatchNode = (
  match,
  teamGroupLookup = new Map(),
  {
    displayName = '',
    detailLines = [],
    badgeLabel = '',
    groupKey: explicitGroupKey = ''
  } = {}
) => {
  const groupKey =
    extractGroupKey(explicitGroupKey, match.groupName, match.roundLabel) ||
    teamGroupLookup.get(normalizeReferenceKey(match.teamA)) ||
    teamGroupLookup.get(normalizeReferenceKey(match.teamB)) ||
    '';
  const style = getStyledMatchStyle(match, groupKey);
  const normalizedStatus = normalizeText(match.status) || 'Pending';
  const roundLabel = getMatchLabel(match);
  const fixtureTitle = `${match.teamA || 'Team A'} vs ${match.teamB || 'Team B'}`;
  const scoreLine = getMatchScoreLine(match);
  const fixtureMeta = truncate(getFixtureMetaLabel(match, groupKey, normalizedStatus), 78);
  const participants = [
    buildParticipantDescriptor(match.teamA, teamGroupLookup, groupKey),
    buildParticipantDescriptor(match.teamB, teamGroupLookup, groupKey)
  ];

  return applyNodeStyle(
    {
      name: displayName || getFixtureTitle(match),
      fullLabel: fixtureTitle,
      tone: getMatchTone(match),
      kind: 'match',
      badgeLabel: badgeLabel || roundLabel,
      matchId: match._id,
      groupKey,
      teamA: normalizeText(match.teamA),
      teamB: normalizeText(match.teamB),
      teamASource: normalizeText(match.teamASource),
      teamBSource: normalizeText(match.teamBSource),
      matchNumber: match.matchNumber,
      matchType: normalizeText(match.matchType),
      roundLabel,
      groupName: normalizeText(match.groupName),
      status: normalizedStatus,
      date: normalizeText(match.date),
      time: normalizeText(match.time),
      venue: normalizeText(match.venue),
      winnerTeam: normalizeText(match.winnerTeam),
      scoreLine,
      teamAGoals: match.teamAGoals,
      teamBGoals: match.teamBGoals,
      teamARuns: match.teamARuns,
      teamBRuns: match.teamBRuns,
      teamAWickets: match.teamAWickets,
      teamBWickets: match.teamBWickets,
      teamAOvers: normalizeText(match.teamAOvers),
      teamBOvers: normalizeText(match.teamBOvers),
      teamABonusPoints: match.teamABonusPoints ?? 0,
      teamBBonusPoints: match.teamBBonusPoints ?? 0,
      participants,
      details:
        detailLines.length > 0
          ? detailLines.filter(Boolean).slice(0, 3)
          : [fixtureMeta, truncate(scoreLine || '', 78)].filter(Boolean)
    },
    style
  );
};

const buildStageTreeNodes = (matches = [], teamGroupLookup = new Map()) => {
  const stageMap = sortMatchesBySchedule(matches).reduce((accumulator, match) => {
    const stageKey = getMatchLabel(match);

    if (!accumulator.has(stageKey)) {
      accumulator.set(stageKey, []);
    }

    accumulator.get(stageKey).push(match);
    return accumulator;
  }, new Map());

  return [...stageMap.entries()]
    .sort((left, right) => {
      const leftSample = left[1]?.[0] || {};
      const rightSample = right[1]?.[0] || {};
      const priorityDelta = stagePriority(rightSample) - stagePriority(leftSample);

      if (priorityDelta) {
        return priorityDelta;
      }

      return left[0].localeCompare(right[0], 'en', {
        sensitivity: 'base',
        numeric: true
      });
    })
    .map(([stageLabel, stageMatches]) => {
      const completedCount = stageMatches.filter(
        (match) => normalizeText(match.status).toLowerCase() === 'completed'
      ).length;
      const groupKey = extractGroupKey(stageLabel, stageMatches[0]?.groupName);
      const stageTitle = groupKey || stageLabel;

      return applyNodeStyle(
        {
          name: stageTitle,
          fullLabel: stageTitle,
          tone: 'stage',
          kind: 'stage',
          badgeLabel: groupKey ? 'Group' : 'Stage',
          groupKey,
          fixtureCount: stageMatches.length,
          completedCount,
          details: [
            truncate(
              `${pluralize(stageMatches.length, 'fixture')} • ${
                completedCount ? `${completedCount} completed` : 'Published for planning'
              }`,
              56
            )
          ],
          children: stageMatches.map((match) =>
            createMatchNode(match, teamGroupLookup, { groupKey })
          )
        },
        getStageNodeStyle(groupKey)
      );
    });
};

const buildDependencyMatchNode = (
  match,
  aliasMap,
  teamGroupLookup = new Map(),
  lineage = new Set()
) => {
  const nextLineage = new Set(lineage);
  nextLineage.add(match._id);
  const groupKey = extractGroupKey(match.groupName, match.roundLabel);

  const createDependencyChild = (sourceLabel, fallbackLabel) => {
    const normalizedSource = normalizeText(sourceLabel) || normalizeText(fallbackLabel);
    const referencedMatch = resolveSourceReference(normalizedSource, aliasMap);

    if (referencedMatch && !nextLineage.has(referencedMatch._id)) {
      return buildDependencyMatchNode(referencedMatch, aliasMap, teamGroupLookup, nextLineage);
    }

    return createTeamLeafNode(
      normalizedSource,
      fallbackLabel,
      teamGroupLookup,
      extractGroupKey(normalizedSource, fallbackLabel, groupKey)
    );
  };

  return {
    ...createMatchNode(match, teamGroupLookup, {
      displayName: getMatchLabel(match),
      detailLines: [
        truncate(getFixtureMetaLabel(match, groupKey, normalizeText(match.status) || 'Scheduled'), 78),
        truncate(getMatchScoreLine(match) || '', 78),
        match.winnerTeam ? `Winner: ${truncate(match.winnerTeam, 22)}` : ''
      ],
      badgeLabel: groupKey || getMatchLabel(match),
      groupKey
    }),
    children: [
      createDependencyChild(match.teamASource || match.teamA, match.teamA),
      createDependencyChild(match.teamBSource || match.teamB, match.teamB)
    ]
  };
};

const getTreeMetrics = (node) => {
  if (!node) {
    return {
      depth: 0,
      leafCount: 0,
      nodeCount: 0
    };
  }

  if (!Array.isArray(node.children) || !node.children.length) {
    return {
      depth: 1,
      leafCount: 1,
      nodeCount: 1
    };
  }

  const childMetrics = node.children.map(getTreeMetrics);

  return {
    depth: 1 + Math.max(...childMetrics.map((item) => item.depth)),
    leafCount: childMetrics.reduce((total, item) => total + item.leafCount, 0),
    nodeCount: 1 + childMetrics.reduce((total, item) => total + item.nodeCount, 0)
  };
};

export const buildFixtureVisualization = ({ eventName = '', matches = [] } = {}) => {
  const sortedMatches = sortMatchesBySchedule(matches);

  if (!sortedMatches.length) {
    return null;
  }

  const teamGroupLookup = buildTeamGroupLookup(sortedMatches);
  const dependencyMatches = sortedMatches.filter(isDependencyCandidate);
  const dependencyMatchIds = new Set(dependencyMatches.map((match) => match._id));
  const stageMatches = sortedMatches.filter((match) => !dependencyMatchIds.has(match._id));
  const useDependencyTree = dependencyMatches.length > 0;
  const distinctGroupKeys = new Set(
    sortedMatches
      .map((match) => extractGroupKey(match.groupName, match.roundLabel))
      .filter(Boolean)
  );

  let rootChildren;
  let mode = 'stage';
  let viewLabel = 'Stage Overview';

  if (useDependencyTree) {
    const aliasMap = buildAliasMap(dependencyMatches);
    const referencedMatchIds = new Set();

    dependencyMatches.forEach((match) => {
      [match.teamASource, match.teamBSource].forEach((source) => {
        const referencedMatch = resolveSourceReference(source, aliasMap);

        if (referencedMatch) {
          referencedMatchIds.add(referencedMatch._id);
        }
      });
    });

    const dependencyRoots = dependencyMatches
      .filter((match) => !referencedMatchIds.has(match._id))
      .sort((left, right) => {
        const priorityDelta = stagePriority(right) - stagePriority(left);

        if (priorityDelta) {
          return priorityDelta;
        }

        return Number(right.matchNumber || 0) - Number(left.matchNumber || 0);
      });

    const fallbackRoots = dependencyRoots.length
      ? dependencyRoots
      : [...dependencyMatches]
          .sort((left, right) => stagePriority(right) - stagePriority(left))
          .slice(0, 1);

    rootChildren = [
      ...fallbackRoots.map((match) =>
        buildDependencyMatchNode(match, aliasMap, teamGroupLookup)
      ),
      ...buildStageTreeNodes(stageMatches, teamGroupLookup)
    ];
    mode = 'dependency';
    viewLabel = stageMatches.length ? 'Knockout Flow + Stage Summary' : 'Knockout Flow';
  } else {
    rootChildren = buildStageTreeNodes(sortedMatches, teamGroupLookup);
  }

  const completedFixtures = sortedMatches.filter(
    (match) => normalizeText(match.status).toLowerCase() === 'completed'
  ).length;

  const treeData = applyNodeStyle(
    {
      name: truncate(eventName || 'Fixture Planner View', 34) || 'Fixture Planner View',
      fullLabel: normalizeText(eventName) || 'Fixture Planner View',
      tone: 'root',
      kind: 'event',
      badgeLabel: 'Event',
      details: [
        viewLabel,
        `${pluralize(sortedMatches.length, 'fixture')} • ${completedFixtures} completed`
      ],
      totalFixtures: sortedMatches.length,
      completedFixtures,
      stageCount: new Set(sortedMatches.map(getMatchLabel)).size,
      dependencyCount: dependencyMatches.length,
      groupCount: distinctGroupKeys.size,
      children: rootChildren
    },
    EVENT_NODE_STYLE
  );

  return {
    data: treeData,
    mode,
    viewLabel,
    metrics: getTreeMetrics(treeData),
    summary: {
      totalFixtures: sortedMatches.length,
      completedFixtures,
      stageCount: new Set(sortedMatches.map(getMatchLabel)).size,
      dependencyCount: dependencyMatches.length,
      groupCount: distinctGroupKeys.size
    }
  };
};

const flattenPlannerNodeToGraph = (node, accumulator, parentId = '', path = 'root') => {
  const nodeId = normalizeText(node.matchId) || `${path}-${accumulator.nodes.length}`;

  accumulator.nodes.push({
    id: nodeId,
    label: truncate(node.name, 32) || 'Node',
    fullLabel: node.fullLabel || node.name || 'Node',
    badgeLabel: node.badgeLabel || node.kind || 'Node',
    subLabel: (Array.isArray(node.details) ? node.details : [])
      .filter(Boolean)
      .slice(0, 2)
      .join(' • '),
    detailLines: (Array.isArray(node.details) ? node.details : []).filter(Boolean).slice(0, 3),
    tone: node.tone || 'team',
    kind: node.kind || 'team',
    fill: node.fill || DEFAULT_TEAM_STYLE.fill,
    stroke: node.stroke || DEFAULT_TEAM_STYLE.stroke,
    textColor: node.textColor || DEFAULT_TEAM_STYLE.text,
    detailTextColor: node.detailTextColor || DEFAULT_TEAM_STYLE.detailText,
    accentColor: node.accentColor || DEFAULT_TEAM_STYLE.accent,
    chipFill: node.chipFill || node.fill || DEFAULT_TEAM_STYLE.chipFill,
    chipTextColor: node.chipTextColor || node.textColor || DEFAULT_TEAM_STYLE.chipText,
    size: node.forceSize || DEFAULT_TEAM_STYLE.forceSize,
    shape: node.forceShape || DEFAULT_TEAM_STYLE.forceShape,
    matchId: normalizeText(node.matchId),
    groupKey: node.groupKey || '',
    teamName: node.teamName || '',
    sourceLabel: node.sourceLabel || '',
    teamA: node.teamA || '',
    teamB: node.teamB || '',
    teamASource: node.teamASource || '',
    teamBSource: node.teamBSource || '',
    matchNumber: node.matchNumber || '',
    matchType: node.matchType || '',
    roundLabel: node.roundLabel || '',
    groupName: node.groupName || '',
    status: node.status || '',
    date: node.date || '',
    time: node.time || '',
    venue: node.venue || '',
    winnerTeam: node.winnerTeam || '',
    scoreLine: node.scoreLine || '',
    teamAGoals: node.teamAGoals,
    teamBGoals: node.teamBGoals,
    teamARuns: node.teamARuns,
    teamBRuns: node.teamBRuns,
    teamAWickets: node.teamAWickets,
    teamBWickets: node.teamBWickets,
    teamAOvers: node.teamAOvers || '',
    teamBOvers: node.teamBOvers || '',
    teamABonusPoints: node.teamABonusPoints ?? 0,
    teamBBonusPoints: node.teamBBonusPoints ?? 0,
    fixtureCount: node.fixtureCount || 0,
    completedCount: node.completedCount || 0,
    totalFixtures: node.totalFixtures || 0,
    completedFixtures: node.completedFixtures || 0,
    stageCount: node.stageCount || 0,
    dependencyCount: node.dependencyCount || 0,
    groupCount: node.groupCount || 0,
    participants: Array.isArray(node.participants) ? node.participants : []
  });

  if (parentId) {
    accumulator.links.push({
      id: `${parentId}-${nodeId}`,
      source: parentId,
      target: nodeId,
      stroke: node.accentColor || node.stroke || '#cbd5e1',
      width: node.kind === 'event' || node.kind === 'stage' ? 2.4 : 1.9
    });
  }

  (Array.isArray(node.children) ? node.children : []).forEach((childNode, index) => {
    flattenPlannerNodeToGraph(childNode, accumulator, nodeId, `${nodeId}-${index}`);
  });
};

export const buildFixtureForceGraphData = (visualization) => {
  if (!visualization?.data) {
    return {
      nodes: [],
      links: []
    };
  }

  const accumulator = {
    nodes: [],
    links: []
  };

  flattenPlannerNodeToGraph(visualization.data, accumulator);
  return accumulator;
};
