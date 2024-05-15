// IMPORT LIBRARIES
import * as z from 'zod'


// TYPES FOR JOBS
export type JobDescription = {
	id: string
	createdAt: Date
	updatedAt: Date
	organizationId: string
	organizationName: string
	clerkId: string
	createdBy: string
	updatedBy: string
	job: string
	plan: string
	lot: string
	client: string
	phone: string
	email: string
	company: string
	address: string
	latitude: number
	longitude: number
	status: string //enum
	type: string //enum
}
export enum JobStatus {
	New = "new",
	Active = "active",
	Finished = "finished",
	Cancelled = "cancelled"
}
export enum JobType {
	TopoLegal = "topo and legal",
	Certificate = "certificate",
	Layout = "layout",
	Posting = "posting",
	PlStk = "property line staking",
	Monitoring = "monitoring",
	FullPackage = "full package"
}
export const createAndEditJobSchema = z.object({
	job: z.string()
		.min(3, { message: "Job number must be at least 3 characters long" })
		.max(15, { message: "Job number can't be longer than 15 characters" })
		.transform((value) => value.trim()),

	plan: z.string()
		.min(3, { message: "Plan number must be at least 3 characters long" })
		.max(25, { message: "Plan number can't be longer than 25 characters" }),

	lot: z.string()
		.min(1, { message: "Lot number must be at least 1 characters long" })
		.max(25, { message: "Lot number can't be longer than 25 characters" }),

	client: z.string()
		.min(2, { message: "Client's name must be at least 2 characters long" })
		.max(35, { message: "Client's name can't be longer than 35 characters" }),

	phone: z.string()
		.regex(/^\d{10}$/, { message: "Phone number must consist of exactly 10 digits" }),

	email: z.string()
		.email({ message: "This is not a valid email" }),

	company: z.string()
		.min(3, { message: "Client's company name must be at least 3 characters long" })
		.max(35, { message: "Client's company name can't be longer than 35 characters" }),

	address: z.string()
		.min(5, { message: "Address number must be at least 5 characters long" })
		.max(35, { message: "Address can't be longer than 35 characters" }),

	latitude: z.number()
		.min(48, { message: "This latitude is outside of BC" })
		.max(60, { message: "This latitude is outside of BC" }),

	longitude: z.number()
		.min(-139, { message: "This longitude is outside of BC" })
		.max(-114, { message: "This longitude is outside of BC" }),

	status: z.nativeEnum(JobStatus),
	type: z.nativeEnum(JobType)
})
export type CreateAndEditJobDescription = z.infer<typeof createAndEditJobSchema>


// TYPES FOR TIME-SHEETS
export type TimesheetDescription = {
	id: string
	createdAt: Date
	updatedAt: Date
	organizationId: string
	organizationName: string
	clerkId: string
	createdBy: string
	updatedBy: string
	job: string
	hours: number
	description: string
	for: string
	date: Date
	type: string
}
export enum TimesheetType {
	Field = "field",
	Office = "office"
}
export const createAndEditTimesheetSchema = z.object({
	job: z.string().min(3, {
		message: "Job number must be at least 3 characters long"
	}),

	hours: z.number().min(0.25, {
		message: "The minimum value is 15 minutes (0.25 hour)"
	}).max(12, {
		message: "You are working too hard! Take a break"
	}).refine((value) => {
		const decimalCount = (value.toString().split('.')[1] || '').length;
		return decimalCount <= 2;
	}, {
		message: "Hours must be a number with up to two decimal places"
	}),

	description: z.string().min(2, {
		message: "Description number must be at least 2 characters long"
	}),

	for: z.string().min(2, {
		message: "This field must be at least 2 characters long"
	}),

	date: z.date(),
	type: z.nativeEnum(TimesheetType)
})
export type CreateAndEditTimesheetDescription = z.infer<typeof createAndEditTimesheetSchema>