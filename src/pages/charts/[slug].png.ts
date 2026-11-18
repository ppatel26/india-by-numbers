import { chartSvg, toPng } from '~/lib/render'
import { chartFiles } from '~/lib/routes'

export const { getStaticPaths, GET } = chartFiles((p) => ({ body: new Uint8Array(toPng(chartSvg(p.chart), 1984)), type: 'image/png' }), { images: true })
