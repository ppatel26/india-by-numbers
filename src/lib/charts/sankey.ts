/**
 * Sankey: flows that reconcile, in two or three columns. On a phone the bands are too thin to
 * read, so the same flows draw as two ranked lists: where the money comes from, where it goes.
 */
import type { Color } from '~/content/types'
import { svg, type Markup } from '~/lib/markup'
import { colorVar, fillVar } from '~/lib/tokens'
import { WIDTH, frame, spread, tipAttr, type Width } from './axes'
import { checkFlows, layoutFlows, nodeName, type Flow } from './flows'
import { show, type Of } from './model'
import { shareText } from './treemap'

type Sankey = Of<'sankey'>

const value = (chart: Sankey, f: { value: number; raw?: string }) => show(chart, { x: '', label: '', t: NaN, y: f.value, raw: f.raw ?? String(f.value), row: {} }).text

/** Flows into each end and out of each start, summed: for labels and the phone lists. */
function totals(flows: readonly Flow[]): { starts: Map<string, number>; ends: Map<string, number> } {
  const starts = new Map<string, number>()
  const ends = new Map<string, number>()
  for (const f of flows) {
    starts.set(f.from, (starts.get(f.from) ?? 0) + f.value)
    ends.set(f.to, (ends.get(f.to) ?? 0) + f.value)
  }
  return { starts, ends }
}

export function renderSankey(chart: Sankey, width: Width): Markup {
  const flows = checkFlows(chart)
  return WIDTH[width] < 600 ? renderLists(chart, flows, width) : renderBands(chart, flows, width)
}

function renderBands(chart: Sankey, flows: Flow[], width: Width): Markup {
  const W = WIDTH[width]
  const plotH = 400
  const top = 24
  const { nodes, links } = layoutFlows(flows, plotH, 10)
  const cols = Math.max(...nodes.map((n) => n.col)) + 1
  const nodeW = 12
  const side = 210
  const colX = (c: number) => side + (c * (W - 2 * side - nodeW)) / Math.max(1, cols - 1)
  const byKey = new Map(nodes.map((n) => [n.key, n]))
  const grand = Math.max(...Array.from({ length: cols }, (_, c) => nodes.filter((n) => n.col === c).reduce((a, n) => a + n.value, 0)))
  const colorOf = (from: string): Color => chart.colors?.[from] ?? 'slate'
  const band = (l: (typeof links)[number]) => {
    const s = byKey.get(l.from)!
    const t = byKey.get(l.to)!
    const xa = colX(s.col) + nodeW
    const xb = colX(t.col)
    const mid = (xa + xb) / 2
    const y0 = top + l.sy
    const y1 = top + l.ty
    const d = `M${xa} ${y0}C${mid} ${y0} ${mid} ${y1} ${xb} ${y1}V${y1 + l.width}C${mid} ${y1 + l.width} ${mid} ${y0 + l.width} ${xa} ${y0 + l.width}Z`
    const tip = () => `${nodeName(chart, l.from)} to ${nodeName(chart, l.to)}\n${value(chart, l)} (${shareText(l.value, grand)} of the total)`
    return svg`<path class="band" d="${d}" fill="${fillVar(colorOf(l.from))}" fill-opacity="0.38"${tipAttr(tip)}/>`
  }
  // Node labels: name and value, outside the first and last columns, above a middle node.
  const labels = (c: number) => {
    const ns = nodes.filter((n) => n.col === c)
    const first = c === 0
    const last = c === cols - 1
    if (!first && !last) {
      return ns.map((n) => {
        const x = colX(c) + nodeW / 2
        return svg`<text x="${x}" y="${top + n.y0 - 22}" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">${nodeName(chart, n.key)}</text>
<text x="${x}" y="${top + n.y0 - 8}" text-anchor="middle" font-size="12" fill="var(--slate)">${value(chart, n)}</text>`
      })
    }
    const placed = spread(
      ns.map((n) => ({ key: n.key, y: top + (n.y0 + n.y1) / 2 - 7 })),
      30,
      top - 6,
      top + plotH - 20,
    )
    return placed.map((p) => {
      const n = byKey.get(p.key)!
      const x = first ? colX(c) - 8 : colX(c) + nodeW + 8
      const anchor = first ? 'end' : 'start'
      const name = nodeName(chart, n.key)
      return svg`<text x="${x}" y="${p.ly + 4}" text-anchor="${anchor}" font-size="12.5" font-weight="600" fill="var(--ink)">${name}</text>
<text x="${x}" y="${p.ly + 18}" text-anchor="${anchor}" font-size="12" fill="var(--slate)">${value(chart, n)} · ${shareText(n.value, grand)}</text>`
    })
  }
  const rects = nodes.map((n) => {
    const tip = () => `${nodeName(chart, n.key)}\n${value(chart, n)} (${shareText(n.value, grand)} of the total)`
    return svg`<rect class="node" x="${colX(n.col)}" y="${top + n.y0}" width="${nodeW}" height="${Math.max(1, n.y1 - n.y0)}" fill="var(--ink)"${tipAttr(tip)}/>`
  })
  const H = top + plotH + 12
  // A middle column needs room above for its two-line label.
  const lift = nodes.some((n) => n.col > 0 && n.col < cols - 1 && n.y0 < 34) ? 34 : 0
  return frame(width, H + lift, chart.title, svg`<g transform="translate(0,${lift})"><g class="bands">${links.map(band)}</g>${rects}${Array.from({ length: cols }, (_, c) => labels(c))}</g>`)
}

/** Phones: each side as a list, a bar for each part's share of the total. */
function renderLists(chart: Sankey, flows: Flow[], width: Width): Markup {
  const W = WIDTH[width]
  const { starts, ends } = totals(flows)
  // A start that is also an end (the pool in the middle) belongs to neither list.
  const ins = [...starts].filter(([k]) => !ends.has(k))
  const outs = [...ends].filter(([k]) => !starts.has(k))
  const pool = [...starts.keys()].find((k) => ends.has(k))
  const total = Math.max(ins.reduce((a, [, v]) => a + v, 0), outs.reduce((a, [, v]) => a + v, 0))
  const rowH = 40
  const out: Markup[] = []
  let y = 0
  const list = (title: string, items: [string, number][], color: (k: string) => Color) => {
    out.push(svg`<text x="0" y="${y + 14}" font-size="13" font-weight="600" fill="var(--ink)">${title}</text>`)
    y += 26
    for (const [k, v] of items) {
      const w = Math.max(1, (v / total) * W)
      const tip = () => `${nodeName(chart, k)}\n${value(chart, { value: v })} (${shareText(v, total)} of the total)`
      out.push(svg`<g class="row"${tipAttr(tip)}><text x="0" y="${y + 12}" font-size="12.5" fill="var(--ink)">${nodeName(chart, k)}</text>
<text x="${W}" y="${y + 12}" text-anchor="end" font-size="12" fill="var(--slate)">${value(chart, { value: v })} · ${shareText(v, total)}</text>
<rect x="0" y="${y + 18}" width="${w}" height="10" fill="${colorVar(color(k))}"/></g>`)
      y += rowH
    }
    y += 10
  }
  const head = pool ? svg`<text x="0" y="14" font-size="13" fill="var(--slate)">${nodeName(chart, pool)}: ${value(chart, { value: total })}</text>` : null
  y = pool ? 28 : 0
  list('Where the money comes from', ins, (k) => chart.colors?.[k] ?? 'slate')
  list('Where it goes', outs, () => 'ink')
  return frame(width, y, chart.title, svg`${head}${out}`)
}
