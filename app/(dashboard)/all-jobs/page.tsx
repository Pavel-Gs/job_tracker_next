// ALL-JOBS PAGE (route: '/all-jobs')

// IMPORT TANSTACK REACT HOOKS
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
// IMPORT CUSTOM COMPONENTS
import { JobsListComponent } from '../../../components/jobs/JobsListComponent.tsx'
import { SearchFormComponent } from '../../../components/jobs/SearchFormJobComponent.tsx'
// IMPORT CUSTOM ACTIONS
import { getAllJobsAction } from '../../../utils/actionsJobs.ts'


// all-jobs page component (must be default export, file name must be page.*)
export default async function AllJobsPage() {
	//await new Promise((resolve) => setTimeout(resolve, 2000)) // set timeout to test the loading page
	const queryClient = new QueryClient()
	await queryClient.prefetchQuery({
		queryKey: ['jobs', '', 'all', 1],
		queryFn: () => getAllJobsAction({})
	})
	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<SearchFormComponent />
			<JobsListComponent />
		</HydrationBoundary>
	)
}
