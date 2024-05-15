'use client'

// IMPORT TANSTACK REACT HOOKS
import { useQuery } from '@tanstack/react-query'
// IMPORT RECHARTS COMPONENTS
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
// IMPORT CUSTOM ACTIONS
import { getChartsDataTimeAction } from '../../utils/actionsTimesheets.ts'


export const ChartsTimeContainerComponent = () => {
	const { data } = useQuery({
		queryKey: ['time-charts'],
		queryFn: () => getChartsDataTimeAction()
	})

	if (!data || data.length < 1) return null
	return (
		<section className='mt-16'>
			<ResponsiveContainer width='100%' height={300}>
				<BarChart data={data} margin={{ top: 50 }}>
					<CartesianGrid strokeDasharray='3 3' />
					<XAxis dataKey='date' />
					<YAxis allowDecimals={false} />
					<Tooltip />
					<Bar dataKey='count' fill='#15a34a' barSize={50} /> {/* width of an individual chart bar */}
				</BarChart>
			</ResponsiveContainer>
		</section>
	)
}
