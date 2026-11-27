/**
 * Sankey flows: read them, check that they reconcile, and lay them out in columns.
 * Pure functions on plain data, so tests/unit can check the maths without a chart.
 */
import type { Chart } from '~/content/types'
import { select, toNumber, type Point, type Row } from '~/lib/data'
import type { SeriesData } from './model'

type Sankey = Extract<Chart, { kind: 'sankey' }>

export interface Flow {
  from: string
  to: string
  value: number
  /** The value as published (or as derived in the CSV). */
  raw: string
  row: Row
}

/** Every flow of a Sankey chart, in CSV order. Fails on an empty or negative flow. */
export function flowsOf(chart: Sankey): Flow[] {
  const yCol = chart.data.y ?? 'value'
  return select(chart.data).map((row) => {
    const from = row[chart.from]
    const to = row[chart.to]
    if (from === undefined || to === undefined) throw new Error(`${chart.slug}: no column "${chart.from}" or "${chart.to}"`)
    const value = toNumber(row[yCol])
    if (value === null || value < 0) throw new Error(`${chart.slug}: flow ${from} to ${to} needs a value of 0 or more`)
    return { from, to, value, raw: row[yCol]!.trim(), row }
  })
}

export const nodeName = (chart: Sankey, key: string): string => chart.labels?.[key] ?? key

/** The flows as one series of points, "From to To", for tests, figures and the CSV. */
export function flowSeries(chart: Sankey): SeriesData {
  const pts: Point[] = flowsOf(chart).map((f) => {
    const x = `${nodeName(chart, f.from)} to ${nodeName(chart, f.to)}`
    return { x, label: x, t: NaN, y: f.value, raw: f.raw, row: f.row }
  })
  return { key: 'flows', label: chart.punches.unit, color: 'slate', points: pts }
}

export interface Imbalance {
  node: string
  in: number
  out: number
}

/** Nodes whose flows in and out differ by more than the tolerance. An empty list means the flows reconcile. */
export function imbalances(flows: readonly Pick<Flow, 'from' | 'to' | 'value'>[], tolerance = 0): Imbalance[] {
  const ins = new Map<string, number>()
  const outs = new Map<string, number>()
  for (const f of flows) {
    outs.set(f.from, (outs.get(f.from) ?? 0) + f.value)
    ins.set(f.to, (ins.get(f.to) ?? 0) + f.value)
  }
  return [...ins.keys()]
    .filter((k) => outs.has(k))
    .map((node) => ({ node, in: ins.get(node)!, out: outs.get(node)! }))
    .filter((b) => Math.abs(b.in - b.out) > tolerance + 1e-9)
}

/** Stop the build when a chart's flows do not reconcile, or loop back. */
export function checkFlows(chart: Sankey): Flow[] {
  const flows = flowsOf(chart)
  if (!flows.length) throw new Error(`${chart.slug}: no flows`)
  const bad = imbalances(flows, chart.tolerance ?? 0)
  if (bad.length) throw new Error(`${chart.slug}: flows do not reconcile at ${bad.map((b) => `${b.node} (in ${b.in}, out ${b.out})`).join('; ')}`)
  // The council's limits (docs/design-direction.md): two or three columns, at most 12 nodes in each.
  const cols = Map.groupBy(depths(flows), ([, d]) => d)
  if (cols.size > 3 || [...cols.values()].some((ns) => ns.length > 12)) throw new Error(`${chart.slug}: a Sankey has at most three columns of at most 12 nodes`)
  return flows
}

/**
 * Each node's column: sources at 0, every other node one past its furthest source. Nodes with no
 * flow out move to the last column, so every end sits at the right. Fails on a loop.
 */
export function depths(flows: readonly Pick<Flow, 'from' | 'to'>[]): Map<string, number> {
  const nodes = [...new Set(flows.flatMap((f) => [f.from, f.to]))]
  const depth = new Map<string, number>()
  const visit = (n: string, seen: Set<string>): number => {
    if (depth.has(n)) return depth.get(n)!
    if (seen.has(n)) throw new Error(`flows loop back through ${n}`)
    seen.add(n)
    const parents = flows.filter((f) => f.to === n).map((f) => f.from)
    const d = parents.length ? Math.max(...parents.map((p) => visit(p, seen))) + 1 : 0
    seen.delete(n)
    depth.set(n, d)
    return d
  }
  nodes.forEach((n) => visit(n, new Set()))
  const last = Math.max(...depth.values())
  for (const n of nodes) if (!flows.some((f) => f.from === n)) depth.set(n, last)
  return depth
}

export interface LaidNode {
  key: string
  col: number
  value: number
  y0: number
  y1: number
}

export interface LaidLink {
  from: string
  to: string
  value: number
  /** Top of the band where it leaves its start node, and where it reaches its end node. */
  sy: number
  ty: number
  width: number
}

/**
 * Stack each column's nodes from the top, in the order the flows name them, one scale for all
 * columns. Each band leaves its start node in the order of its end nodes, and reaches its end
 * node in the order of its start nodes, so no two bands cross inside a node.
 */
export function layoutFlows(flows: readonly Pick<Flow, 'from' | 'to' | 'value'>[], height: number, gap: number): { nodes: LaidNode[]; links: LaidLink[] } {
  const depth = depths(flows)
  const order = [...new Set(flows.flatMap((f) => [f.from, f.to]))]
  const sum = (xs: readonly { value: number }[]) => xs.reduce((a, f) => a + f.value, 0)
  const value = (n: string) => Math.max(sum(flows.filter((f) => f.from === n)), sum(flows.filter((f) => f.to === n)))
  const cols = Math.max(...depth.values()) + 1
  const inCol = (c: number) => order.filter((n) => depth.get(n) === c)
  // One scale: the fullest column, less its gaps, fills the height.
  const k = Math.min(...Array.from({ length: cols }, (_, c) => (height - (inCol(c).length - 1) * gap) / Math.max(1e-9, sum(inCol(c).map((n) => ({ value: value(n) }))))))
  const nodes: LaidNode[] = []
  for (let c = 0; c < cols; c++) {
    const ns = inCol(c)
    const used = sum(ns.map((n) => ({ value: value(n) }))) * k + (ns.length - 1) * gap
    // A column shorter than the tallest sits in the middle.
    let y = (height - used) / 2
    for (const n of ns) {
      const h = value(n) * k
      nodes.push({ key: n, col: c, value: value(n), y0: y, y1: y + h })
      y += h + gap
    }
  }
  const at = new Map(nodes.map((n) => [n.key, n]))
  const outY = new Map(nodes.map((n) => [n.key, n.y0]))
  const inY = new Map(nodes.map((n) => [n.key, n.y0]))
  const byTarget = [...flows].sort((a, b) => at.get(a.to)!.y0 - at.get(b.to)!.y0)
  const sy = new Map<Pick<Flow, 'from' | 'to' | 'value'>, number>()
  for (const f of byTarget) {
    sy.set(f, outY.get(f.from)!)
    outY.set(f.from, outY.get(f.from)! + f.value * k)
  }
  const bySource = [...flows].sort((a, b) => at.get(a.from)!.y0 - at.get(b.from)!.y0)
  const links: LaidLink[] = bySource.map((f) => {
    const ty = inY.get(f.to)!
    inY.set(f.to, ty + f.value * k)
    return { from: f.from, to: f.to, value: f.value, sy: sy.get(f)!, ty, width: f.value * k }
  })
  return { nodes, links }
}
