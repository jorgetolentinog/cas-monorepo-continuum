import { z } from 'zod'
import { APIGatewayEvent } from 'aws-lambda'
import { SyncException } from '../app/exception/usecase/sync-exception/sync-exception'
import { ValidationError } from '@package/error'
import { parse as parseDate, format as formatDate } from 'date-fns'

export class ExceptionRoute {
  constructor(private syncException: SyncException) {}

  async execute(event: APIGatewayEvent) {
    const body = this.bodyParser(event.body ?? '')

    if (!body.success) {
      throw new ValidationError().withInnerError(body.error)
    }

    const startDate = this.transformDate(body.data.data.desde)
    const endDate = this.transformDate(body.data.data.hasta)
    const recurrence = this.transformRecurrence(body.data.data.recurrencia)

    await this.syncException.execute({
      id: body.data.data.indice,
      startDate,
      endDate,
      isEnabled: body.data.data.vigencia,
      recurrence: recurrence,
      repeatRecurrenceEvery: body.data.data.repetirCada,
      professionalIds: body.data.data.profesionales,
      serviceIds: body.data.data.servicios,
      dayOfMonth: body.data.data.diaMes ?? undefined,
      weekOfMonth: body.data.data.numeroSemana ?? undefined,
      dayOfWeek: body.data.data.diaSemana ?? undefined,
      days: body.data.data.dias.map((dia) => {
        return {
          dayOfWeek: dia.diaSemana != null ? Number(dia.diaSemana) : undefined,
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

  private transformRecurrence(recurrence: string) {
    if (recurrence === 'S') {
      return 'weekly'
    } else if (recurrence === 'M') {
      return 'monthly'
    }

    throw new ValidationError('Recurrence invalid')
  }

  private bodyParser(body: string) {
    const stringify = z
      .string()
      .or(z.number())
      .transform((value) => value.toString())

    const schema = z.object({
      type: z.literal('EXC'),
      data: z.object({
        indice: stringify,
        desde: z.string(),
        hasta: z.string(),
        vigencia: z.boolean(),
        recurrencia: z.string(),
        repetirCada: z.string().transform((value) => parseInt(value)),
        profesionales: z.array(stringify),
        servicios: z.array(stringify),
        diaMes: z.number().nullable(),
        diaSemana: z.number().nullable(),
        numeroSemana: z.number().nullable(),
        dias: z.array(
          z.object({
            diaSemana: z.string().nullable(),
            bloques: z.array(z.array(z.string()))
          })
        )
      })
    })

    return schema.safeParse(JSON.parse(body))
  }
}
