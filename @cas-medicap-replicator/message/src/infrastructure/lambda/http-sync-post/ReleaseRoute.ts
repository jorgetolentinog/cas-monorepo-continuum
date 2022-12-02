import { z } from 'zod'
import { APIGatewayEvent } from 'aws-lambda'
import { SyncRelease } from '@/application/SyncRelease'
import { ValidationError } from '@/domain/error/ValidationError'
import { injectable } from 'tsyringe'
import { parse as parseDate, format as formatDate } from 'date-fns'

@injectable()
export class ReleaseRoute {
  constructor(private syncRelease: SyncRelease) {}

  async execute(event: APIGatewayEvent) {
    const body = this.bodyParser(event.body ?? '')

    if (!body.success) {
      throw new ValidationError().withInnerError(body.error)
    }

    const releaseDate = this.transformDateTime(
      body.data.data.fecha,
      body.data.data.hora
    )

    await this.syncRelease.execute({
      id: body.data.data.indice,
      date: releaseDate,
      blockDurationInMinutes: body.data.data.duracionBloque,
      professionalId: body.data.data.profesional,
      companyId: body.data.data.codigoEmpresa,
      officeId: body.data.data.codigoSucursal,
      serviceId: body.data.data.codigoServicio,
      calendarId: body.data.data.indiceCalendario,
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
      type: z.literal('LBR'),
      data: z.object({
        indice: stringify,
        fecha: z.string(),
        hora: z.string(),
        duracionBloque: z.number(),
        profesional: stringify,
        codigoEmpresa: stringify,
        codigoServicio: stringify,
        codigoSucursal: stringify,
        indiceCalendario: stringify,
        vigencia: z.boolean()
      })
    })

    return schema.safeParse(JSON.parse(body))
  }
}
