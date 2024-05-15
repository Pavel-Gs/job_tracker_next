// SINGLE JOB PAGE (dynamic route: '/all-jobs/[id]) (we have access to the params in dynamic pages) (potentially, it could be discontinued in the future NextJs versions)

// IMPORT TANSTACK REACT HOOKS
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
// IMPORT CUSTOM ACTIONS
import { getSingleJobAction } from '../../../../utils/actionsJobs.ts'
import { getTimesheetsByJobAction } from '../../../../utils/actionsIndividual.ts'
// IMPORT CUSTOM COMPONENTS
import { EditJobFormComponent } from '../../../../components/jobs/EditJobFormComponent.tsx'
import { TimesheetsListByJobComponent } from '../../../../components/timesheets/TimesheetsListByJobComponent.tsx'
// DYNAMIC IMPORT
import dynamic from "next/dynamic" // must be dynamic import for Leaflet to work (refer to: https://andresprieto-25116.medium.com/how-to-use-react-leaflet-in-nextjs-with-typescript-surviving-it-21a3379d4d18)
// IMPORT REACT COMPONENTS
import { useMemo } from "react"


// job detail page component (must be default export, file name must be page.*)
//													// prop's type (destructured from an object)
export default async function JobDetailPage({ params }: { params: { id: string } }) {
	const MapPageLocal = useMemo(() => dynamic(
		() => import('../../../../components/map/MapLocalComponent.tsx'),
		{
			loading: () => <p>loading...</p>,
			ssr: false
		}
	), [])

	const queryClient = new QueryClient()
	await queryClient.prefetchQuery({
		queryKey: ['job', params.id],
		queryFn: () => getSingleJobAction(params.id),
	})

	let mapProp: { latProp: number | null | undefined, lngProp: number | null | undefined }[] = []
	let jobName = ''
	try {
		const jobDetails = await getSingleJobAction(params.id)
		jobName = jobDetails?.job || ''
		await queryClient.prefetchQuery({
			queryKey: ['timesheets', jobName],
			queryFn: () => getTimesheetsByJobAction({ jobName })
		})


		if (jobDetails) {
			mapProp = [{ latProp: jobDetails.latitude, lngProp: jobDetails.longitude }]
		} else {
			console.log("Job details not available.")
		}
	} catch (error) {
		console.error("Error fetching job details:", error)
	}

	return (<>
		<h2 className='font-semibold text-3xl text-center mb-4'>EDIT JOB</h2>
		<div className='w-full h-[250px] shadow-lg'>
			<MapPageLocal mapProp={mapProp} />
		</div>
		<HydrationBoundary state={dehydrate(queryClient)}>
			<EditJobFormComponent jobId={params.id} />
			<TimesheetsListByJobComponent jobName={jobName} />
		</HydrationBoundary>
	</>)
}
