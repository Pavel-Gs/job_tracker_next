'use client'

// IMPORT TANSTACK REACT HOOKS
import { useQuery } from '@tanstack/react-query'
// IMPORT CUSTOM ACTIONS
import { getStatsJobAction } from '../../utils/actionsJobs.ts'
// IMPORT CUSTOM COMPONENTS
import { StatsJobCardComponent } from './StatsJobCardComponent.tsx'

export const StatsJobContainerComponent = () => {
	const { data } = useQuery({
		queryKey: ['job-stats'],
		queryFn: () => getStatsJobAction()
	})

	return (<>
		<h1 className='text-3xl font-semibold text-center mb-4'>
			ANNUAL JOB STATISTICS
		</h1>
		<div className='grid md:grid-cols-2 gap-4 lg:grid-cols-4'>
			<StatsJobCardComponent title='New jobs' value={data?.new || 0} />
			<StatsJobCardComponent title='Active jobs' value={data?.active || 0} />
			<StatsJobCardComponent title='Finished jobs' value={data?.finished || 0} />
			<StatsJobCardComponent title='Cancelled jobs' value={data?.cancelled || 0} />
		</div>
	</>)
}
