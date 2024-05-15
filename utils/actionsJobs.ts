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
import { JobDescription, CreateAndEditJobDescription, createAndEditJobSchema } from './types.ts'
// IMPORT EXTERNAL LIBRARIES
import dayjs from 'dayjs' // used for charts


// AUTHENTICATE AND REDIRECT ACTION
//									// prop's type
const authenticateAndRedirect = (): string => {
	const { userId } = auth()
	if (!userId) redirect('/') // where to redirect if user is not logged in	
	return userId
}

// CREATE JOB ACTION
//											  // prop's type				// return type
export const createJobAction = async (values: CreateAndEditJobDescription): Promise<JobDescription | null> => {
	//await new Promise((resolve) => setTimeout(resolve, 3000)) // set timeout to test the loading
	const userId = authenticateAndRedirect()
	const user = await currentUser() // to access the user object on the server side
	try {
		const existingJob = await prisma.job.findFirst({
			where: {
				job: values.job, // find an entry in prisma db with the value "job"
				//clerkId: userId,
				organizationId: user?.privateMetadata.orgId ?? "unknown"
			}
		})
		if (existingJob) {
			throw new Error("That job already exists") // throw an error, if a job with that name already exists (server side can't do React toasts)
		}
		createAndEditJobSchema.parse(values) // check passed values
		const job: JobDescription = await prisma.job.create({ // creates "job" table in the database
			data: {
				...values,
				organizationId: user?.privateMetadata.orgId?.toString() ?? "unknown", // This is a workaround to get the user's organization ID (since orgId is undefined on the server side). The existing organization ID must be added manually to the user's private metadata section in the profile page at Clerk.com
				organizationName: user?.privateMetadata.orgName?.toString() ?? "unknown", // This is a workaround to get the user's organization Name (since it is undefined on the server side). The existing organization name must be added manually to the user's private metadata section in the profile page at Clerk.com
				clerkId: userId,
				createdBy: user?.firstName ?? "unknown",
				updatedBy: user?.firstName ?? "unknown"
			}
		})
		return job
	} catch (error) {
		console.log(error)
		return null
	}
}

// types for: get all jobs action
type GetAllJobsActionTypes = {
	search?: string
	jobStatus?: string
	jobType?: string
	page?: number
	limit?: number
}
// GET ALL JOBS ACTION
//																	// prop's type (destructured from an object)	 // return type
export const getAllJobsAction = async ({ search, jobStatus, jobType, page = 1, limit = 10 }: GetAllJobsActionTypes): Promise<{ jobs: JobDescription[]; count: number; page: number; totalPages: number }> => {
	const userId = authenticateAndRedirect()
	const user = await currentUser()
	try {
		let whereClause: Prisma.JobWhereInput = {}
		if (user?.privateMetadata.orgId) { // display jobs associated with the organization, if it is assigned to the user
			whereClause = { organizationId: user.privateMetadata.orgId }
		} else { // display jobs associated with the user only, if organization is not assigned; orgId and orgName are required in CreateJobFormComponent onSubmit())
			whereClause = { clerkId: userId }
		}
		if (search) { // find jobs by description; or show all, if nothing selected
			whereClause = {
				...whereClause,
				OR: [
					{ job: { contains: search } },
					{ plan: { contains: search } },
					{ lot: { contains: search } },
					{ client: { contains: search } },
					{ phone: { contains: search } },
					{ email: { contains: search } },
					{ company: { contains: search } },
					{ address: { contains: search } }
				]
			}
		}
		if (jobStatus && jobStatus !== 'all') { // find jobs by status; or show all, if nothing selected
			whereClause = {
				...whereClause,
				status: jobStatus
			}
		}
		if (jobType && jobType !== 'all') { // find jobs by type; or show all, if nothing selected
			whereClause = {
				...whereClause,
				type: jobType
			}
		}
		const skip = (page - 1) * limit
		const jobs: JobDescription[] = await prisma.job.findMany({
			where: whereClause,
			skip,
			take: limit, // paginations params are in the function props (page and limit)
			orderBy: {
				createdAt: 'desc' // descending
			}
		})
		const count: number = await prisma.job.count({ // count the total amount of jobs
			where: whereClause
		})
		const totalPages = Math.ceil(count / limit)
		return { jobs, count, page, totalPages }
	} catch (error) {
		return { jobs: [], count: 0, page: 1, totalPages: 0 }
	}
}

// DELETE JOB ACTION
//								  // props's type  // return type
export const deleteJobAction = async (id: string): Promise<JobDescription | null> => {
	//const userId = authenticateAndRedirect() //used with clerkId: userId
	const user = await currentUser()
	try {
		const job: JobDescription = await prisma.job.delete({
			where: {
				id,
				//clerkId: userId // delete a job associated with the user only, if organization is not assigned (currently, if a user is not a member of an organization, he won't be able to create new jobs; orgId and orgName are required in CreateJobFormComponent onSubmit())
				organizationId: user?.privateMetadata.orgId ?? "unknown" // delete a job associated with the organization, if it is assigned to the user
			}
		})
		return job
	} catch (error) {
		return null
	}
}

// GET SINGLE JOB ACTION
//									// prop's type	  // return type
export const getSingleJobAction = async (id: string): Promise<JobDescription | null> => {
	let job: JobDescription | null = null
	//const userId = authenticateAndRedirect() //used with clerkId: userId
	const user = await currentUser()
	try {
		job = await prisma.job.findUnique({
			where: {
				id,
				//clerkId: userId // access an edit form for a job, associated with the user only, if organization is not assigned (currently, if a user is not a member of an organization, he won't be able to create new jobs; orgId and orgName are required in CreateJobFormComponent onSubmit())
				organizationId: user?.privateMetadata.orgId ?? "unknown" // access an edit form for a job, associated with the organization, if it is assigned to the user
			}
		})
	} catch (error) {
		job = null
	}
	if (!job) {
		redirect('/all-jobs')
	}
	return job
}

// UPDATE JOB ACTION
//										// prop's type									// return type
export const updateJobAction = async (id: string, values: CreateAndEditJobDescription): Promise<JobDescription | null> => {
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
		if (existingJob && existingJob.id !== id) {
			throw new Error("That job already exists") // throw an error, if a job with that name already exists (server side can't do React toasts)
		}
		const job: JobDescription = await prisma.job.update({
			where: {
				id,
				//clerkId: userId // edit and update a job, associated with the user only, if organization is not assigned (currently, if a user is not a member of an organization, he won't be able to create new jobs; orgId and orgName are required in CreateJobFormComponent onSubmit())
				organizationId: user?.privateMetadata.orgId ?? "unknown", // edit and update a job, associated with the organization, if it is assigned to the user
			},
			data: {
				...values,
				updatedBy: user?.firstName ?? "unknown"
			}
		})
		return job
	} catch (error) {
		return null
	}
}

// GET STATS JOB ACTION (for charts)
//										// return type
export const getStatsJobAction = async (): Promise<{ new: number; active: number; finished: number; cancelled: number }> => {
	//const userId = authenticateAndRedirect() //used with clerkId: userId
	const user = await currentUser()
	try {
		const stats = await prisma.job.groupBy({
			where: {
				//clerkId: userId, // associated with the user only, if organization is not assigned; orgId and orgName are required in CreateJobFormComponent onSubmit())
				organizationId: user?.privateMetadata.orgId ?? "unknown" // associated with the organization, if it is assigned to the user
			},
			by: ['status'],
			_count: {
				status: true
			}
		})
		const statsObject = stats.reduce((acc, curr) => {
			acc[curr.status] = curr._count.status
			return acc
		}, {} as Record<string, number>)

		const defaultStats = {
			new: 0,
			active: 0,
			finished: 0,
			cancelled: 0,
			...statsObject
		}
		return defaultStats

	} catch (error) {
		console.log(error);
		redirect('/all-jobs')
	}
}

// GET CHARTS DATA JOB ACTION (for charts)
//											// return type
export const getChartsDataJobAction = async (): Promise<Array<{ date: string; count: number }>> => {
	//const userId = authenticateAndRedirect() //used with clerkId: userId
	const user = await currentUser()
	const monthsAgo = dayjs().subtract(12, 'month').toDate() // how many months to display in the chart
	try {
		const jobs = await prisma.job.findMany({
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

		let applicationsPerMonth = jobs.reduce((acc, job) => {
			const date = dayjs(job.createdAt).format('MMM YY')
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
		redirect('/all-jobs')
	}
}