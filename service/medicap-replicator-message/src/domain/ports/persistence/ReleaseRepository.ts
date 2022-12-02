import { Release } from '../../entity/Release'

export interface ReleaseRepository {
  create: (release: Release) => Promise<void>
  update: (release: Release) => Promise<void>
  findById: (releaseId: string) => Promise<Release | null>
}
