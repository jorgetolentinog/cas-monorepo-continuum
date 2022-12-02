import { z } from 'zod'
import { APIGatewayEvent } from 'aws-lambda'
import { SyncBooking } from '@/application/SyncBooking'
import { ValidationError } from '@package/error'
import { injectable } from 'tsyringe'
import { parse as parseDate, format as formatDate } from 'date-fns'

@injectable()
export class BookingRoute {
  constructor(private syncBooking: SyncBooking) {}

  async execute(event: APIGatewayEvent) {
    const body = this.bodyParser(event.body ?? '')

    if (!body.success) {
      throw new ValidationError().withInnerError(body.error)
    }

    const bookingDate = this.transformDateTime(
      body.data.data.fecha,
      body.data.data.hora
    )

    await this.syncBooking.execute({
      id: body.data.data.indice,
      companyId: body.data.data.codigoEmpresa,
      officeId: body.data.data.codigoSucursal,
      serviceId: body.data.data.codigoServicio,
      professionalId: body.data.data.ppnProfesional,
      calendarId: body.data.data.indiceCalendario,
      patientId: body.data.data.ppnPaciente,
      date: bookingDate,
      blockDurationInMinutes: body.data.data.duracionBloques,
      isEnabled: body.data.data.vigencia
    })
  }

  private transformDateTime(
    originalDate: string,
    originalTime: string
  ): string {
    try {
      return formatDate(
        parseDate(
          originalDate + ' ' + originalTime.padStart(5, '0'),
          'dd/MM/yyyy HH:mm',
          new Date()
        ),
        "yyyy-MM-dd'T'HH:mm:ss"
      )
    } catch (error) {
      throw new ValidationError().withInnerError(error)
    }
  }

  private bodyParser(body: string) {
    const stringify = z
      .string()
      .or(z.number())
      .transform((value) => value.toString())

    const schema = z.object({
      type: z.literal('RSV'),
      data: z.object({
        indice: stringify,
        fecha: z.string(),
        hora: z.string(),
        codigoEmpresa: stringify,
        codigoSucursal: stringify,
        codigoServicio: stringify,
        ppnProfesional: stringify,
        indiceCalendario: stringify,
        ppnPaciente: stringify,
        duracionBloques: z.number(),
        vigencia: z.boolean()
      })
    })

    return schema.safeParse(JSON.parse(body))
  }
}
