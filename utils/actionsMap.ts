'use server' // runs on the server side only

// IMPORT CLERK COMPONENTS
import { auth } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs' // server side version of { useUser }
// IMPORT NAVIGATION COMPONENTS
import { redirect } from 'next/navigation'
// IMPORT PRISMA COMPONENTS
import { Prisma } from '@prisma/client'
import { prisma } from './db.ts'


// AUTHENTICATE AND REDIRECT ACTION
//									// prop's type
const authenticateAndRedirect = (): string => {
	const { userId } = auth()
	if (!userId) redirect('/') // where to redirect if user is not logged in	
	return userId
}

// GET MAP PINS ACTION
export const getMapPinsAction = async (): Promise<{ positions: { latitude: number; longitude: number; name: string }[] }> => {
	try {
		const userId = authenticateAndRedirect()
		const user = await currentUser()

		let whereClause: Prisma.JobWhereInput = {}
		if (user?.privateMetadata.orgId) {
			whereClause = { organizationId: user.privateMetadata.orgId }
		} else {
			whereClause = { clerkId: userId }
		}

		const jobs = await prisma.job.findMany({
			where: whereClause,
			select: {
				latitude: true,
				longitude: true,
				job: true,
			},
		})

		const positions = jobs.map(job => ({
			latitude: job.latitude,
			longitude: job.longitude,
			name: job.job,
		}))
		
		return { positions }
	} catch (error) {
		console.error("Error fetching map data:", error);
		return { positions: [] };
	}
}