/**
 * Generated by orval v6.31.0 🍺
 * Do not edit manually.
 * pkh-api
 * pkh api
 * OpenAPI spec version: 0.0.1
 */
import type { KhovtTransPhieuNhapFilter1Fields } from './khovtTransPhieuNhapFilter1Fields';
import type { KhovtTransPhieuNhapFilter1Order } from './khovtTransPhieuNhapFilter1Order';
import type { KhovtTransPhieuNhapFilter1Where } from './khovtTransPhieuNhapFilter1Where';

export interface KhovtTransPhieuNhapFilter1 {
  fields?: KhovtTransPhieuNhapFilter1Fields;
  /** @minimum 1 */
  limit?: number;
  /** @minimum 0 */
  offset?: number;
  order?: KhovtTransPhieuNhapFilter1Order;
  /** @minimum 0 */
  skip?: number;
  where?: KhovtTransPhieuNhapFilter1Where;
}
