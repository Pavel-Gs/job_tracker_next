'use client' // runs on the client side only

// IMPORT QUERY HOOKS
import { useQuery } from '@tanstack/react-query'
// IMPORT NAVIGATION COMPONENTS
import { useSearchParams } from 'next/navigation'
// IMPORT CUSTOM ACTIONS
import { getAllTimesheetsAction } from '../../utils/actionsTimesheets.ts'
// IMPORT CUSTOM COMPONENTS
import { TimesheetCardComponent } from './TimesheetCardComponent.tsx'
import { PaginationComplexComponentTimesheets } from '../PaginationComplexComponentTimesheets.tsx' // display pages with dots "..." in pagination
//import { PaginationContainerComponent } from './PaginationContainerComponent.tsx' // display all pages for pagination


export const TimesheetsListComponent = () => {
	const searchParams = useSearchParams()
	const search = searchParams.get('search') || ""
	const timesheetType = searchParams.get('timesheetType') || 'all'
	const pageNumber = Number(searchParams.get('page')) || 1
	// Extract startDate and endDate from searchParams
	const startDateString = searchParams.get('startDate')
	const endDateString = searchParams.get('endDate')

	// Parse startDate and endDate into Date objects or undefined
	const startDate = startDateString ? new Date(startDateString) : undefined
	const endDate = endDateString ? new Date(endDateString) : undefined

	const { data, isPending } = useQuery({
		queryKey: ['timesheets', search, timesheetType, startDate, endDate, pageNumber], 
		queryFn: () => getAllTimesheetsAction({ search, timesheetType, startDate, endDate, page: pageNumber }) 
	})

	const timesheets = data?.timesheets || []
	const count = data?.count || 0
	const page = data?.page || 0 // for pagination
	const totalPages = data?.totalPages || 0 // for pagination

	// Calculate total hours from filtered timesheets
	const totalHours = timesheets.reduce((total, timesheet) => total + timesheet.hours, 0).toFixed(2);

	if (isPending) return <h2 className='text-xl'>Please wait...</h2>
	if (timesheets.length < 1) return <h2 className='text-xl'>No time-sheets found...</h2>
	return (
		<>
			<div className='flex flex-col 2xl:flex-row items-center justify-between mb-8'>
				<h2 className='text-xl font-semibold'>{count} time-sheets found</h2>
				<h2 className='text-xl font-semibold mb-2 2xl:mb-0'>{totalHours} hours on current page</h2>
				{totalPages < 2 ? null : <PaginationComplexComponentTimesheets currentPage={page} totalPages={totalPages} />}
			</div>
			<div className='grid gap-4 md:grid-cols-1 lg:grid-cols-1 3xl:grid-cols-2'>
				{timesheets.map(i => {
					return (
						<TimesheetCardComponent key={i.id} timesheet={i} />
					)
				})}
			</div>
		</>
	)
}
