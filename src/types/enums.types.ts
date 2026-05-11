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

export type BudgetStatus = 'ENVIADO' | 'ACEPTADO' | 'ACEPTADO_PARCIALMENTE' | 'RECHAZADO' | 'PENDIENTE_DE_RESPUESTA' | 'SIN_ENVIAR' | 'SIN_HACER'

export type ReasonForConsultation = 'CIRUGIA_ORTOGNATICA_MAXILOFACIAL' | 'IMPLANTOLOGIA' | 'ESTETICA_DENTAL' | 'BLANQUEAMIENTO' | 'PROTESIS' | 'ORTODONCIA' | 'ODONTOPEDIATRIA_ORTOPEDIA_FUNCIONAL' | 'ODONTOLOGIA_GENERAL_RESTAURACION' | 'LIMPIEZA_DENTAL_PROFILAXIS' | 'REGENERACION_RECONSTRUCCION_OSEA' | 'ESTETICA_FACIAL' | 'OTRO';

export type AppointmentStatus = 'SACO_TURNO' | 'TODAVIA_NO' | 'NO_VA_A_SACAR' | 'NO_RESPONDIO' | 'SACO_PERO_CANCELO';