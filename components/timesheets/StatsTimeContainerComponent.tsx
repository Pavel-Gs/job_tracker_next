'use client'

// IMPORT TANSTACK REACT HOOKS
import { useQuery } from '@tanstack/react-query'
// IMPORT CUSTOM ACTIONS
import { getStatsTimeAction } from '../../utils/actionsTimesheets.ts'
// IMPORT CUSTOM COMPONENTS
import { StatsTimeCardComponent } from './StatsTimeCardComponent.tsx'

export const StatsTimeContainerComponent = () => {
	const { data } = useQuery({
		queryKey: ['time-stats'],
		queryFn: () => getStatsTimeAction()
	})

	return (<>
	<h1 className='text-3xl font-semibold text-center mb-4'>
			ANNUAL TIMESHEET STATISTICS
		</h1>
		<div className='grid md:grid-cols-2 gap-4 lg:grid-cols-4'>
			<StatsTimeCardComponent title='Office time-sheets' value={data?.office || 0} />
			<StatsTimeCardComponent title='Field time-sheets' value={data?.field || 0} />
		</div>
		</>)
}