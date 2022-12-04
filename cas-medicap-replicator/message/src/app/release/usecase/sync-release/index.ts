import { metrics } from '@package/metrics'
import { eventbus } from '@package/eventbus'
import { SyncRelease } from './sync-release'
import { releaseRepository } from '../../repository'

export const syncRelease = new SyncRelease(releaseRepository, eventbus, metrics)
