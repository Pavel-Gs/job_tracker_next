// IMPORT NAVIGATION COMPONENTS
import Link from 'next/link'
// IMPORT CUSTOM TYPES
import { TimesheetDescription } from '../../utils/types.ts'
// IMPORT ICONS
import { Briefcase, CalendarDays, Users, Hourglass, Axe, Dot, Settings } from 'lucide-react'
// IMPORT SHADCN-UI COMPONENTS
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card.tsx'
import { Separator } from '../ui/separator.tsx'
import { Button } from '../ui/button.tsx'
import { Badge } from '../ui/badge.tsx'
// IMPORT CUSTOM COMPONENTS
import { DeleteTimesheetBtnComponent } from './DeleteTimesheetBtnComponent.tsx'
import { TimesheetInfoComponent } from './TimesheetInfoComponent.tsx'


export const TimesheetCardComponent = ({ timesheet }: { timesheet: TimesheetDescription }) => {
	const dateCreated = new Date(timesheet.createdAt).toLocaleString(undefined, {
		year: 'numeric',
		month: 'short', // Display short or full month name
		day: '2-digit',
		hour12: false, // Use 24-hour format
		hour: '2-digit',
		minute: '2-digit'
	})
	const dateUpdated = new Date(timesheet.updatedAt).toLocaleString(undefined, {
		year: 'numeric',
		month: 'short', // Display short or full month name
		day: '2-digit',
		hour12: false, // Use 24-hour format
		hour: '2-digit',
		minute: '2-digit'
	})
	const dateFor = new Date(timesheet.date).toLocaleString(undefined, {
		year: 'numeric',
		month: 'short', // Display short or full month name
		day: '2-digit'
	})
	return (
		<Card className='bg-muted text-right shadow-md'>
			{timesheet.for !== timesheet.createdBy ? (
				<Badge className='w-32 justify-center bg-muted-foreground'>
					<TimesheetInfoComponent icon={<Users className='w-4 h-4' />} text={`for: ${timesheet.for}`} />
				</Badge>) : null
			}
			<CardHeader className='grid md:grid-cols-2 lg:grid-cols-[1fr,1fr,1fr,1fr,2fr] pt-0 pb-2 text-left'>
				<CardTitle className='pt-2'>
					{timesheet.job}
				</CardTitle>
				<TimesheetInfoComponent icon={<CalendarDays />} text={dateFor} /> {/* text={timesheet.date} */}
				{/* {dateCreated !== dateUpdated ? <TimesheetInfoComponent icon={<CalendarPlus2 className='text-green-500' />} text={dateUpdated} /> : <span></span>} */}
				<TimesheetInfoComponent icon={<Hourglass />} text={`${timesheet.hours} hours`} />
				{timesheet.type === 'office' ? <TimesheetInfoComponent icon={<Briefcase />} text={timesheet.type} /> : null}
				{timesheet.type === 'field' ? <TimesheetInfoComponent icon={<Axe />} text={timesheet.type} /> : null}
				<div className='text-right'>
					<CardDescription className='md:text-left lg:text-right'>
						created by: {timesheet.createdBy} ({dateCreated})
					</CardDescription>
					<CardDescription className='text-green-500 md:text-left lg:text-right'>
						{dateCreated !== dateUpdated ? `updated by: ${timesheet.updatedBy} (${dateUpdated})` : null}
					</CardDescription>
				</div>
			</CardHeader>
			<Separator />
			<CardContent className='flex gap-4 justify-between p-0'>
				<div className='flex'>
					<TimesheetInfoComponent icon={<Dot />} text={timesheet.description} />
				</div>
				<Button asChild size='sm' className='bg-transparent text-primary hover:bg-primary hover:text-secondary rounded-full'>
					<Link href={`/timesheets/${timesheet.id}`}>
						<Settings strokeWidth={3} />
					</Link>
				</Button>
				{/* <DeleteTimesheetBtnComponent id={timesheet.id} /> */} {/* moved inside edit timesheet component */}
			</CardContent>
		</Card>
	)
}