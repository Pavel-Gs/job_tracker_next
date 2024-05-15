// TIME-STATS PAGE (route: '/time-stats')

// IMPORT TANSTACK REACT HOOKS
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
// IMPORT CUSTOM ACTIONS
import { getChartsDataTimeAction, getStatsTimeAction } from '../../../utils/actionsTimesheets.ts'
// IMPORT CUSTOM COMPONENTS
import { ChartsTimeContainerComponent } from '../../../components/timesheets/ChartsTimeContainerComponent.tsx'
import { StatsTimeContainerComponent } from '../../../components/timesheets/StatsTimeContainerComponent.tsx'


// stats page component (must be default export, file name must be page.*)
export default async function StatsPageC() {
	const queryClient = new QueryClient()

	await queryClient.prefetchQuery({
		queryKey: ['time-stats'],
		queryFn: () => getStatsTimeAction()
	})
	await queryClient.prefetchQuery({
		queryKey: ['time-charts'],
		queryFn: () => getChartsDataTimeAction()
	})
	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<StatsTimeContainerComponent />
			<ChartsTimeContainerComponent />
		</HydrationBoundary>
	)
}