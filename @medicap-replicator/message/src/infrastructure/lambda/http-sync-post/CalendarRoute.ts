import { z } from 'zod'
import { APIGatewayEvent } from 'aws-lambda'
import { SyncCalendar } from '@/application/SyncCalendar'
import { ValidationError } from '@/domain/error/ValidationError'
import { injectable } from 'tsyringe'
import { parse as parseDate, format as formatDate } from 'date-fns'

@injectable()
export class CalendarRoute {
  constructor(private syncCalendar: SyncCalendar) {}

  async execute(event: APIGatewayEvent) {
    const body = this.bodyParser(event.body ?? '')

    if (!body.success) {
      throw new ValidationError().withInnerError(body.error)
    }

    const startDate = this.transformDate(body.data.data.desde)
    const endDate = this.transformDate(body.data.data.hasta)
    const minAge = this.transformConditionalAge(
      body.data.data.condicionesAtencionServicio.edadMinimaAtencion
    )
    const maxAge = this.transformConditionalAge(
      body.data.data.condicionesAtencionServicio.edadMaximaAtencion
    )
    const gender = this.transformGender(
      body.data.data.condicionesAtencionServicio.generoAtencion
    )

    await this.syncCalendar.execute({
      id: body.data.data.indice,
      startDate,
      endDate,
      isEnabled: body.data.data.vigencia,
      companyId: body.data.data.codigoEmpresa,
      officeId: body.data.data.codigoSucursal,
      serviceId: body.data.data.codigoServicio,
      medicalAreaIds: body.data.data.codigosAreasMedicas,
      interestAreaIds: body.data.data.codigosAreasDeInteres,
      professionalId: body.data.data.ppnProfesional,
      blockDurationInMinutes: body.data.data.duracionBloques,
      conditionOfService: {
        minAge,
        maxAge,
        gender
      },
      days: body.data.data.dias.map((dia) => {
        return {
          dayOfWeek: Number(dia.diaSemana),
          blocks: dia.bloques.map((bloque) => {
            return {
              startTime: bloque[0].padStart(5, '0') + ':00',
              endTime: bloque[1].padStart(5, '0') + ':00'
            }
          })
        }
      })
    })
  }

  private transformDate(originalDate: string) {
    try {
      return formatDate(
        parseDate(originalDate, 'dd/MM/yyyy', new Date()),
        'yyyy-MM-dd'
      )
    } catch (error) {
      throw new ValidationError().withInnerError(error)
    }
  }

  private transformGender(gender: string) {
    if (gender !== 'F' && gender !== 'M') {
      return undefined
    }
    return gender
  }

  private transformConditionalAge(
    age: string
  ): { year: number; month: number } | undefined {
    if (age === '-1') {
      return undefined
    }

    const [year, month] = age.split(',')
    return {
      year: Number(year),
      month: Number(month)
    }
  }

  private bodyParser(body: string) {
    const stringify = z
      .string()
      .or(z.number())
      .transform((value) => value.toString())

    const schema = z.object({
      type: z.literal('CLD'),
      data: z.object({
        indice: stringify,
        desde: z.string(),
        hasta: z.string(),
        codigoEmpresa: stringify,
        codigoSucursal: stringify,
        codigoServicio: stringify,
        ppnProfesional: stringify,
        vigencia: z.boolean(),
        codigosAreasMedicas: z.array(z.string()),
        codigosAreasDeInteres: z.array(z.string()),
        duracionBloques: z.number(),
        condicionesAtencionServicio: z.object({
          edadMaximaAtencion: stringify,
          edadMinimaAtencion: stringify,
          generoAtencion: z.string()
        }),
        dias: z.array(
          z.object({
            diaSemana: z.string(),
            bloques: z.array(z.array(z.string()))
          })
        )
      })
    })

    return schema.safeParse(JSON.parse(body))
  }
}
