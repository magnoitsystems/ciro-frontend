export type CurrencyType = 'PESOS' | 'DOLARES' | 'REALES' | 'EUROS';

export type PaymentMethod = 'EFECTIVO' | 'TRANSFERENCIA' | 'TARJETA_CREDITO' | 'TARJETA_DEBITO' | 'MERCADO_PAGO' | 'DOLARES' | 'CHEQUE';

export type CurrentAccountType = 'VOUCHER' | 'RECEIPT';

export type BillStatus = 'PENDIENTE' | 'PAGADO';

export type BillType = 'SERVICIO' | 'SUELDO';

export type OriginType = 'CAJA' | 'DOCTOR';

export type CashMovementType = 'INGRESO' | 'EGRESO';

export type DocumentType = 'DNI' | 'CUIT' | 'CUIL' | 'CDI' | 'LE' | 'LC' | 'PASAPORTE' | 'OTRO';

export type HealthInsurance = 'PARTICULAR' | 'OSDE' | 'SWISS_MEDICAL' | 'GALENO' | 'SANCOR_SALUD' | 'IOMA' | 'PAMI' | 'OMINT' | 'OTRA';

export type PatientFrom = 'RECOMMENDATION' | 'FACEBOOK' | 'INSTAGRAM' | 'TIKTOK' | 'WEBSITE' | 'ANOTHER';

export type ReportPeriod = 'DAY' | 'WEEK' | 'MONTH';

export type ShiftStatus = 'REQUIRED' | 'ASSIGNED';

export type TaskPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';