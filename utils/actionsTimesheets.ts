'use server' // runs on the server side only

// IMPORT CLERK COMPONENTS
import { auth } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs' // server side version of { useUser }
// IMPORT NAVIGATION COMPONENTS
import { redirect } from 'next/navigation'
// IMPORT PRISMA COMPONENTS
import { Prisma } from '@prisma/client'
import { prisma } from './db.ts'
// IMPORT CUSTOM TYPES
import { TimesheetDescription, CreateAndEditTimesheetDescription, createAndEditTimesheetSchema } from './types.ts'
// IMPORT EXTERNAL LIBRARIES
import dayjs from 'dayjs' // for charts


// AUTHENTICATE AND REDIRECT ACTION
//									// prop's type
const authenticateAndRedirect = (): string => {
	const { userId } = auth()
	if (!userId) redirect('/') // where to redirect if user is not logged in
	return userId
}

// CREATE TIME-SHEET ACTION
//											// prop's type								// return type
export const createTimesheetAction = async (values: CreateAndEditTimesheetDescription): Promise<TimesheetDescription | null> => {
	//await new Promise((resolve) => setTimeout(resolve, 3000)) // set timeout to test the loading
	const userId = authenticateAndRedirect()
	const user = await currentUser()
	try {
		const existingJob = await prisma.job.findFirst({
			where: {
				job: values.job, // find an entry in prisma db with the value "job"
				//clerkId: userId,
				organizationId: user?.privateMetadata.orgId ?? "unknown"
			}
		})
		if (!existingJob) {
			throw new Error("That job does not exist") // throw an error, if a job with that name does not exist (server side can't do React toasts)
		}

		createAndEditTimesheetSchema.parse(values) // check passed values
		const timesheet: TimesheetDescription = await prisma.timeSheets.create({ // creates "timeSheet" table in the database
			data: {
				...values,
				organizationId: user?.privateMetadata.orgId?.toString() ?? "unknown", // This is a workaround to get the user's organization ID (since orgId is undefined on the server side). The existing organization ID must be added manually to the user's private metadata section in the profile page at Clerk.com
				organizationName: user?.privateMetadata.orgName?.toString() ?? "unknown", // This is a workaround to get the user's organization Name (since it is undefined on the server side). The existing organization name must be added manually to the user's private metadata section in the profile page at Clerk.com
				clerkId: userId,
				createdBy: user?.firstName ?? "unknown",
				updatedBy: user?.firstName ?? "unknown"
			}
		})
		return timesheet
	} catch (error) {
		console.log(error)
		return null
	}
}

// types for get all timesheets action
type GetAllTimesheetsTypes = {
	search?: string
	timesheetType?: string
	startDate?: Date
	endDate?: Date
	page?: number
	limit?: number
}
// GET ALL TIME-SHEETS ACTION
//											// prop's type (destructured from an object)								// return type
export const getAllTimesheetsAction = async ({ search, timesheetType, startDate, endDate, page = 1, limit = 50 }: GetAllTimesheetsTypes): Promise<{ timesheets: TimesheetDescription[]; count: number; page: number; totalPages: number }> => {
	const userId = authenticateAndRedirect()
	const user = await currentUser()
	try {
		let whereClause: Prisma.TimeSheetsWhereInput = {}

		if (user?.privateMetadata.orgId) { // display jobs associated with the organization, if it is assigned to the user
			whereClause = { organizationId: user.privateMetadata.orgId }
		} else { // display jobs associated with the user only, if organization is not assigned (currently, if a user is not a member of an organization, he won't be able to create new jobs; orgId and orgName are required in CreateJobFormComponent onSubmit())
			whereClause = { clerkId: userId }
		}
		if (search) { // find jobs by description; or show all, if nothing selected
			whereClause = {
				...whereClause,
				OR: [
					{ job: { contains: search } },
					//{ hours: { contains: search } }, // works only with strings (hours is a number)
					{ description: { contains: search } },
					{ for: { contains: search } }
				]
			}
		}
		if (timesheetType && timesheetType !== 'all') {
            whereClause.type = timesheetType;
        }

        if (startDate && endDate) {
            whereClause.date = {
                gte: startDate,
                lte: endDate
            };
        }
		

		const skip = (page - 1) * limit
		const timesheets: TimesheetDescription[] = await prisma.timeSheets.findMany({
			where: whereClause,
			skip,
			take: limit, // paginations params are in the function props (page and limit)
			orderBy: {
				//createdAt: 'desc' // descending
				date: 'desc' // descending
			}
		})
		const count: number = await prisma.timeSheets.count({ // count the total amount of timesheets
			where: whereClause
		})
		const totalPages = Math.ceil(count / limit)
		return { timesheets, count, page, totalPages }
	} catch (error) {
		return { timesheets: [], count: 0, page: 1, totalPages: 0 }
	}
}

// DELETE TIME-SHEET ACTION
//										// props's type		// return type
export const deleteTimesheetAction = async (id: string): Promise<TimesheetDescription | null> => {
	//const userId = authenticateAndRedirect() //used with clerkId: userId
	const user = await currentUser()
	try {
		const timesheet: TimesheetDescription = await prisma.timeSheets.delete({
			where: {
				id,
				//clerkId: userId, // delete a timesheet associated with the user only, if organization is not assigned; orgId and orgName are required in CreateJobFormComponent onSubmit())
				organizationId: user?.privateMetadata.orgId ?? "unknown" // delete a timesheet associated with the organization, if it is assigned to the user
			}
		})
		return timesheet
	} catch (error) {
		return null
	}
}

// GET SINGLE TIMESHEET ACTION
//										// prop's type		// return type
export const getSingleTimesheetAction = async (id: string): Promise<TimesheetDescription | null> => {
	let timesheet: TimesheetDescription | null = null
	//const userId = authenticateAndRedirect() //used with clerkId: userId
	const user = await currentUser()
	try {
		timesheet = await prisma.timeSheets.findUnique({
			where: {
				id,
				//clerkId: userId, // access an edit form for a timesheet, associated with the user only, if organization is not assigned (currently; orgId and orgName are required in CreateJobFormComponent onSubmit())
				organizationId: user?.privateMetadata.orgId ?? "unknown" // access an edit form for a timesheet, associated with the organization, if it is assigned to the user
			}
		})
	} catch (error) {
		timesheet = null
	}
	if (!timesheet) {
		redirect('/timesheets')
	}
	return timesheet
}

// UPDATE TIMESHEET ACTION
//											// prop's type											// return type
export const updateTimesheetAction = async (id: string, values: CreateAndEditTimesheetDescription): Promise<TimesheetDescription | null> => {
	//const userId = authenticateAndRedirect() //used with clerkId: userId
	const user = await currentUser()
	try {
		const existingJob = await prisma.job.findFirst({
			where: {
				job: values.job, // find an entry in prisma db with the value "job"
				//clerkId: userId,
				organizationId: user?.privateMetadata.orgId ?? "unknown"
			}
		})
		if (!existingJob) {
			throw new Error("That job does not exist") // throw an error, if a job with that name already exists (server side can't do React toasts)
		}
		const timesheet: TimesheetDescription = await prisma.timeSheets.update({
			where: {
				id,
				//clerkId: userId // edit and update a timesheet, associated with the user only, if organization is not assigned; orgId and orgName are required in CreateJobFormComponent onSubmit())
				organizationId: user?.privateMetadata.orgId ?? "unknown", // edit and update a timesheet, associated with the organization, if it is assigned to the user
			},
			data: {
				...values,
				updatedBy: user?.firstName ?? "unknown"
			}
		})
		return timesheet
	} catch (error) {
		return null
	}
}

// GET STATS TIME ACTION (for charts)
//											// return type
export const getStatsTimeAction = async (): Promise<{ office: number; field: number }> => {
	//const userId = authenticateAndRedirect() //used with clerkId: userId
	const user = await currentUser()
	try {
		const stats = await prisma.timeSheets.groupBy({
			where: {
				//clerkId: userId, // associated with the user only, if organization is not assigned; orgId and orgName are required in CreateJobFormComponent onSubmit())
				organizationId: user?.privateMetadata.orgId ?? "unknown" // associated with the organization, if it is assigned to the user
			},
			by: ['type'],
			_count: {
				type: true
			}
		})
		const statsObject = stats.reduce((acc, curr) => {
			acc[curr.type] = curr._count.type
			return acc
		}, {} as Record<string, number>)

		const defaultStats = {
			office: 0,
			field: 0,
			...statsObject
		}
		return defaultStats

	} catch (error) {
		console.log(error)
		redirect('/timesheets')
	}
}

// GET CHARTS DATA TIME ACTION (for charts)
//												// return type
export const getChartsDataTimeAction = async (): Promise<Array<{ date: string; count: number }>> => {
	//const userId = authenticateAndRedirect() //used with clerkId: userId
	const user = await currentUser()
	const monthsAgo = dayjs().subtract(12, 'month').toDate() // how many months to display in the chart
	try {
		const timesheets = await prisma.timeSheets.findMany({
			where: {
				//clerkId: userId, // associated with the user only, if organization is not assigned; orgId and orgName are required in CreateJobFormComponent onSubmit())
				organizationId: user?.privateMetadata.orgId ?? "unknown", // associated with the organization, if it is assigned to the user
				createdAt: {
					gte: monthsAgo
				}
			},
			orderBy: {
				createdAt: 'asc'
			}
		})

		let applicationsPerMonth = timesheets.reduce((acc, timesheet) => {
			const date = dayjs(timesheet.createdAt).format('MMM YY')
			const existingEntry = acc.find((entry) => entry.date === date)
			if (existingEntry) {
				existingEntry.count += 1
			} else {
				acc.push({ date, count: 1 })
			}
			return acc
		}, [] as Array<{ date: string; count: number }>)

		return applicationsPerMonth
	} catch (error) {
		redirect('/timesheets')
	}
}