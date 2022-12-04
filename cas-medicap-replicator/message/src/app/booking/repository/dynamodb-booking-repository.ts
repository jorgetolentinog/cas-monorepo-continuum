import { BookingRepository } from './booking-repository'
import { Booking } from '../entity/booking'
import { dynamoDbClient } from '@package/dynamodb-client'

export class DynamoDBBookingRepository implements BookingRepository {
  private readonly _table = process.env.DYNAMODB_TABLE ?? 'DynamoDBTable'

  async create(booking: Booking): Promise<void> {
    await dynamoDbClient
      .put({
        TableName: this._table,
        Item: {
          id: booking.id,
          date: booking.date,
          companyId: booking.companyId,
          officeId: booking.officeId,
          serviceId: booking.serviceId,
          professionalId: booking.professionalId,
          patientId: booking.patientId,
          calendarId: booking.calendarId,
          blockDurationInMinutes: booking.blockDurationInMinutes,
          isEnabled: booking.isEnabled,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt,
          // Interno
          _pk: `booking#${booking.id}`,
          _sk: `booking#${booking.id}`
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

  async update(booking: Booking): Promise<void> {
    const attrs = {
      date: booking.date,
      companyId: booking.companyId,
      officeId: booking.officeId,
      serviceId: booking.serviceId,
      professionalId: booking.professionalId,
      patientId: booking.patientId,
      calendarId: booking.calendarId,
      blockDurationInMinutes: booking.blockDurationInMinutes,
      isEnabled: booking.isEnabled,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt
    }

    let updateExpression = 'set '
    const expressionAttributeNames: Record<string, string> = {
      '#_pk': '_pk',
      '#_sk': '_sk'
    }
    const expressionAttributeValues: Record<string, unknown> = {}
    for (const prop in attrs) {
      const value = (attrs as Record<string, unknown>)[prop] ?? null
      updateExpression += ` #${prop} = :${prop},`
      expressionAttributeNames[`#${prop}`] = prop
      expressionAttributeValues[`:${prop}`] = value
    }
    updateExpression = updateExpression.slice(0, -1)

    await dynamoDbClient
      .update({
        TableName: this._table,
        Key: {
          _pk: `booking#${booking.id}`,
          _sk: `booking#${booking.id}`
        },
        UpdateExpression: updateExpression,
        ConditionExpression:
          'attribute_exists(#_pk) and attribute_exists(#_sk)',
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues
      })
      .promise()
  }

  async findById(bookingId: string): Promise<Booking | null> {
    const result = await dynamoDbClient
      .query({
        TableName: this._table,
        KeyConditionExpression: '#_pk = :_pk and #_sk = :_sk',
        ExpressionAttributeNames: { '#_pk': '_pk', '#_sk': '_sk' },
        ExpressionAttributeValues: {
          ':_pk': `booking#${bookingId}`,
          ':_sk': `booking#${bookingId}`
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
      companyId: item.companyId,
      officeId: item.officeId,
      serviceId: item.serviceId,
      professionalId: item.professionalId,
      patientId: item.patientId,
      calendarId: item.calendarId,
      isEnabled: item.isEnabled,
      blockDurationInMinutes: item.blockDurationInMinutes,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }
  }
}
