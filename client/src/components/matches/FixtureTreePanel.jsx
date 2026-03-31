import { useEffect, useMemo, useRef, useState } from 'react';
import Tree from 'react-d3-tree';
import {
  VisGraph,
  VisGraphSelectors,
  VisSingleContainer,
  VisTooltip
} from '@unovis/react';
import {
  GraphLayoutType,
  GraphNodeSelectionHighlightMode
} from '@unovis/ts';

import AppIcon from '../common/AppIcon.jsx';
import {
  buildFixtureForceGraphData,
  buildFixtureVisualization
} from '../../utils/matchTree.js';
import { printMatchFixtureTree } from '../../utils/printMatchFixtureTree.js';

const VIEW_MODES = [
  { key: 'tree', label: 'Planner Tree' },
  { key: 'force', label: 'Force Layout Graph' },
  { key: 'custom', label: 'Custom Nodes Graph' }
];

const FALLBACK_TONE_STYLES = {
  root: {
    fill: '#241805',
    stroke: '#d4af37',
    text: '#fff7db',
    detailText: '#f7d77a',
    accent: '#f59e0b'
  },
  stage: {
    fill: '#121a28',
    stroke: '#5b8cff',
    text: '#f8fafc',
    detailText: '#a8b8d8',
    accent: '#74a6ff'
  },
  matchLeague: {
    fill: '#121a28',
    stroke: '#475569',
    text: '#f8fafc',
    detailText: '#a8b8d8',
    accent: '#64748b'
  },
  matchKnockout: {
    fill: '#1b1530',
    stroke: '#8b5cf6',
    text: '#f5f3ff',
    detailText: '#ddd6fe',
    accent: '#a78bfa'
  },
  matchFinal: {
    fill: '#241805',
    stroke: '#f59e0b',
    text: '#fff7db',
    detailText: '#fde68a',
    accent: '#fbbf24'
  },
  matchCompleted: {
    fill: '#112018',
    stroke: '#10b981',
    text: '#ecfdf5',
    detailText: '#a7f3d0',
    accent: '#34d399'
  },
  matchWarning: {
    fill: '#261219',
    stroke: '#f43f5e',
    text: '#fff1f2',
    detailText: '#fecdd3',
    accent: '#fb7185'
  },
  team: {
    fill: '#121821',
    stroke: '#475569',
    text: '#f8fafc',
    detailText: '#94a3b8',
    accent: '#94a3b8'
  },
  seed: {
    fill: '#161f2d',
    stroke: '#64748b',
    text: '#f8fafc',
    detailText: '#94a3b8',
    accent: '#94a3b8'
  }
};

const TREE_SCALE_EXTENT = {
  page: { min: 0.5, max: 2.2 },
  fullscreen: { min: 0.55, max: 2.5 }
};

const PLANNER_TEXT_STYLE = {
  textRendering: 'optimizeLegibility'
};

const PLANNER_CANVAS_STYLE = {
  background:
    'radial-gradient(circle at top, rgba(212,175,55,0.08), transparent 28%), linear-gradient(180deg, #0b0f17 0%, #12161f 100%)',
  borderColor: 'rgba(212, 175, 55, 0.16)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
  '--vis-font-family': "'Space Grotesk', sans-serif",
  '--vis-graph-node-label-font-family': "'Space Grotesk', sans-serif",
  '--vis-graph-node-label-font-size': '10pt',
  '--vis-graph-node-sublabel-font-size': '8.5pt',
  '--vis-graph-node-label-background': 'rgba(11,15,23,0.9)',
  '--vis-graph-node-label-text-color': '#f8fafc',
  '--vis-graph-node-sublabel-text-color': '#94a3b8',
  '--vis-graph-node-greyout-color': '#252d38',
  '--vis-graph-node-icon-greyout-color': '#475569',
  '--vis-graph-node-side-label-background-greyout-color': '#2f3b4d'
};

const clamp = (value, minimum, maximum) => Math.min(Math.max(value, minimum), maximum);

const normalizeText = (value) => String(value || '').trim();

const escapeHtml = (value) =>
  String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const formatZoomLabel = (value) => `${Math.round(value)}%`;

const getNodeVisualStyle = (nodeDatum = {}) => {
  const fallback = FALLBACK_TONE_STYLES[nodeDatum.tone] || FALLBACK_TONE_STYLES.team;

  return {
    fill: nodeDatum.fill || fallback.fill,
    stroke: nodeDatum.stroke || fallback.stroke,
    text: nodeDatum.textColor || fallback.text,
    detailText: nodeDatum.detailTextColor || fallback.detailText,
    accent: nodeDatum.accentColor || fallback.accent
  };
};

const GRAPH_GROUP_NODE_STYLE = {
  fill: '#0d1d18',
  stroke: '#34d399',
  text: '#ecfdf5',
  detailText: '#a7f3d0',
  accent: '#4ade80',
  badgeFill: 'rgba(52,211,153,0.14)',
  badgeStroke: 'rgba(110,231,183,0.26)',
  glow: 'rgba(52,211,153,0.18)'
};

const GRAPH_PENTAGON_NODE_STYLE = {
  fill: '#0b1914',
  stroke: '#34d399',
  text: '#ecfdf5',
  detailText: '#a7f3d0',
  accent: '#4ade80',
  badgeFill: 'rgba(52,211,153,0.14)',
  badgeStroke: 'rgba(110,231,183,0.26)',
  glow: 'rgba(52,211,153,0.22)'
};

const estimateTextWidth = (text, fontSize = 10.5) =>
  Math.max(72, Math.round(normalizeText(text).length * fontSize * 0.66 + 24));

const truncateGraphText = (value, maxLength = 56) => {
  const normalizedValue = normalizeText(value);

  if (normalizedValue.length <= maxLength) {
    return normalizedValue;
  }

  return `${normalizedValue.slice(0, maxLength - 1)}...`;
};

const createPentagonPath = (width, height) => {
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const roofDrop = Math.round(Math.min(height * 0.24, 30));
  const bottomInset = Math.round(Math.min(width * 0.12, 32));

  return [
    `M 0 ${-halfHeight}`,
    `L ${halfWidth} ${-halfHeight + roofDrop}`,
    `L ${halfWidth - bottomInset} ${halfHeight}`,
    `L ${-halfWidth + bottomInset} ${halfHeight}`,
    `L ${-halfWidth} ${-halfHeight + roofDrop}`,
    'Z'
  ].join(' ');
};

const getPlannerGraphRenderStyle = (nodeDatum = {}) => {
  if (nodeDatum.kind === 'event' || nodeDatum.tone === 'root') {
    const style = getNodeVisualStyle(nodeDatum);

    return {
      ...style,
      badgeFill: 'rgba(255,247,219,0.14)',
      badgeStroke: 'rgba(255,247,219,0.24)',
      glow: 'rgba(212,175,55,0.22)'
    };
  }

  if (nodeDatum.kind === 'stage') {
    return GRAPH_GROUP_NODE_STYLE;
  }

  return GRAPH_PENTAGON_NODE_STYLE;
};

const getPlannerNodeBadgeLabel = (node = {}) => {
  if (node.kind === 'event') {
    return 'Event';
  }

  if (node.kind === 'stage') {
    return 'Group';
  }

  if (node.kind === 'seed') {
    return 'Qualifier';
  }

  if (node.kind === 'team') {
    return 'Team';
  }

  return node.groupKey || 'Fixture';
};

const getPlannerNodeTitle = (node = {}) => {
  if (node.kind === 'stage') {
    return normalizeText(node.groupKey || node.label || node.fullLabel) || 'Group';
  }

  if (node.kind === 'match' || node.kind === 'team' || node.kind === 'seed') {
    return normalizeText(node.fullLabel || node.label) || 'Planning node';
  }

  return normalizeText(node.label || node.fullLabel) || 'Planner node';
};

const getPlannerNodeMeta = (node = {}) => {
  if (node.kind === 'event') {
    return [
      node.stageCount ? `${node.stageCount} stages` : '',
      node.totalFixtures ? `${node.totalFixtures} fixtures` : '',
      `${node.completedFixtures || 0} completed`
    ]
      .filter(Boolean)
      .join(' • ');
  }

  if (node.kind === 'stage') {
    return [
      node.fixtureCount ? `${node.fixtureCount} fixtures` : '',
      node.completedCount ? `${node.completedCount} completed` : 'Published for planning'
    ]
      .filter(Boolean)
      .join(' • ');
  }

  if (node.kind === 'match') {
    return [
      node.groupKey || node.groupName,
      node.status || 'Scheduled',
      node.date,
      node.time,
      node.venue
    ]
      .filter(Boolean)
      .join(' • ');
  }

  return [
    node.groupKey || '',
    node.kind === 'seed' ? 'Qualifier slot' : 'Team node',
    node.sourceLabel && normalizeText(node.sourceLabel) !== normalizeText(node.fullLabel)
      ? node.sourceLabel
      : 'Ready for planning'
  ]
    .filter(Boolean)
    .join(' • ');
};

function ZoomControls({ onFit, onZoomIn, onZoomOut, zoomLabel }) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <div className="flex items-center gap-2 rounded-full border border-[rgba(212,175,55,0.16)] bg-white/5 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d4af37]">
          Zoom
        </span>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg font-bold text-white transition hover:border-[rgba(212,175,55,0.18)] hover:bg-[rgba(212,175,55,0.08)] hover:text-[#d4af37]"
          onClick={onZoomOut}
          type="button"
        >
          -
        </button>
        <span className="min-w-[52px] text-center text-sm font-semibold text-white">
          {zoomLabel}
        </span>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg font-bold text-white transition hover:border-[rgba(212,175,55,0.18)] hover:bg-[rgba(212,175,55,0.08)] hover:text-[#d4af37]"
          onClick={onZoomIn}
          type="button"
        >
          +
        </button>
        <button
          className="rounded-full border border-white/10 px-3 py-1.5 text-sm font-semibold text-slate-300 transition hover:border-[rgba(212,175,55,0.18)] hover:bg-[rgba(212,175,55,0.08)] hover:text-[#d4af37]"
          onClick={onFit}
          type="button"
        >
          Fit
        </button>
      </div>
    </div>
  );
}

const getCardMetrics = (node = {}, displayMode = 'page') => {
  const isFullscreen = displayMode === 'fullscreen';

  if (node.kind === 'event' || node.tone === 'root') {
    return {
      width: isFullscreen ? 430 : 372,
      height: isFullscreen ? 154 : 136
    };
  }

  if (node.kind === 'stage' || node.tone === 'stage') {
    return {
      width: isFullscreen ? 320 : 286,
      height: isFullscreen ? 116 : 100
    };
  }

  if (node.kind === 'team' || node.kind === 'seed' || node.tone === 'team' || node.tone === 'seed') {
    return {
      width: isFullscreen ? 246 : 220,
      height: isFullscreen ? 96 : 84
    };
  }

  return {
    width: isFullscreen ? 350 : 310,
    height: isFullscreen ? 154 : 138
  };
};

const renderFixtureNode = ({ displayMode, nodeDatum, selectedMatchId }) => {
  const styles = getNodeVisualStyle(nodeDatum);
  const details = Array.isArray(nodeDatum.details) ? nodeDatum.details.filter(Boolean).slice(0, 3) : [];
  const isSelected = Boolean(nodeDatum.matchId && nodeDatum.matchId === selectedMatchId);
  const { width, height } = getCardMetrics(nodeDatum, displayMode);
  const titleSize = displayMode === 'fullscreen' ? 18 : 16;
  const detailSize = displayMode === 'fullscreen' ? 13.5 : 12.5;
  const titleY =
    nodeDatum.kind === 'team' || nodeDatum.kind === 'seed'
      ? -4
      : displayMode === 'fullscreen'
        ? -28
        : -20;
  const detailYBase =
    nodeDatum.kind === 'team' || nodeDatum.kind === 'seed'
      ? 20
      : displayMode === 'fullscreen'
        ? 6
        : 10;

  return (
    <g
      style={{
        cursor: nodeDatum.matchId ? 'pointer' : 'default',
        filter: isSelected
          ? 'drop-shadow(0 16px 28px rgba(212,175,55,0.24))'
          : 'drop-shadow(0 12px 24px rgba(0,0,0,0.24))'
      }}
    >
      <rect
        fill={styles.fill}
        height={height}
        rx={26}
        shapeRendering="geometricPrecision"
        stroke={isSelected ? '#d4af37' : styles.stroke}
        strokeWidth={isSelected ? 3 : 1.5}
        vectorEffect="non-scaling-stroke"
        width={width}
        x={-width / 2}
        y={-height / 2}
      />
      <rect
        fill={styles.accent}
        height={displayMode === 'fullscreen' ? 11 : 9}
        pointerEvents="none"
        rx={26}
        width={width}
        x={-width / 2}
        y={-height / 2}
      />
      <text
        fill={styles.text}
        fontFamily="Space Grotesk, sans-serif"
        fontSize={titleSize}
        fontWeight="800"
        letterSpacing="0.01em"
        paintOrder="stroke"
        stroke="rgba(8,11,18,0.24)"
        strokeLinejoin="round"
        strokeWidth="0.45"
        style={PLANNER_TEXT_STYLE}
        textAnchor="middle"
        x="0"
        y={titleY}
      >
        {nodeDatum.name}
      </text>
      {details.map((line, index) => (
        <text
          fill={styles.detailText}
          fontFamily="Space Grotesk, sans-serif"
          fontSize={detailSize}
          fontWeight="600"
          key={`${nodeDatum.name}-${index}`}
          paintOrder="stroke"
          stroke="rgba(8,11,18,0.2)"
          strokeLinejoin="round"
          strokeWidth="0.35"
          style={PLANNER_TEXT_STYLE}
          textAnchor="middle"
          x="0"
          y={detailYBase + index * (displayMode === 'fullscreen' ? 17 : 15)}
        >
          {line}
        </text>
      ))}
    </g>
  );
};

function FixtureTreeCanvas({
  containerRef,
  displayMode,
  onSelectMatch,
  selectedMatchId,
  visualization
}) {
  const [containerWidth, setContainerWidth] = useState(960);
  const [viewportHeight, setViewportHeight] = useState(
    typeof window === 'undefined' ? 900 : window.innerHeight
  );
  const [zoomPercent, setZoomPercent] = useState(100);
  const liveViewRef = useRef(null);
  const [controlledView, setControlledView] = useState(null);

  const scaleExtent =
    displayMode === 'fullscreen'
      ? TREE_SCALE_EXTENT.fullscreen
      : TREE_SCALE_EXTENT.page;

  useEffect(() => {
    const containerElement = containerRef.current;

    if (!containerElement) {
      return undefined;
    }

    const updateMeasurements = () => {
      setContainerWidth(Math.max(containerElement.getBoundingClientRect().width, 320));
      setViewportHeight(typeof window === 'undefined' ? 900 : window.innerHeight);
    };

    updateMeasurements();

    const resizeObserver =
      typeof ResizeObserver === 'function' ? new ResizeObserver(updateMeasurements) : null;

    resizeObserver?.observe(containerElement);
    window.addEventListener('resize', updateMeasurements);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateMeasurements);
    };
  }, [containerRef]);

  const treeHeight = useMemo(() => {
    if (displayMode === 'fullscreen') {
      return clamp(viewportHeight - 280, 640, 1200);
    }

    if (visualization.mode === 'dependency') {
      return clamp(visualization.metrics.leafCount * 124 + 280, 620, 1120);
    }

    return clamp(visualization.metrics.nodeCount * 48 + 360, 580, 940);
  }, [displayMode, viewportHeight, visualization]);

  const orientation = visualization.mode === 'dependency' ? 'horizontal' : 'vertical';
  const estimatedGraphWidth =
    visualization.mode === 'dependency'
      ? visualization.metrics.depth * (displayMode === 'fullscreen' ? 470 : 380)
      : Math.max(visualization.metrics.leafCount, 2) *
        (displayMode === 'fullscreen' ? 300 : 250);
  const estimatedGraphHeight =
    visualization.mode === 'dependency'
      ? Math.max(visualization.metrics.leafCount, 2) *
        (displayMode === 'fullscreen' ? 215 : 190)
      : visualization.metrics.depth * (displayMode === 'fullscreen' ? 245 : 210);
  const readableMinimumZoom = displayMode === 'fullscreen' ? 0.92 : 0.86;
  const fitView = useMemo(() => {
    const fitZoom = clamp(
      Math.min(
        (containerWidth - 120) / estimatedGraphWidth,
        (treeHeight - 96) / estimatedGraphHeight,
        1.1
      ),
      readableMinimumZoom,
      scaleExtent.max
    );

    return {
      zoom: fitZoom,
      translate:
        visualization.mode === 'dependency'
          ? {
              x: displayMode === 'fullscreen' ? 230 : 190,
              y: treeHeight / 2
            }
          : {
              x: containerWidth / 2,
              y: displayMode === 'fullscreen' ? 120 : 104
            }
    };
  }, [
    containerWidth,
    displayMode,
    estimatedGraphHeight,
    estimatedGraphWidth,
    readableMinimumZoom,
    scaleExtent.max,
    treeHeight,
    visualization.mode
  ]);

  useEffect(() => {
    const nextView = {
      zoom: fitView.zoom,
      translate: {
        x: fitView.translate.x,
        y: fitView.translate.y
      }
    };

    liveViewRef.current = nextView;
    setControlledView(nextView);
    setZoomPercent(Math.round(nextView.zoom * 100));
  }, [fitView.translate.x, fitView.translate.y, fitView.zoom, visualization.data]);

  useEffect(() => {
    const svgElement = containerRef.current?.querySelector('svg');

    if (!svgElement) {
      return;
    }

    svgElement.querySelectorAll('.rd3t-link').forEach((pathElement) => {
      pathElement.setAttribute('fill', 'none');
      pathElement.setAttribute('stroke', 'rgba(120,141,173,0.58)');
      pathElement.setAttribute('stroke-width', displayMode === 'fullscreen' ? '2.8' : '2.4');
      pathElement.setAttribute('stroke-linecap', 'round');
      pathElement.setAttribute('stroke-linejoin', 'round');
      pathElement.setAttribute('vector-effect', 'non-scaling-stroke');
      pathElement.setAttribute('shape-rendering', 'geometricPrecision');
    });
  }, [containerRef, controlledView, displayMode, selectedMatchId, visualization]);

  const applyViewState = (nextView) => {
    liveViewRef.current = nextView;
    setControlledView(nextView);
    setZoomPercent(Math.round(nextView.zoom * 100));
  };

  const handleZoom = (direction) => {
    const currentView = liveViewRef.current || fitView;
    const step = displayMode === 'fullscreen' ? 0.14 : 0.12;

    applyViewState({
      ...currentView,
      zoom: clamp(
        currentView.zoom + direction * step,
        scaleExtent.min,
        scaleExtent.max
      )
    });
  };

  const handleFit = () => {
    applyViewState({
      zoom: fitView.zoom,
      translate: fitView.translate
    });
  };

  const nodeSize =
    visualization.mode === 'dependency'
      ? displayMode === 'fullscreen'
        ? { x: 440, y: 270 }
        : { x: 360, y: 220 }
      : displayMode === 'fullscreen'
        ? { x: 340, y: 250 }
        : { x: 280, y: 210 };

  return (
    <div className="space-y-4">
      <ZoomControls
        onFit={handleFit}
        onZoomIn={() => handleZoom(1)}
        onZoomOut={() => handleZoom(-1)}
        zoomLabel={formatZoomLabel(zoomPercent)}
      />

      <div
        className={`overflow-hidden rounded-[28px] border ${
          displayMode === 'fullscreen' ? 'shadow-[0_28px_90px_rgba(0,0,0,0.44)]' : ''
        }`}
        ref={containerRef}
        style={{ ...PLANNER_CANVAS_STYLE, height: treeHeight }}
      >
        {controlledView ? (
          <Tree
            collapsible={false}
            data={visualization.data}
            dimensions={{ width: containerWidth, height: treeHeight }}
            draggable
            nodeSize={nodeSize}
            onNodeClick={(node) => {
              if (node.data?.matchId) {
                onSelectMatch?.(node.data.matchId);
              }
            }}
            onUpdate={({ zoom, translate }) => {
              liveViewRef.current = { zoom, translate };
              setZoomPercent((currentValue) => {
                const nextValue = Math.round(zoom * 100);
                return Math.abs(currentValue - nextValue) >= 2 ? nextValue : currentValue;
              });
            }}
            orientation={orientation}
            pathFunc="elbow"
            renderCustomNodeElement={(nodeProps) =>
              renderFixtureNode({
                ...nodeProps,
                displayMode,
                selectedMatchId
              })
            }
            scaleExtent={scaleExtent}
            separation={
              displayMode === 'fullscreen'
                ? { siblings: 1.2, nonSiblings: 1.72 }
                : { siblings: 1.1, nonSiblings: 1.52 }
            }
            translate={controlledView.translate}
            zoom={controlledView.zoom}
          />
        ) : null}
      </div>
    </div>
  );
}

function ForceGraphCanvas({
  containerRef,
  displayMode,
  graphData,
  onSelectMatch,
  selectedMatchId,
  visualization
}) {
  const graphRef = useRef(null);
  const [viewportHeight, setViewportHeight] = useState(
    typeof window === 'undefined' ? 900 : window.innerHeight
  );
  const [zoomPercent, setZoomPercent] = useState(100);

  useEffect(() => {
    const updateMeasurements = () => {
      setViewportHeight(typeof window === 'undefined' ? 900 : window.innerHeight);
    };

    updateMeasurements();
    window.addEventListener('resize', updateMeasurements);

    return () => {
      window.removeEventListener('resize', updateMeasurements);
    };
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      graphRef.current?.component?.fitView(0);
    }, 80);

    return () => {
      clearTimeout(timerId);
    };
  }, [displayMode, graphData.links.length, graphData.nodes.length]);

  const graphHeight = useMemo(() => {
    if (displayMode === 'fullscreen') {
      return clamp(viewportHeight - 260, 720, 1280);
    }

    return clamp(visualization.metrics.nodeCount * 78 + 540, 760, 1220);
  }, [displayMode, viewportHeight, visualization.metrics.nodeCount]);

  const graphEvents = useMemo(
    () => ({
      [VisGraphSelectors.node]: {
        click: (node) => {
          if (node.matchId) {
            onSelectMatch?.(node.matchId);
          }
        }
      }
    }),
    [onSelectMatch]
  );

  const renderNode = useMemo(
    () => (datum, nodeGroupElementSelection) => {
      renderCustomGraphNode(datum, nodeGroupElementSelection, displayMode);
    },
    [displayMode]
  );

  return (
    <div className="space-y-4">
      <ZoomControls
        onFit={() => graphRef.current?.component?.fitView(450)}
        onZoomIn={() => graphRef.current?.component?.zoomIn(0.22)}
        onZoomOut={() => graphRef.current?.component?.zoomOut(0.22)}
        zoomLabel={formatZoomLabel(zoomPercent)}
      />

      <div
        className={`overflow-hidden rounded-[28px] border ${
          displayMode === 'fullscreen' ? 'shadow-[0_28px_90px_rgba(0,0,0,0.44)]' : ''
        }`}
        ref={containerRef}
        style={PLANNER_CANVAS_STYLE}
      >
        <VisSingleContainer
          data={graphData}
          style={{ height: `${graphHeight}px`, width: '100%' }}
        >
          <VisGraph
            ref={graphRef}
            attributes={{
              [VisGraphSelectors.node]: {
                cursor: (node) => (node.matchId ? 'pointer' : 'grab'),
                'shape-rendering': 'geometricPrecision'
              }
            }}
            disableDrag={false}
            events={graphEvents}
            fitViewPadding={displayMode === 'fullscreen' ? 96 : 76}
            forceLayoutSettings={{
              charge: displayMode === 'fullscreen' ? -3400 : -2800,
              forceXStrength: 0.08,
              forceYStrength: 0.11,
              linkDistance: displayMode === 'fullscreen' ? 248 : 218,
              linkStrength: 0.28
            }}
            layoutAutofit
            layoutType={GraphLayoutType.Force}
            linkStroke={() => 'rgba(74,222,128,0.38)'}
            linkWidth={(link) => link.width}
            nodeEnterCustomRenderFunction={renderNode}
            nodePartialUpdateCustomRenderFunction={renderNode}
            nodeSelectionHighlightMode={
              selectedMatchId
                ? GraphNodeSelectionHighlightMode.GreyoutNonConnected
                : GraphNodeSelectionHighlightMode.None
            }
            nodeSize={(node) => getGraphNodeCollisionSize(node, displayMode)}
            nodeUpdateCustomRenderFunction={renderNode}
            onZoom={(zoomScale) => setZoomPercent(Math.round(zoomScale * 100))}
            selectedNodeId={selectedMatchId || undefined}
            zoomScaleExtent={[0.52, 2.35]}
          />
        </VisSingleContainer>
      </div>
    </div>
  );
}

const createTooltipRow = (label, value) => {
  const normalizedValue = normalizeText(value);

  if (!normalizedValue) {
    return '';
  }

  return `<div style="display:flex;justify-content:space-between;gap:14px;margin-top:7px;">
    <span style="color:#94a3b8;font-size:12px;">${escapeHtml(label)}</span>
    <span style="color:#f8fafc;font-size:12.5px;font-weight:600;text-align:right;">${escapeHtml(normalizedValue)}</span>
  </div>`;
};

const getStandingMetaLine = (standing = {}, sportType = '') => {
  if (!standing) {
    return '';
  }

  if (normalizeText(sportType).toLowerCase() === 'football') {
    return `GD ${standing.goalDifference}`;
  }

  return `NRR ${Number(standing.netRunRate || 0).toFixed(2)}`;
};

const createStandingCardHtml = (participant, standingsLookup, sportType = '') => {
  const standing = standingsLookup.get(normalizeText(participant.fullLabel).toLowerCase());

  if (!standing) {
    return '';
  }

  return `<div style="margin-top:10px;border:1px solid ${participant.stroke};background:${participant.fill};border-radius:14px;padding:10px 12px;">
    <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;">
      <div>
        <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${participant.text};font-weight:700;">${escapeHtml(participant.groupKey || 'Team')}</div>
        <div style="margin-top:5px;font-size:14px;font-weight:700;color:${participant.text};">${escapeHtml(participant.fullLabel)}</div>
      </div>
      <div style="font-size:12px;font-weight:700;color:${participant.text};">#${escapeHtml(standing.rank)}</div>
    </div>
    <div style="margin-top:8px;color:#0f172a;font-size:12px;line-height:1.5;">
      ${escapeHtml(`Points ${standing.points} • ${standing.played} played • ${standing.wins} wins`)}
    </div>
    <div style="margin-top:4px;color:rgba(15,23,42,0.76);font-size:12px;line-height:1.5;">
      ${escapeHtml(`${standing.qualificationStatus} • ${getStandingMetaLine(standing, sportType)}`)}
    </div>
  </div>`;
};

const createCustomGraphTooltip = (node, standingsLookup, sportType = '') => {
  const tooltipStyle = getPlannerGraphRenderStyle(node);
  const headerLabel = node.badgeLabel || node.groupKey || node.kind || 'Planner node';
  const title =
    node.kind === 'match'
      ? node.fullLabel || node.label
      : node.fullLabel || node.label || 'Planner node';

  const summaryRows = [];

  if (node.kind === 'event') {
    summaryRows.push(createTooltipRow('Fixtures', node.totalFixtures));
    summaryRows.push(createTooltipRow('Completed', node.completedFixtures));
    summaryRows.push(createTooltipRow('Stages', node.stageCount));
    summaryRows.push(createTooltipRow('Groups', node.groupCount));
  } else if (node.kind === 'stage') {
    summaryRows.push(createTooltipRow('Stage', node.fullLabel || node.label));
    summaryRows.push(createTooltipRow('Fixtures', node.fixtureCount));
    summaryRows.push(createTooltipRow('Completed', node.completedCount));
  } else if (node.kind === 'match') {
    summaryRows.push(createTooltipRow('Stage', node.roundLabel || node.groupName || node.badgeLabel));
    summaryRows.push(createTooltipRow('Status', node.status));
    summaryRows.push(createTooltipRow('Match #', node.matchNumber));
    summaryRows.push(createTooltipRow('Date', node.date));
    summaryRows.push(createTooltipRow('Time', node.time));
    summaryRows.push(createTooltipRow('Venue', node.venue));
    summaryRows.push(createTooltipRow('Winner', node.winnerTeam));
    summaryRows.push(createTooltipRow('Score', node.scoreLine));
  } else {
    summaryRows.push(createTooltipRow(node.kind === 'seed' ? 'Source' : 'Team', node.fullLabel || node.label));
    summaryRows.push(createTooltipRow('Group', node.groupKey));
  }

  const participantCards =
    Array.isArray(node.participants) && node.participants.length
      ? node.participants
          .map((participant) => createStandingCardHtml(participant, standingsLookup, sportType))
          .join('')
      : '';

  return `<div style="min-width:280px;max-width:340px;font-family:'Space Grotesk',sans-serif;">
    <div style="padding:12px 14px;border-radius:18px 18px 0 0;background:${tooltipStyle.fill};border:1px solid ${tooltipStyle.stroke};border-bottom:none;color:${tooltipStyle.text};">
      <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;font-weight:700;opacity:0.92;">${escapeHtml(headerLabel)}</div>
      <div style="margin-top:6px;font-size:16px;font-weight:800;line-height:1.3;">${escapeHtml(title)}</div>
    </div>
    <div style="padding:12px 14px 14px;border:1px solid ${tooltipStyle.stroke};border-top:none;border-radius:0 0 18px 18px;background:#0f1720;">
      ${summaryRows.join('')}
      ${participantCards}
    </div>
  </div>`;
};

const getCustomGraphCardSize = (node, displayMode) => {
  const isFullscreen = displayMode === 'fullscreen';

  if (node.kind === 'event') {
    return {
      width: isFullscreen ? 416 : 356,
      height: isFullscreen ? 148 : 130,
      titleSize: isFullscreen ? 18.4 : 16.2,
      detailSize: isFullscreen ? 13.1 : 11.8,
      badgeSize: 10.8
    };
  }

  if (node.kind === 'stage') {
    return {
      width: isFullscreen ? 278 : 240,
      height: isFullscreen ? 110 : 96,
      titleSize: isFullscreen ? 16.4 : 14.8,
      detailSize: isFullscreen ? 12.7 : 11.4,
      badgeSize: 10.2
    };
  }

  if (node.kind === 'match') {
    return {
      width: isFullscreen ? 316 : 278,
      height: isFullscreen ? 142 : 126,
      titleSize: isFullscreen ? 15.8 : 14.2,
      detailSize: isFullscreen ? 12.2 : 10.9,
      badgeSize: 10.2
    };
  }

  return {
    width: isFullscreen ? 260 : 228,
    height: isFullscreen ? 122 : 108,
    titleSize: isFullscreen ? 14.8 : 13.4,
    detailSize: isFullscreen ? 12.1 : 10.8,
    badgeSize: 10
  };
};

const getGraphNodeCollisionSize = (node, displayMode) => {
  const { width } = getCustomGraphCardSize(node, displayMode);

  if (node.kind === 'event') {
    return Math.round(width * 0.42);
  }

  if (node.kind === 'stage') {
    return Math.round(width * 0.38);
  }

  return Math.round(width * 0.4);
};

const renderCustomGraphNode = (datum, groupSelection, displayMode) => {
  const { width, height, titleSize, detailSize, badgeSize } = getCustomGraphCardSize(datum, displayMode);
  const isSelected = Boolean(datum._state?.selected);
  const isDimmed = Boolean(datum._state?.greyout && !isSelected);
  const isPentagon = ['match', 'team', 'seed'].includes(datum.kind);
  const accentHeight = datum.kind === 'event' ? 12 : 10;
  const renderStyle = getPlannerGraphRenderStyle(datum);
  const badgeLabel = truncateGraphText(getPlannerNodeBadgeLabel(datum), 14).toUpperCase();
  const badgeWidth = estimateTextWidth(badgeLabel, badgeSize);
  const title = truncateGraphText(
    getPlannerNodeTitle(datum),
    datum.kind === 'match'
      ? displayMode === 'fullscreen'
        ? 38
        : 32
      : datum.kind === 'event'
        ? displayMode === 'fullscreen'
          ? 32
          : 28
        : 26
  );
  const metaLine = truncateGraphText(
    getPlannerNodeMeta(datum),
    displayMode === 'fullscreen' ? 76 : datum.kind === 'match' ? 62 : 54
  );
  const supportingLine =
    datum.kind === 'event'
      ? truncateGraphText(normalizeText(datum.subLabel), displayMode === 'fullscreen' ? 66 : 58)
      : '';
  const baseX = -width / 2 + (isPentagon ? 24 : 20);
  const badgeY = -height / 2 + 16;
  const titleY = -height / 2 + (isPentagon ? 58 : 56);
  const metaY = titleY + 24;

  groupSelection.selectAll('.tricore-custom-node').remove();

  const shell = groupSelection
    .append('g')
    .attr('class', 'tricore-custom-node')
    .attr('opacity', isDimmed ? 0.42 : 1);

  if (isPentagon) {
    shell
      .append('path')
      .attr('class', VisGraphSelectors.node)
      .attr('d', createPentagonPath(width, height))
      .attr('fill', renderStyle.fill)
      .attr('stroke', isSelected ? '#d4af37' : renderStyle.stroke)
      .attr('stroke-width', isSelected ? 3 : 1.8)
      .attr('vector-effect', 'non-scaling-stroke')
      .style(
        'filter',
        isSelected
          ? 'drop-shadow(0 18px 34px rgba(212,175,55,0.24))'
          : `drop-shadow(0 16px 28px ${renderStyle.glow}) drop-shadow(0 10px 22px rgba(0,0,0,0.2))`
      );
  } else {
    shell
      .append('rect')
      .attr('class', VisGraphSelectors.node)
      .attr('x', -width / 2)
      .attr('y', -height / 2)
      .attr('width', width)
      .attr('height', height)
      .attr('rx', 24)
      .attr('fill', renderStyle.fill)
      .attr('stroke', isSelected ? '#d4af37' : renderStyle.stroke)
      .attr('stroke-width', isSelected ? 3 : 1.6)
      .attr('vector-effect', 'non-scaling-stroke')
      .style(
        'filter',
        isSelected
          ? 'drop-shadow(0 16px 28px rgba(212,175,55,0.24))'
          : `drop-shadow(0 14px 26px ${renderStyle.glow}) drop-shadow(0 10px 20px rgba(0,0,0,0.22))`
      );

    shell
      .append('rect')
      .attr('x', -width / 2)
      .attr('y', -height / 2)
      .attr('width', width)
      .attr('height', accentHeight)
      .attr('rx', 24)
      .attr('fill', renderStyle.accent)
      .attr('pointer-events', 'none');
  }

  shell
    .append('rect')
    .attr('x', baseX)
    .attr('y', badgeY)
    .attr('width', badgeWidth)
    .attr('height', 22)
    .attr('rx', 11)
    .attr('fill', renderStyle.badgeFill)
    .attr('stroke', renderStyle.badgeStroke)
    .attr('stroke-width', 1)
    .attr('pointer-events', 'none');

  shell
    .append('text')
    .attr('x', baseX + badgeWidth / 2)
    .attr('y', badgeY + 14)
    .attr('fill', datum.kind === 'event' ? '#fff7db' : renderStyle.accent)
    .attr('font-family', 'Space Grotesk, sans-serif')
    .attr('font-size', badgeSize)
    .attr('font-weight', 700)
    .attr('letter-spacing', '0.18em')
    .attr('text-anchor', 'middle')
    .attr('pointer-events', 'none')
    .style('text-rendering', 'optimizeLegibility')
    .text(badgeLabel.toUpperCase());

  shell
    .append('text')
    .attr('x', baseX)
    .attr('y', titleY)
    .attr('fill', renderStyle.text)
    .attr('font-family', 'Space Grotesk, sans-serif')
    .attr('font-size', titleSize)
    .attr('font-weight', 800)
    .attr('text-anchor', 'start')
    .attr('pointer-events', 'none')
    .style('text-rendering', 'optimizeLegibility')
    .text(title);

  if (metaLine) {
    shell
      .append('text')
      .attr('x', baseX)
      .attr('y', metaY)
      .attr('fill', renderStyle.detailText)
      .attr('font-family', 'Space Grotesk, sans-serif')
      .attr('font-size', detailSize)
      .attr('font-weight', 600)
      .attr('text-anchor', 'start')
      .attr('pointer-events', 'none')
      .style('text-rendering', 'optimizeLegibility')
      .text(metaLine);
  }

  if (supportingLine && supportingLine !== metaLine) {
    shell
      .append('text')
      .attr('x', baseX)
      .attr('y', metaY + 20)
      .attr('fill', renderStyle.detailText)
      .attr('font-family', 'Space Grotesk, sans-serif')
      .attr('font-size', detailSize)
      .attr('font-weight', 600)
      .attr('text-anchor', 'start')
      .attr('pointer-events', 'none')
      .style('text-rendering', 'optimizeLegibility')
      .text(supportingLine);
  }
};

const buildStandingsLookup = (standings = []) =>
  new Map(
    (Array.isArray(standings) ? standings : []).map((row) => [
      normalizeText(row.teamName).toLowerCase(),
      row
    ])
  );

function CustomNodesGraphCanvas({
  containerRef,
  displayMode,
  graphData,
  onSelectMatch,
  selectedMatchId,
  sportType,
  standingsLookup,
  visualization
}) {
  const graphRef = useRef(null);
  const [viewportHeight, setViewportHeight] = useState(
    typeof window === 'undefined' ? 900 : window.innerHeight
  );
  const [zoomPercent, setZoomPercent] = useState(100);

  useEffect(() => {
    const updateMeasurements = () => {
      setViewportHeight(typeof window === 'undefined' ? 900 : window.innerHeight);
    };

    updateMeasurements();
    window.addEventListener('resize', updateMeasurements);

    return () => {
      window.removeEventListener('resize', updateMeasurements);
    };
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      graphRef.current?.component?.fitView(0);
    }, 100);

    return () => {
      clearTimeout(timerId);
    };
  }, [displayMode, graphData.links.length, graphData.nodes.length]);

  const graphHeight = useMemo(() => {
    if (displayMode === 'fullscreen') {
      return clamp(viewportHeight - 250, 760, 1320);
    }

    return clamp(visualization.metrics.nodeCount * 84 + 560, 820, 1360);
  }, [displayMode, viewportHeight, visualization.metrics.nodeCount]);

  const graphEvents = useMemo(
    () => ({
      [VisGraphSelectors.node]: {
        click: (node) => {
          if (node.matchId) {
            onSelectMatch?.(node.matchId);
          }
        }
      }
    }),
    [onSelectMatch]
  );

  const tooltipTriggers = useMemo(
    () => ({
      [VisGraphSelectors.node]: (node) =>
        createCustomGraphTooltip(node, standingsLookup, sportType)
    }),
    [sportType, standingsLookup]
  );

  const renderNode = useMemo(
    () => (datum, nodeGroupElementSelection) => {
      renderCustomGraphNode(datum, nodeGroupElementSelection, displayMode);
    },
    [displayMode]
  );

  return (
    <div className="space-y-4">
      <ZoomControls
        onFit={() => graphRef.current?.component?.fitView(450)}
        onZoomIn={() => graphRef.current?.component?.zoomIn(0.2)}
        onZoomOut={() => graphRef.current?.component?.zoomOut(0.2)}
        zoomLabel={formatZoomLabel(zoomPercent)}
      />

      <div
        className={`overflow-hidden rounded-[28px] border ${
          displayMode === 'fullscreen' ? 'shadow-[0_28px_90px_rgba(0,0,0,0.44)]' : ''
        }`}
        ref={containerRef}
        style={PLANNER_CANVAS_STYLE}
      >
        <VisSingleContainer
          data={graphData}
          style={{ height: `${graphHeight}px`, width: '100%' }}
        >
          <VisGraph
            ref={graphRef}
            attributes={{
              [VisGraphSelectors.node]: {
                cursor: (node) => (node.matchId ? 'pointer' : 'grab')
              }
            }}
            disableDrag={false}
            events={graphEvents}
            fitViewPadding={displayMode === 'fullscreen' ? 110 : 84}
            forceLayoutSettings={{
              charge: displayMode === 'fullscreen' ? -4200 : -3400,
              forceXStrength: 0.07,
              forceYStrength: 0.1,
              linkDistance: displayMode === 'fullscreen' ? 284 : 248,
              linkStrength: 0.24
            }}
            layoutAutofit
            layoutType={GraphLayoutType.Force}
            linkStroke={() => 'rgba(74,222,128,0.38)'}
            linkWidth={(link) => link.width}
            nodeEnterCustomRenderFunction={renderNode}
            nodePartialUpdateCustomRenderFunction={renderNode}
            nodeSelectionHighlightMode={
              selectedMatchId
                ? GraphNodeSelectionHighlightMode.GreyoutNonConnected
                : GraphNodeSelectionHighlightMode.None
            }
            nodeSize={(node) => getGraphNodeCollisionSize(node, displayMode)}
            nodeUpdateCustomRenderFunction={renderNode}
            onZoom={(zoomScale) => setZoomPercent(Math.round(zoomScale * 100))}
            selectedNodeId={selectedMatchId || undefined}
            zoomScaleExtent={[0.48, 2.3]}
          />
          <VisTooltip
            allowHover
            followCursor
            hideDelay={90}
            showDelay={40}
            triggers={tooltipTriggers}
          />
        </VisSingleContainer>
      </div>
    </div>
  );
}

export default function FixtureTreePanel({
  eventName = '',
  matches = [],
  selectedMatchId = '',
  onPrintError,
  onPrintSuccess,
  onSelectMatch,
  sportType = '',
  standings = []
}) {
  const inlineTreeContainerRef = useRef(null);
  const fullscreenTreeContainerRef = useRef(null);
  const inlineForceContainerRef = useRef(null);
  const fullscreenForceContainerRef = useRef(null);
  const inlineCustomContainerRef = useRef(null);
  const fullscreenCustomContainerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState('tree');

  const visualization = useMemo(
    () => buildFixtureVisualization({ eventName, matches }),
    [eventName, matches]
  );

  const forceGraphData = useMemo(
    () => buildFixtureForceGraphData(visualization),
    [visualization]
  );

  const standingsLookup = useMemo(() => buildStandingsLookup(standings), [standings]);

  useEffect(() => {
    if (!isFullscreen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  if (!visualization) {
    return (
      <section className="panel space-y-4 p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(212,175,55,0.12)] text-[#d4af37]">
            <AppIcon className="h-5 w-5" name="matches" />
          </span>
          <div>
            <h2 className="text-2xl font-bold text-white">Fixture Planner</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Publish or create at least one fixture to unlock the planner views.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const activeViewLabel =
    viewMode === 'custom'
      ? 'Custom Nodes Graph'
      : viewMode === 'force'
        ? 'Force Layout Graph'
        : 'Planner Tree';

  const getContainerRefForPrint = (displayMode) => {
    if (viewMode === 'force') {
      return displayMode === 'fullscreen'
        ? fullscreenForceContainerRef
        : inlineForceContainerRef;
    }

    if (viewMode === 'custom') {
      return displayMode === 'fullscreen'
        ? fullscreenCustomContainerRef
        : inlineCustomContainerRef;
    }

    return displayMode === 'fullscreen'
      ? fullscreenTreeContainerRef
      : inlineTreeContainerRef;
  };

  const handlePrint = (displayMode = 'page') => {
    const svgElement = getContainerRefForPrint(displayMode).current?.querySelector('svg');
    const opened = printMatchFixtureTree({
      eventName,
      matches,
      svgElement,
      viewLabel:
        displayMode === 'fullscreen'
          ? `${visualization.viewLabel} - ${activeViewLabel} Full Screen`
          : `${visualization.viewLabel} - ${activeViewLabel}`
    });

    if (!opened) {
      onPrintError?.('Unable to open the fixture planner print window. Check browser pop-up settings.');
      return;
    }

    onPrintSuccess?.('Fixture planner print view opened in a new tab.');
  };

  const renderPlannerView = (displayMode) => {
    if (viewMode === 'force') {
      return (
        <ForceGraphCanvas
          containerRef={
            displayMode === 'fullscreen'
              ? fullscreenForceContainerRef
              : inlineForceContainerRef
          }
          displayMode={displayMode}
          graphData={forceGraphData}
          onSelectMatch={onSelectMatch}
          selectedMatchId={selectedMatchId}
          visualization={visualization}
        />
      );
    }

    if (viewMode === 'custom') {
      return (
        <CustomNodesGraphCanvas
          containerRef={
            displayMode === 'fullscreen'
              ? fullscreenCustomContainerRef
              : inlineCustomContainerRef
          }
          displayMode={displayMode}
          graphData={forceGraphData}
          onSelectMatch={onSelectMatch}
          selectedMatchId={selectedMatchId}
          sportType={sportType}
          standingsLookup={standingsLookup}
          visualization={visualization}
        />
      );
    }

    return (
      <FixtureTreeCanvas
        containerRef={
          displayMode === 'fullscreen'
            ? fullscreenTreeContainerRef
            : inlineTreeContainerRef
        }
        displayMode={displayMode}
        onSelectMatch={onSelectMatch}
        selectedMatchId={selectedMatchId}
        visualization={visualization}
      />
    );
  };

  return (
    <>
      <section className="panel space-y-5 p-6">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Fixture Planner</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              Review the same fixture plan as a readable tree, a custom-rendered force layout, or
              a compact node graph with clearer group cards and higher-contrast fixture nodes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-[rgba(212,175,55,0.16)] bg-white/5 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
              {VIEW_MODES.map((mode) => (
                <button
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    viewMode === mode.key
                      ? 'bg-[#345fd6] text-white shadow-[0_10px_20px_rgba(52,95,214,0.28)]'
                      : 'text-slate-300 hover:bg-[rgba(212,175,55,0.08)] hover:text-[#d4af37]'
                  }`}
                  key={mode.key}
                  onClick={() => setViewMode(mode.key)}
                  type="button"
                >
                  {mode.label}
                </button>
              ))}
            </div>
            <button className="btn-secondary" onClick={() => setIsFullscreen(true)} type="button">
              <span className="mr-2 inline-flex align-middle">
                <AppIcon className="h-4 w-4" name="expand" />
              </span>
              Open Full Screen
            </button>
            <button className="btn-secondary" onClick={() => handlePrint('page')} type="button">
              <span className="mr-2 inline-flex align-middle">
                <AppIcon className="h-4 w-4" name="export" />
              </span>
              Print Planner View
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="badge border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.1)] text-[#f4d67a]">
            {visualization.viewLabel}
          </span>
          <span className="badge border border-white/10 bg-white/5 text-white">
            {activeViewLabel}
          </span>
          <span className="badge border border-white/10 bg-white/5 text-white">
            {visualization.summary.totalFixtures} Fixtures
          </span>
          <span className="badge border border-emerald-400/20 bg-emerald-400/10 text-emerald-200">
            {visualization.summary.completedFixtures} Completed
          </span>
          <span className="badge border border-white/10 bg-white/5 text-white">
            {visualization.summary.stageCount} Stages
          </span>
          {visualization.summary.groupCount ? (
            <span className="badge border border-white/10 bg-white/5 text-white">
              {visualization.summary.groupCount} Groups
            </span>
          ) : null}
        </div>

        <div className="rounded-3xl border border-dashed border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.06)] px-4 py-3 text-sm leading-6 text-slate-300">
          Group nodes now stay compact, fixture nodes share the same green planning treatment
          across both graphs, and the force spacing is widened so links and labels stay readable.
        </div>

        {renderPlannerView('page')}
      </section>

      {isFullscreen ? (
        <div
          className="fixed inset-0 z-[140] bg-black/60 p-3 backdrop-blur-sm sm:p-6"
          onClick={() => setIsFullscreen(false)}
          role="presentation"
        >
          <div
            aria-label="Fixture planner full screen view"
            aria-modal="true"
            className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-[rgba(212,175,55,0.16)] bg-[linear-gradient(180deg,#0b0f17_0%,#12161f_100%)] shadow-[0_36px_120px_rgba(0,0,0,0.5)]"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
                  Fixture Planner Full Screen
                </p>
                <h3 className="mt-2 text-2xl font-bold text-white">{eventName}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Use the larger canvas for readability, zoom controls, tooltips, and print preparation.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-full border border-[rgba(212,175,55,0.16)] bg-white/5 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                  {VIEW_MODES.map((mode) => (
                    <button
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        viewMode === mode.key
                          ? 'bg-[#345fd6] text-white shadow-[0_10px_20px_rgba(52,95,214,0.28)]'
                          : 'text-slate-300 hover:bg-[rgba(212,175,55,0.08)] hover:text-[#d4af37]'
                      }`}
                      key={`fullscreen-${mode.key}`}
                      onClick={() => setViewMode(mode.key)}
                      type="button"
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
                <button className="btn-secondary" onClick={() => handlePrint('fullscreen')} type="button">
                  <span className="mr-2 inline-flex align-middle">
                    <AppIcon className="h-4 w-4" name="export" />
                  </span>
                  Print This View
                </button>
                <button className="btn-secondary" onClick={() => setIsFullscreen(false)} type="button">
                  <span className="mr-2 inline-flex align-middle">
                    <AppIcon className="h-4 w-4" name="compress" />
                  </span>
                  Exit Full Screen
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto px-4 py-4 sm:px-6">
              <div className="mb-4 flex flex-wrap gap-3">
                <span className="badge border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.1)] text-[#f4d67a]">
                  {visualization.viewLabel}
                </span>
                <span className="badge border border-white/10 bg-white/5 text-white">
                  {activeViewLabel}
                </span>
                <span className="badge border border-white/10 bg-white/5 text-white">
                  {visualization.summary.totalFixtures} Fixtures
                </span>
                <span className="badge border border-emerald-400/20 bg-emerald-400/10 text-emerald-200">
                  {visualization.summary.completedFixtures} Completed
                </span>
                {visualization.summary.groupCount ? (
                  <span className="badge border border-white/10 bg-white/5 text-white">
                    {visualization.summary.groupCount} Groups
                  </span>
                ) : null}
              </div>

              {renderPlannerView('fullscreen')}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
