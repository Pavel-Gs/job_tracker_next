// JOB-STATS PAGE (route: '/job-stats')

// IMPORT TANSTACK REACT HOOKS
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
// IMPORT CUSTOM ACTIONS
import { getChartsDataJobAction, getStatsJobAction } from '../../../utils/actionsJobs.ts'
// IMPORT CUSTOM COMPONENTS
import { ChartsJobContainerComponent } from '../../../components/jobs/ChartsJobContainerComponent.tsx'
import { StatsJobContainerComponent } from '../../../components/jobs/StatsJobContainerComponent.tsx'


// stats page component (must be default export, file name must be page.*)
export default async function StatsJobPage() {
	const queryClient = new QueryClient()

	await queryClient.prefetchQuery({
		queryKey: ['job-stats'],
		queryFn: () => getStatsJobAction()
	})
	await queryClient.prefetchQuery({
		queryKey: ['job-charts'],
		queryFn: () => getChartsDataJobAction()
	})
	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<StatsJobContainerComponent />
			<ChartsJobContainerComponent />
		</HydrationBoundary>
	)
}