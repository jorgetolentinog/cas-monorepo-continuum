import { Release } from '../entity/release'

export interface ReleaseRepository {
  create: (release: Release) => Promise<void>
  update: (release: Release) => Promise<void>
  findById: (releaseId: string) => Promise<Release | null>
}
