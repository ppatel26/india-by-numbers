/** One entry point for every chart view. */
import type { Chart } from '~/content/types'
import type { Markup } from '~/lib/markup'
import { renderArea } from './area'
import type { Width } from './axes'
import { renderBars } from './bars'
import { renderColumns } from './columns'
import { renderDots } from './dots'
import { renderLine } from './line'
import { renderPanels } from './panels'
import { renderPyramid } from './pyramid'
import { renderRanked, renderTiles } from './states'
import { asStates } from './model'

export type View = 'chart' | 'map' | 'table'

/** Views in tab order. Every chart has a table; by-state charts add a map. */
export function viewsOf(chart: Chart): View[] {
  if (chart.kind === 'table') return ['table']
  return chart.kind === 'states' || (chart.kind === 'dots' && chart.map) ? ['chart', 'table', 'map'] : ['chart', 'table']
}

export function openView(chart: Chart): View {
  return chart.kind === 'states' && chart.open === 'map' ? 'map' : viewsOf(chart)[0]!
}

/** The SVG for a chart or map view. The table view is HTML (see ChartTable.astro). */
export function renderPlot(chart: Chart, view: 'chart' | 'map', width: Width): Markup {
  switch (chart.kind) {
    case 'line':
      return renderLine(chart, width)
    case 'columns':
      return chart.panels ? renderPanels(chart, width, renderColumns) : renderColumns(chart, width)
    case 'area':
      return renderArea(chart, width)
    case 'states':
      return view === 'map' ? renderTiles(chart, width) : renderRanked(chart, width)
    case 'dots':
      return view === 'map' ? renderTiles(asStates(chart), width) : renderDots(chart, width)
    case 'bars':
      return chart.panels ? renderPanels(chart, width, renderBars) : renderBars(chart, width)
    case 'pyramid':
      return renderPyramid(chart, width)
    case 'table':
      throw new Error(`${chart.slug}: a table chart has no plot`)
  }
}
