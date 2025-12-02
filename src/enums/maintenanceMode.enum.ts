
export enum MaintenanceMode {
  Off = 0,
  Full,
  Partial,
  Scheduled,
}

export type MaintenanceStatus = {
  mode: MaintenanceMode,
  scheduledDate?: Date
}