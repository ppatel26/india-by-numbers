import { chartSvg } from '~/lib/render'
import { chartFiles } from '~/lib/routes'

export const { getStaticPaths, GET } = chartFiles((p) => ({ body: chartSvg(p.chart), type: 'image/svg+xml' }), { images: true })
