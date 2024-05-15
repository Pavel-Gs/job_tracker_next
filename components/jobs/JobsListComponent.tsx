'use client' // runs on the client side only

// IMPORT QUERY HOOKS
import { useQuery } from '@tanstack/react-query'
// IMPORT NAVIGATION COMPONENTS
import { useSearchParams } from 'next/navigation'
// IMPORT CUSTOM ACTIONS
import { getAllJobsAction } from '../../utils/actionsJobs.ts'
// IMPORT CUSTOM COMPONENTS
import { JobCardComponent } from './JobCardComponent.tsx'
import { PaginationComplexComponentJobs } from '../PaginationComplexComponentJobs.tsx' // display pages with dots "..." in pagination
//import { PaginationContainerComponent } from './PaginationContainerComponent.tsx' // display all pages for pagination


export const JobsListComponent = () => {
	const searchParams = useSearchParams()
	const search = searchParams.get('search') || ''
	const jobStatus = searchParams.get('jobStatus') || 'all'
	const jobType = searchParams.get('jobType') || 'all'
	const pageNumber = Number(searchParams.get('page')) || 1

	const { data, isPending } = useQuery({
		queryKey: ['jobs', search, jobStatus, jobType, pageNumber],
		queryFn: () => getAllJobsAction({ search, jobStatus, jobType, page: pageNumber })
	})
	const jobs = data?.jobs || []
	const count = data?.count || 0 // for pagination
	const page = data?.page || 0 // for pagination
	const totalPages = data?.totalPages || 0 // for pagination

	if (isPending) return (<h2 className='text-xl'>Please wait...</h2>)
	if (jobs.length < 1) return (<h2 className='text-xl'>No jobs found...</h2>)
	return (
		<>
			<div className='flex flex-col lg:flex-row items-center justify-between mb-8'>
				<h2 className='text-xl font-semibold mb-2 lg:mb-0'>
					{count} jobs found
				</h2>
				{totalPages < 2 ? null : <PaginationComplexComponentJobs currentPage={page} totalPages={totalPages} />}
			</div>
			<div className='grid gap-8 xl:grid-cols-1 2xl:grid-cols-2 3xl:grid-cols-3'>
				{jobs.map(i => {
					return (
						<JobCardComponent key={i.id} job={i} />
					)
				})}
			</div>
		</>
	)
}
