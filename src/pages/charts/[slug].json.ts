import { metadataOf } from '~/lib/metadata'
import { chartFiles } from '~/lib/routes'

export const { getStaticPaths, GET } = chartFiles((p) => ({ body: JSON.stringify(metadataOf(p), null, 2), type: 'application/json' }))
