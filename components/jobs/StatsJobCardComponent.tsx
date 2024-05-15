// IMPORT SHADCN-UI COMPONENTS
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card.tsx'
import { Skeleton } from '../ui/skeleton.tsx'


// types for: stats cards component
type StatsCardsProps = {
	title: string
	value: number
}
//									// prop's type (destructured from an object)
export const StatsJobCardComponent = ({ title, value }: StatsCardsProps) => {
	return (
		<Card className='bg-muted'>
			<CardHeader className='flex flex-row justify-between items-center'>
				<CardTitle>{title}</CardTitle>
				<CardDescription className='text-4xl font-extrabold text-primary mt-[0px!important]'>
					{value}
				</CardDescription>
			</CardHeader>
		</Card>
	)
}

// loading skeleton for stats card component (instead of "loading...")
export const StatsJobLoadingCard = () => {
	return (
		<Card className='w-[330px] h-[88px]'>
			<CardHeader className='flex flex-row justify-between items-center'>
				<div className='flex items-center space-x-4'>
					<Skeleton className='h-12 w-12 rounded-full' />
					<div className='space-y-2'>
						<Skeleton className='h-4 w-[150px]' />
						<Skeleton className='h-4 w-[100px]' />
					</div>
				</div>
			</CardHeader>
		</Card>
	)
}