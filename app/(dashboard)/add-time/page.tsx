// TIME-SHEETS PAGE (route: '/time-sheets')

// IMPORT REACT QUERY HOOKS
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
// IMPORT CUSTOM ACTIONS
import { getIndividualTimesheetsAction } from '@/utils/actionsIndividual.ts'
// IMPORT CUSTOM COMPONENTS
import { CreateTimesheetFormComponent } from '../../../components/timesheets/CreateTimesheetFormComponent.tsx'
import { TimesheetsListIndividualComponent } from '../../../components/timesheets/TimesheetsListIndividualComponent.tsx'


// add-time page (must be default export, file name must be page.*)
export default async function TimesheetPage() {
	const queryClient = new QueryClient()

	await queryClient.prefetchQuery({
		queryKey: ['timesheets', '', 'all', 1],
		queryFn: () => getIndividualTimesheetsAction({})
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<CreateTimesheetFormComponent />
			<TimesheetsListIndividualComponent />
		</HydrationBoundary>
	)
}
