import { injectable } from 'tsyringe'
import { ExceptionRepository } from '@/domain/ports/persistence/ExceptionRepository'
import { Exception } from '@/domain/entity/Exception'
import { DynamoDBClient } from '@/infrastructure/adapter/shared/dynamodb/DynamoDBClient'

@injectable()
export class DynamoDBExceptionRepository implements ExceptionRepository {
  private readonly _table = process.env.DYNAMODB_TABLE ?? 'DynamoDBTable'

  constructor(private readonly dynamodb: DynamoDBClient) {}

  async create(exception: Exception): Promise<void> {
    await this.dynamodb.client
      .put({
        TableName: this._table,
        Item: {
          id: exception.id,
          startDate: exception.startDate,
          endDate: exception.endDate,
          isEnabled: exception.isEnabled,
          recurrence: exception.recurrence,
          repeatRecurrenceEvery: exception.repeatRecurrenceEvery,
          professionalIds: exception.professionalIds,
          serviceIds: exception.serviceIds,
          dayOfMonth: exception.dayOfMonth,
          weekOfMonth: exception.weekOfMonth,
          dayOfWeek: exception.dayOfWeek,
          days: exception.days,
          createdAt: exception.createdAt,
          updatedAt: exception.updatedAt,
          // Interno
          _pk: `exception#${exception.id}`,
          _sk: `exception#${exception.id}`
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

  async update(exception: Exception): Promise<void> {
    const attrs = {
      startDate: exception.startDate,
      endDate: exception.endDate,
      isEnabled: exception.isEnabled,
      recurrence: exception.recurrence,
      repeatRecurrenceEvery: exception.repeatRecurrenceEvery,
      professionalIds: exception.professionalIds,
      serviceIds: exception.serviceIds,
      dayOfMonth: exception.dayOfMonth,
      weekOfMonth: exception.weekOfMonth,
      dayOfWeek: exception.dayOfWeek,
      days: exception.days,
      createdAt: exception.createdAt,
      updatedAt: exception.updatedAt
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

    await this.dynamodb.client
      .update({
        TableName: this._table,
        Key: {
          _pk: `exception#${exception.id}`,
          _sk: `exception#${exception.id}`
        },
        UpdateExpression: updateExpression,
        ConditionExpression:
          'attribute_exists(#_pk) and attribute_exists(#_sk)',
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues
      })
      .promise()
  }

  async findById(exceptionId: string): Promise<Exception | null> {
    const result = await this.dynamodb.client
      .query({
        TableName: this._table,
        KeyConditionExpression: '#_pk = :_pk and #_sk = :_sk',
        ExpressionAttributeNames: { '#_pk': '_pk', '#_sk': '_sk' },
        ExpressionAttributeValues: {
          ':_pk': `exception#${exceptionId}`,
          ':_sk': `exception#${exceptionId}`
        }
      })
      .promise()

    const item = result.Items?.[0]
    if (item == null) {
      return null
    }

    return {
      id: item.id,
      startDate: item.startDate,
      endDate: item.endDate,
      isEnabled: item.isEnabled,
      recurrence: item.recurrence,
      repeatRecurrenceEvery: item.repeatRecurrenceEvery,
      professionalIds: item.professionalIds,
      serviceIds: item.serviceIds,
      dayOfMonth: item.dayOfMonth,
      weekOfMonth: item.weekOfMonth,
      dayOfWeek: item.dayOfWeek,
      days: item.days,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }
  }
}
