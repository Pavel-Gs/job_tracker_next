// LOADING PAGE FOR TIME-STATS ROUTE

// IMPORT CUSTOM COMPONENTS
import { StatsTimeLoadingCard } from '../../../components/timesheets/StatsTimeCardComponent.tsx'


// will be displayed, when accessing '/time-stats' route, while the actual page is loading (must be default export, file name must be loading.*)
export default function loading() {
	return (
		<div className='grid md:grid-cols-2 gap-4 lg:grid-cols-4'>
			<StatsTimeLoadingCard />
			<StatsTimeLoadingCard />
		</div>
	)
}
