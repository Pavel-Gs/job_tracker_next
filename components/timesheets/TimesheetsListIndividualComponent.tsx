'use client' // runs on the client side only

import { useUser } from '@clerk/nextjs'
// IMPORT QUERY HOOKS
import { useQuery } from '@tanstack/react-query'
// IMPORT NAVIGATION COMPONENTS
import { useSearchParams } from 'next/navigation'
// IMPORT CUSTOM ACTIONS
import { getIndividualTimesheetsAction } from '@/utils/actionsIndividual.ts'
// IMPORT CUSTOM COMPONENTS
import { TimesheetCardComponent } from './TimesheetCardComponent.tsx'
import { PaginationComplexComponentTimesheets } from '../PaginationComplexComponentTimesheets.tsx' // display pages with dots "..." in pagination
//import { PaginationContainerComponent } from './PaginationContainerComponent.tsx' // display all pages for pagination


export const TimesheetsListIndividualComponent = () => {
	const user = useUser()
	const searchParams = useSearchParams()
	const pageNumber = Number(searchParams.get('page')) || 1

	const { data, isPending } = useQuery({
		queryKey: ['timesheets', pageNumber],
		queryFn: () => getIndividualTimesheetsAction({ page: pageNumber })
	})
	const timesheets = data?.timesheets || []
	const count = data?.count || 0 // for pagination
	const page = data?.page || 0 // for pagination
	const totalPages = data?.totalPages || 0 // for pagination

	// Calculate total hours for today's timesheets
	const totalHoursToday = timesheets.reduce((total, timesheet) => total + timesheet.hours, 0).toFixed(2);

	if (isPending) return <h2 className='text-xl my-8'>Please wait...</h2>
	if (timesheets.length < 1) return <h2 className='text-xl my-8'>No today&apos;s time-sheets found for: {user.user?.firstName}</h2> /* can't use apostrophe symbol here (result's in failed deployment); use &apos; instead */
	return (<>
		<div className='flex flex-col 2xl:flex-row items-center justify-between my-8'>
			<h2 className='text-xl font-semibold'>{user.user?.firstName}&apos;s today time: {count} time-sheets found</h2> {/* can't use apostrophe symbol here (result's in failed deployment); use &apos; instead */}
			<h2 className='text-xl font-semibold mb-2 2xl:mb-0'>{totalHoursToday} hours on current page</h2>
			{totalPages < 2 ? null : <PaginationComplexComponentTimesheets currentPage={page} totalPages={totalPages} />}
		</div>
		<div className='grid gap-4 md:grid-cols-1 lg:grid-cols-1 3xl:grid-cols-2'>
			{timesheets.map(i => {
				return (
					<TimesheetCardComponent key={i.id} timesheet={i} />
				)
			})}
		</div>
	</>)
}