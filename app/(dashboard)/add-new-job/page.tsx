// ADD-NEW-JOB PAGE (route: '/add-new-job')

// IMPORT TANSTACK REACT HOOKS
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
// IMPORT CUSTOM COMPONENTS
import { CreateJobFormComponent } from '../../../components/jobs/CreateJobFormComponent.tsx'


// add-new-job page component (must be default export, file name must be page.*)
export default function AddNewJobPage() {
	const queryClient = new QueryClient()
	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<CreateJobFormComponent />
		</HydrationBoundary>
	)
}
