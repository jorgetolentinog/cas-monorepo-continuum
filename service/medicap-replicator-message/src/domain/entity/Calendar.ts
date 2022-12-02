export interface Calendar {
  id: string
  startDate: string
  endDate: string
  isEnabled: boolean
  companyId: string
  officeId: string
  serviceId: string
  medicalAreaIds: string[]
  interestAreaIds: string[]
  professionalId: string
  blockDurationInMinutes: number
  conditionOfService: {
    minAge?: {
      year: number
      month: number
    }
    maxAge?: {
      year: number
      month: number
    }
    gender?: 'F' | 'M'
  }
  days: Array<{
    dayOfWeek: number
    blocks: Array<{
      startTime: string
      endTime: string
    }>
  }>
  createdAt: string
  updatedAt: string
}
