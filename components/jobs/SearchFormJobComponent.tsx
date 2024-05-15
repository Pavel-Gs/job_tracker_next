'use client'

import { Search } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select.tsx'
import { JobStatus, JobType } from '../../utils/types.ts'
import { Input } from '../ui/input.tsx'
import { Button } from '../ui/button.tsx'

export const SearchFormComponent = () => {
	const searchParams = useSearchParams()
	const search = searchParams.get('search') || ''
	const jobStatus = searchParams.get('jobStatus') || 'all'
	const jobType = searchParams.get('jobType') || 'all'
	const router = useRouter()
	const pathname = usePathname()

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)
		const search = formData.get('search') as string
		const jobStatus = formData.get('jobStatus') as string
		const jobType = formData.get('jobType') as string
		let params = new URLSearchParams()
		params.set('search', search)
		params.set('jobStatus', jobStatus)
		params.set('jobType', jobType)
		router.push(`${pathname}?${params.toString()}`)
	}
	return (<>
		<h2 className='font-semibold text-3xl text-center mb-4'>
			ALL JOBS
		</h2>
		<form className='bg-muted rounded-lg shadow-md mb-16 text-right' onSubmit={handleSubmit}>
			<div className='p-4 bg-muted grid gap-4 rounded-lg sm:grid-cols-2 md:grid-cols-3'>
				<Input type='text' placeholder="search jobs" name='search' defaultValue={search} />
				<Select name='jobStatus' defaultValue={jobStatus}>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{['all', ...Object.values(JobStatus)].map(i => {
							return (
								<SelectItem key={i} value={i}>
									{i}
								</SelectItem>
							)
						})}
					</SelectContent>
				</Select>

				<Select name='jobType' defaultValue={jobType}>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{
							['all', ...Object.values(JobType)].map(i => {
								return (
									<SelectItem key={i} value={i}>
										{i}
									</SelectItem>
								)
							})
						}
					</SelectContent>
				</Select>
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