import { products } from './products'
import type { Product } from './products'
import { layerings } from './layerings'

export interface Catalog { products: Product[]; layerings: typeof layerings }
export interface CatalogSource { load(signal: AbortSignal): Promise<Catalog> }
// Replace this adapter with fetch('/api/catalog', { signal }) and validate the response.
// UI, cart and favorites consume the same snapshot and stable product IDs.
export const demoCatalogSource: CatalogSource = {
  async load(signal) {
    signal.throwIfAborted()
    return structuredClone({ products, layerings })
  },
}
