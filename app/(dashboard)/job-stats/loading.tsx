// LOADING PAGE FOR JOB-STATS ROUTE

// IMPORT CUSTOM COMPONENTS
import { StatsJobLoadingCard } from '../../../components/jobs/StatsJobCardComponent.tsx'


// will be displayed, when accessing '/job-stats' route, while the actual page is loading (must be default export, file name must be loading.*)
export default function loading() {
	return (
		<div className='grid md:grid-cols-2 gap-4 lg:grid-cols-4'>
			<StatsJobLoadingCard />
			<StatsJobLoadingCard />
			<StatsJobLoadingCard />
			<StatsJobLoadingCard />
		</div>
	)
}
