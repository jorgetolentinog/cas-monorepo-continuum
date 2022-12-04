import { injectable } from "tsyringe";
import { PreBookingRepository } from "./pre-booking-repository";
import { PreBooking } from "../entity/pre-booking";
import { dynamoDbClient } from "@package/dynamodb-client";

@injectable()
export class DynamoDBPreBookingRepository implements PreBookingRepository {
  private readonly _table = process.env.DYNAMODB_TABLE ?? "DynamoDBTable";

  async create(preBooking: PreBooking): Promise<void> {
    await dynamoDbClient
      .put({
        TableName: this._table,
        Item: {
          id: preBooking.id,
          date: preBooking.date,
          companyId: preBooking.companyId,
          officeId: preBooking.officeId,
          serviceId: preBooking.serviceId,
          professionalId: preBooking.professionalId,
          calendarId: preBooking.calendarId,
          blockDurationInMinutes: preBooking.blockDurationInMinutes,
          isEnabled: preBooking.isEnabled,
          createdAt: preBooking.createdAt,
          updatedAt: preBooking.updatedAt,
          // Interno
          _pk: `preBooking#${preBooking.id}`,
          _sk: `preBooking#${preBooking.id}`,
        },
        ExpressionAttributeNames: {
          "#_pk": "_pk",
          "#_sk": "_sk",
        },
        ConditionExpression:
          "attribute_not_exists(#_pk) and attribute_not_exists(#_sk)",
      })
      .promise();
  }

  async update(preBooking: PreBooking): Promise<void> {
    const attrs = {
      date: preBooking.date,
      companyId: preBooking.companyId,
      officeId: preBooking.officeId,
      serviceId: preBooking.serviceId,
      professionalId: preBooking.professionalId,
      calendarId: preBooking.calendarId,
      blockDurationInMinutes: preBooking.blockDurationInMinutes,
      isEnabled: preBooking.isEnabled,
      createdAt: preBooking.createdAt,
      updatedAt: preBooking.updatedAt,
    };

    let updateExpression = "set ";
    const expressionAttributeNames: Record<string, string> = {
      "#_pk": "_pk",
      "#_sk": "_sk",
    };
    const expressionAttributeValues: Record<string, unknown> = {};

    for (const prop in attrs) {
      const value = (attrs as Record<string, unknown>)[prop] ?? null;
      updateExpression += `#${prop} = :${prop},`;
      expressionAttributeNames[`#${prop}`] = prop;
      expressionAttributeValues[`:${prop}`] = value;
    }
    updateExpression = updateExpression.slice(0, -1);

    await dynamoDbClient
      .update({
        TableName: this._table,
        Key: {
          _pk: `preBooking#${preBooking.id}`,
          _sk: `preBooking#${preBooking.id}`,
        },
        UpdateExpression: updateExpression,
        ConditionExpression:
          "attribute_exists(#_pk) and attribute_exists(#_sk)",
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      })
      .promise();
  }

  async findById(preBookingId: string): Promise<PreBooking | null> {
    const result = await dynamoDbClient
      .query({
        TableName: this._table,
        KeyConditionExpression: "#_pk = :_pk and #_sk = :_sk",
        ExpressionAttributeNames: { "#_pk": "_pk", "#_sk": "_sk" },
        ExpressionAttributeValues: {
          ":_pk": `preBooking#${preBookingId}`,
          ":_sk": `preBooking#${preBookingId}`,
        },
      })
      .promise();

    const item = result.Items?.[0];
    if (item == null) {
      return null;
    }

    return {
      id: item.id,
      date: item.date,
      companyId: item.companyId,
      officeId: item.officeId,
      serviceId: item.serviceId,
      professionalId: item.professionalId,
      calendarId: item.calendarId,
      blockDurationInMinutes: item.blockDurationInMinutes,
      isEnabled: item.isEnabled,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
}
