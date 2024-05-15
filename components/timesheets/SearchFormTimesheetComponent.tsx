'use client' // runs on the client side only

import { Search } from 'lucide-react'
// IMPORT NAVIGATION COMPONENTS
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
// IMPORT SHADCN-UI COMPONENTS
import { Input } from '../ui/input.tsx'
import { Button } from '../ui/button.tsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
// IMPORT CUSTOM TYPES
import { TimesheetType } from '../../utils/types.ts'

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


export const SearchFormTimesheetComponent = () => {
	const searchParams = useSearchParams()
	const search = searchParams.get('search') || ""
	const timesheetType = searchParams.get('timesheetType') || "all"

	const router = useRouter()
	const pathname = usePathname()

	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)
		const search = formData.get('search') as string
		const timesheetType = formData.get('timesheetType') as string

		// Convert start and end dates to UTC
		const utcStartDate = startDate ? new Date(startDate.toUTCString()) : null;
		const utcEndDate = endDate ? new Date(endDate.toUTCString()) : null;

		if (utcStartDate) utcStartDate.setDate(utcStartDate.getDate() - 1); // Subtract one day from the start date (manual workaround for timezone difference)
		//if (utcEndDate) utcEndDate.setDate(utcEndDate.getDate() - 1); // Subtract one day from the end date (manual workaround for timezone difference)
		if (utcEndDate) utcEndDate.setDate(utcEndDate.getDate()); // This way the end date in the query will be +1 day, but it is a necessary workaround to display filtered timesheets list PROPERLY (otherwise, I had to pick end date in the datePicker one day ahead, to make it work)

		let params = new URLSearchParams()
		params.set('search', search)
		params.set('timesheetType', timesheetType)
		if (utcStartDate) params.set('startDate', utcStartDate.toISOString());
		if (utcEndDate) params.set('endDate', utcEndDate.toISOString());
		router.push(`${pathname}?${params.toString()}`)
	}
	return (<>
		<h2 className='font-semibold text-3xl text-center mb-4'>
			ALL TIMESHEETS
		</h2>
		<form className='bg-muted rounded-lg shadow-md mb-16 text-right' onSubmit={handleSubmit}>
			<div className='p-4 bg-muted grid gap-4 rounded-lg sm:grid-cols-2 md:grid-cols-3'>
				<Input type='text' placeholder="Search timesheets" name='search' defaultValue={search} />
				<Select name='timesheetType' defaultValue={timesheetType}>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{
							['all', ...Object.values(TimesheetType)].map((timesheetType) => {
								return (
									<SelectItem key={timesheetType} value={timesheetType}>
										{timesheetType}
									</SelectItem>
								)
							})
						}
					</SelectContent>
				</Select>
				<div className='flex justify-around w-full'>
					<div className='flex items-center gap-x-1'><span className='hidden lg:block'>from:</span>
						<div className='border-2'>
							<DatePicker className='p-2 w-24 text-sm'
								selected={startDate}
								onChange={(date) => date && setStartDate(date)}
								selectsStart
								startDate={startDate}
								endDate={endDate}
								placeholderText='Start Date'
							/>
						</div>
					</div>
					<div className='flex items-center gap-x-1'><span className='hidden lg:block'>to:</span>
						<div className='border-2'>
							<DatePicker className='p-2 w-24 text-sm'
								selected={endDate}
								onChange={(date) => date && setEndDate(date)}
								selectsEnd
								startDate={startDate}
								endDate={endDate}
								minDate={startDate}
								placeholderText='End Date'
							/>
						</div>
					</div>
				</div>
			</div>
			<Button type='submit' className='rounded-tl-lg rounded-br-lg rounded-tr-none rounded-bl-none hover:bg-secondary hover:text-primary'>
				<Search strokeWidth={3} />
			</Button>
		</form>
	</>)
}

{/* <Button type='submit' className='bg-muted-foreground max-w-20 rounded-tl-lg rounded-br-lg rounded-tr-none rounded-bl-none'>
	Search
</Button> */}