import Link from 'next/link'
import { MapPin, RadioTower, Wrench, UsersRound, Map, AtSign, Maximize, Phone, CheckCheck, XOctagon, Star, Settings } from 'lucide-react'
import { JobDescription } from '../../utils/types.ts'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card.tsx'
import { Separator } from '../ui/separator.tsx'
import { Button } from '../ui/button.tsx'
import { Badge } from '../ui/badge.tsx'
import { JobInfoComponent } from './JobInfoComponent.tsx'
import { DeleteJobBtnComponent } from './DeleteJobBtnComponent.tsx'


export const JobCardComponent = ({ job }: { job: JobDescription }) => {
	const dateCreated = new Date(job.createdAt).toLocaleString(undefined, {
		year: 'numeric',
		month: 'short', // Display short or full month name
		day: '2-digit',
		hour12: false, // Use 24-hour format
		hour: '2-digit',
		minute: '2-digit'
	})
	const dateUpdated = new Date(job.updatedAt).toLocaleString(undefined, {
		year: 'numeric',
		month: 'short', // Display short or full month name
		day: '2-digit',
		hour12: false, // Use 24-hour format
		hour: '2-digit',
		minute: '2-digit'
	})

	return (
		<Card className='bg-muted text-right shadow-md'>
			<Badge className='w-32 justify-center bg-muted-foreground'>
				{job.status === 'new' && (<span className='flex'> <Star className='mx-1 w-4 h-4 text-yellow-500' /> {job.status} </span>)}
				{job.status === 'active' && (<span className='flex'> <RadioTower className='mx-1 w-4 h-4 text-green-500' /> {job.status} </span>)}
				{job.status === 'finished' && (<span className='flex'> <CheckCheck className='mx-1 w-4 h-4' /> {job.status} </span>)}
				{job.status === 'cancelled' && (<span className='flex'> <XOctagon className='mx-1 w-4 h-4 text-red-500' /> {job.status} </span>)}
			</Badge>
			<CardHeader className='grid grid-cols-2 text-left pt-0 pb-2'>
				<div>
					<CardTitle>
						{job.job}
					</CardTitle>
					<CardDescription>
						{job.company}
					</CardDescription>
				</div>
				<div>
					<CardDescription className='text-right'>
						created by: {job.createdBy} ({dateCreated})
					</CardDescription>
					<CardDescription className='text-right text-green-500'>
						{dateCreated !== dateUpdated ? `updated by: ${job.updatedBy} (${dateUpdated})` : null}
					</CardDescription>
				</div>
			</CardHeader>
			<Separator />
			<CardContent className='mt-4 flex flex-col text-left'>
				<JobInfoComponent icon={<UsersRound />} label="Client: " text={job.client} />
				<JobInfoComponent icon={<Phone />} label="Phone number: " text={job.phone} />
				<JobInfoComponent icon={<AtSign />} label="Email: " text={job.email} />
				<br></br>
				<JobInfoComponent icon={<MapPin />} label="Site address: " text={job.address} />
				<JobInfoComponent icon={<Map />} label="Plan number: " text={job.plan} />
				<JobInfoComponent icon={<Maximize />} label="Lot number: " text={job.lot} />
				{/* <br></br> */}
				{/* <JobInfoComponent icon={<Wrench />} label="Job type: " text={job.type} /> */}
				{/* {dateCreated !== dateUpdated ? <JobInfoComponent icon={<CalendarPlus2 className='text-green-500' />} text={dateUpdated} /> : null} */}
				{/* <JobInfoComponent icon={<CalendarDays />} text={dateCreated} /> */}
			</CardContent>
			<CardFooter className='flex gap-4 justify-between p-0 pl-5'>
				<JobInfoComponent icon={<Wrench />} label="Job type: " text={job.type} />
				<Button asChild size='sm' className='rounded-full bg-transparent text-primary hover:bg-primary hover:text-secondary'>
					<Link href={`/all-jobs/${job.id}`}>
						<Settings strokeWidth={3} />
					</Link>
				</Button>
				{/* <DeleteJobBtnComponent id={job.id} /> */} {/* placed this button inside EDIT form */}
			</CardFooter>
		</Card>
	)
}
