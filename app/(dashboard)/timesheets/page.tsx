// TIME-SHEETS PAGE (route: '/time-sheets')

// IMPORT REACT QUERY HOOKS
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
// IMPORT CUSTOM ACTIONS
import { getAllTimesheetsAction } from '../../../utils/actionsTimesheets.ts'
// IMPORT CUSTOM COMPONENTS
import { TimesheetsListComponent } from '../../../components/timesheets/TimesheetsListComponent.tsx'
import { SearchFormTimesheetComponent } from '../../../components/timesheets/SearchFormTimesheetComponent.tsx'


// timesheets page component (must be default export, file name must be page.*)
export default async function TimesheetPage() {
	const queryClient = new QueryClient()
	await queryClient.prefetchQuery({
		queryKey: ['timesheets', '', 'all', 1],
		queryFn: () => getAllTimesheetsAction({})
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<SearchFormTimesheetComponent />
			<TimesheetsListComponent />
		</HydrationBoundary>
	)
}
