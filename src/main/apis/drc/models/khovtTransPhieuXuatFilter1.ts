/**
 * Generated by orval v6.31.0 🍺
 * Do not edit manually.
 * pkh-api
 * pkh api
 * OpenAPI spec version: 0.0.1
 */
import type { KhovtTransPhieuXuatFilter1Fields } from './khovtTransPhieuXuatFilter1Fields';
import type { KhovtTransPhieuXuatFilter1Order } from './khovtTransPhieuXuatFilter1Order';
import type { KhovtTransPhieuXuatFilter1Where } from './khovtTransPhieuXuatFilter1Where';

export interface KhovtTransPhieuXuatFilter1 {
  fields?: KhovtTransPhieuXuatFilter1Fields;
  /** @minimum 1 */
  limit?: number;
  /** @minimum 0 */
  offset?: number;
  order?: KhovtTransPhieuXuatFilter1Order;
  /** @minimum 0 */
  skip?: number;
  where?: KhovtTransPhieuXuatFilter1Where;
}
