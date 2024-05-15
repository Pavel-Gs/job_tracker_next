'use server' // runs on the server side only

// IMPORT CLERK COMPONENTS
import { auth } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs' // server side version of { useUser }
// IMPORT PRISMA COMPONENTS
import { Prisma } from '@prisma/client'
import { prisma } from './db.ts'
// IMPORT NAVIGATION COMPONENTS
import { redirect } from 'next/navigation'
// IMPORT CUSTOM TYPES
import { TimesheetDescription } from './types.ts'


const authenticateAndRedirect = (): string => {
	const { userId } = auth()
	if (!userId) redirect('/') // where to redirect if user is not logged in	
	return userId
}

// types for get timesheets action
type GetAllTimesheetsTypes = {
	page?: number
	limit?: number
	jobName?: string
}
// GET INDIVIDUAL TIME-SHEETS ACTION (for current user)
//													// prop's type (destructured from an object)				// return type
export const getIndividualTimesheetsAction = async ({ page = 1, limit = 50 }: GetAllTimesheetsTypes): Promise<{ timesheets: TimesheetDescription[]; count: number; page: number; totalPages: number }> => {
	const userId = authenticateAndRedirect()
	const user = await currentUser()
	const userName = user?.firstName

	try {
		let whereClause: Prisma.TimeSheetsWhereInput = {}

		// Apply filter for the current date
		const today = new Date();
		const todayString = today.toISOString().substring(0, 10); // Extract YYYY-MM-DD
		const todayCustom = todayString + "T07:00:00.000Z" // manually add THH:MM:SS part (data-base format)

		if (userName && user?.privateMetadata.orgId) { // Apply the filter only if the user name and orgId are available
			whereClause = {
				for: userName,
				organizationId: user.privateMetadata.orgId,
				date: todayCustom, // Filter for the current date
			}
		} else { // display time-sheets associated with the user only, if organization is not assigned; orgId and orgName are required in CreateJobFormComponent onSubmit())
			whereClause = { clerkId: userId }
		}

		const skip = (page - 1) * limit
		const timesheets: TimesheetDescription[] = await prisma.timeSheets.findMany({
			where: whereClause,
			skip,
			take: limit,
			orderBy: {
				createdAt: 'desc'
			}
		})

		const count: number = await prisma.timeSheets.count({
			where: whereClause
		})

		const totalPages = Math.ceil(count / limit)

		return { timesheets, count, page, totalPages }
	} catch (error) {
		return { timesheets: [], count: 0, page: 1, totalPages: 0 }
	}
}

// GET TIME-SHEETS BY JOB ACTION (for current job)
//													// prop's type (destructured from an object)			// return type
export const getTimesheetsByJobAction = async ({ jobName, page = 1, limit = 50 }: GetAllTimesheetsTypes): Promise<{ timesheets: TimesheetDescription[]; count: number; page: number; totalPages: number }> => {
	const userId = authenticateAndRedirect();
	const user = await currentUser();
	try {
		let whereClause: any = {
			job: {
				contains: jobName // Filter timesheets by job name
			}
		}

		// Check if user belongs to an organization
		if (user?.privateMetadata.orgId) {
			// Include organization ID in the query
			whereClause.organizationId = user.privateMetadata.orgId;
		} else {
			// Include user ID in the query
			whereClause.clerkId = userId;
		}

		const timesheets: TimesheetDescription[] = await prisma.timeSheets.findMany({
			where: whereClause,
			skip: (page - 1) * limit,
			take: limit,
			orderBy: {
				createdAt: 'desc'
			}
		})

		const count: number = await prisma.timeSheets.count({
			where: whereClause
		})

		const totalPages = Math.ceil(count / limit);

		return { timesheets, count, page, totalPages };
	} catch (error) {
		return { timesheets: [], count: 0, page: 1, totalPages: 0 }
	}
}