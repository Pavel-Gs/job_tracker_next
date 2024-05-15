// SINGLE TIMESHEET PAGE (dynamic route: '/timesheets/[id]) (we have access to the params in dynamic pages) (potentially, it could be discontinued in the future NextJs versions)

// IMPORT REACT QUERY COMPONENTS
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
// IMPORT CUSTOM ACTIONS
import { getSingleTimesheetAction } from '../../../../utils/actionsTimesheets.ts'
// IMPORT CUSTOM COMPONENTS
import { EditTimesheetFormComponent } from '../../../../components/timesheets/EditTimesheetFormComponent.tsx'


// timesheet detail page component (must be default export, file name must be page.*)
//													// prop's type (destructured from an object)
export default async function TimesheetDetailPage({ params }: { params: { id: string } }) {
	const queryClient = new QueryClient()

	await queryClient.prefetchQuery({
		queryKey: ['timesheet', params.id],
		queryFn: () => getSingleTimesheetAction(params.id)
	})

	return (<>
	<h2 className='font-semibold text-3xl text-center mb-4'>EDIT TIMESHEET</h2>
		<HydrationBoundary state={dehydrate(queryClient)}>
			<EditTimesheetFormComponent timesheetId={params.id} />
		</HydrationBoundary>
	</>)
}
