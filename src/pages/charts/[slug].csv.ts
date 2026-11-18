import { tableCsv } from '~/lib/charts/table'
import { chartFiles } from '~/lib/routes'

export const { getStaticPaths, GET } = chartFiles((p) => ({ body: tableCsv(p.chart), type: 'text/csv; charset=utf-8' }))
