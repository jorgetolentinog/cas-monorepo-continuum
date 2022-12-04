import { ReleaseRepository } from './release-repository'
import { Release } from '../entity/release'
import { dynamoDbClient } from '@package/dynamodb-client'

export class DynamoDBReleaseRepository implements ReleaseRepository {
  private readonly _table = process.env.DYNAMODB_TABLE ?? 'DynamoDBTable'

  async create(release: Release): Promise<void> {
    await dynamoDbClient
      .put({
        TableName: this._table,
        Item: {
          id: release.id,
          date: release.date,
          blockDurationInMinutes: release.blockDurationInMinutes,
          professionalId: release.professionalId,
          companyId: release.companyId,
          officeId: release.officeId,
          serviceId: release.serviceId,
          calendarId: release.calendarId,
          isEnabled: release.isEnabled,
          createdAt: release.createdAt,
          updatedAt: release.updatedAt,
          // Interno
          _pk: `release#${release.id}`,
          _sk: `release#${release.id}`
        },
        ExpressionAttributeNames: {
          '#_pk': '_pk',
          '#_sk': '_sk'
        },
        ConditionExpression:
          'attribute_not_exists(#_pk) and attribute_not_exists(#_sk)'
      })
      .promise()
  }

  async update(release: Release): Promise<void> {
    const attrs = {
      date: release.date,
      blockDurationInMinutes: release.blockDurationInMinutes,
      professionalId: release.professionalId,
      companyId: release.companyId,
      officeId: release.officeId,
      serviceId: release.serviceId,
      calendarId: release.calendarId,
      isEnabled: release.isEnabled,
      createdAt: release.createdAt,
      updatedAt: release.updatedAt
    }

    let updateExpression = 'set '
    const expressionAttributeNames: Record<string, string> = {
      '#_pk': '_pk',
      '#_sk': '_sk'
    }
    const expressionAttributeValues: Record<string, unknown> = {}

    for (const prop in attrs) {
      const value = (attrs as Record<string, unknown>)[prop] ?? null
      updateExpression += `#${prop} = :${prop},`
      expressionAttributeNames[`#${prop}`] = prop
      expressionAttributeValues[`:${prop}`] = value
    }
    updateExpression = updateExpression.slice(0, -1)

    await dynamoDbClient
      .update({
        TableName: this._table,
        Key: {
          _pk: `release#${release.id}`,
          _sk: `release#${release.id}`
        },
        UpdateExpression: updateExpression,
        ConditionExpression:
          'attribute_exists(#_pk) and attribute_exists(#_sk)',
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues
      })
      .promise()
  }

  async findById(releaseId: string): Promise<Release | null> {
    const result = await dynamoDbClient
      .query({
        TableName: this._table,
        KeyConditionExpression: '#_pk = :_pk and #_sk = :_sk',
        ExpressionAttributeNames: { '#_pk': '_pk', '#_sk': '_sk' },
        ExpressionAttributeValues: {
          ':_pk': `release#${releaseId}`,
          ':_sk': `release#${releaseId}`
        }
      })
      .promise()

    const item = result.Items?.[0]
    if (item == null) {
      return null
    }

    return {
      id: item.id,
      date: item.date,
      blockDurationInMinutes: item.blockDurationInMinutes,
      professionalId: item.professionalId,
      companyId: item.companyId,
      officeId: item.officeId,
      serviceId: item.serviceId,
      calendarId: item.calendarId,
      isEnabled: item.isEnabled,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }
  }
}
