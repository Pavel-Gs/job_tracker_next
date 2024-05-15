'use client'

import { Check } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
// IMPORT TANSTACK REACT HOOKS
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
// IMPORT CUSTOM TYPES
import { JobStatus, JobType, createAndEditJobSchema, CreateAndEditJobDescription } from '../../utils/types.ts'
// IMPORT CUSTOM ACTIONS
import { getSingleJobAction, updateJobAction } from '../../utils/actionsJobs.ts'
// IMPORT SHADCN-UI COMPONENTS
import { Button } from '../ui/button.tsx'
import { Form } from '../ui/form.tsx'
import { useToast } from '../ui/use-toast.ts'
// IMPORT CUSTOM COMPONENTS
import { CustomFormJobField, CustomFormJobSelect } from './FormJobComponent.tsx'
import { DeleteJobBtnComponent } from './DeleteJobBtnComponent.tsx'


// EDIT JOB FORM COMPONENT
//							// prop's type (destructured from an object)
export const EditJobFormComponent = ({ jobId }: { jobId: string }) => {
	const { toast } = useToast()
	const queryClient = useQueryClient()
	const router = useRouter()

	const { data } = useQuery({
		queryKey: ['job', jobId],
		queryFn: () => getSingleJobAction(jobId),
	})

	const { mutate, isPending } = useMutation({
		mutationFn: (values: CreateAndEditJobDescription) => updateJobAction(jobId, values),
		onSuccess: (data) => {
			if (data) { // Check if the mutation was successful
				toast({ description: 'job updated' })
				queryClient.invalidateQueries({ queryKey: ['jobs'] })
				queryClient.invalidateQueries({ queryKey: ['job', jobId] })  // add more queries here for time-sheets and map 	???
				queryClient.invalidateQueries({ queryKey: ['job-stats'] })
				router.push('/all-jobs')
			} else {
				toast({ description: "There was an error (possibly, that job already exists)" }) // Display error toast
			}
		}
	})

	// 1. Define the form.
	const form = useForm<CreateAndEditJobDescription>({
		resolver: zodResolver(createAndEditJobSchema),
		defaultValues: {
			job: data?.job.trim() || '', // trim white spaces
			plan: data?.plan || '',
			lot: data?.lot || '',
			client: data?.client || '',
			phone: data?.phone || '',
			email: data?.email || '',
			company: data?.company || '',
			address: data?.address || '',
			latitude: data?.latitude || 0,
			longitude: data?.longitude || 0,
			status: (data?.status as JobStatus) || JobStatus.Active,
			type: (data?.type as JobType) || JobType.TopoLegal
		}
	})

	// 2. Define a submit handler.
	const onSubmit = async (values: CreateAndEditJobDescription) => {
		// Trim whitespace from the job field before submitting
		values.job = values.job.trim()

		try {
			// Check if the job already exists with a different ID
			const existingJob = await getSingleJobAction(jobId)

			// If the job exists and its ID is different from the current job's ID
			if (existingJob && existingJob.id !== jobId) {
				toast({ description: 'That job already exists' })
				return
			}

			// If the job does not exist or its ID is the same as the current job's ID,
			// proceed with updating the job
			mutate(values)
		} catch (error) {
			// Handle any errors
			console.error('Error:', error)
			toast({ description: 'An error occurred while updating the job' })
		}
	}

	return (
		<Form {...form}>
			<form className='bg-muted rounded-b-lg shadow-md mb-16' onSubmit={form.handleSubmit(onSubmit)}>
				<div className='p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-start'>
					<CustomFormJobField name='job' control={form.control} />
					<CustomFormJobField name='plan' control={form.control} />
					<CustomFormJobField name='lot' control={form.control} />
					<CustomFormJobField name='client' control={form.control} />
					<CustomFormJobField name='phone' control={form.control} />
					<CustomFormJobField name='email' control={form.control} />
					<CustomFormJobField name='company' control={form.control} />
					<CustomFormJobField name='address' control={form.control} />
					<CustomFormJobField name='latitude' control={form.control} />
					<CustomFormJobField name='longitude' control={form.control} />
					<CustomFormJobSelect name='status' control={form.control} labelText='job status' items={Object.values(JobStatus)} />
					<CustomFormJobSelect name='type' control={form.control} labelText='job type' items={Object.values(JobType)} />
				</div>
				<div className='flex justify-end'>
					<Button className='self-end rounded-tl-lg rounded-br-lg rounded-tr-none rounded-bl-none hover:bg-secondary hover:text-primary' type='submit' disabled={isPending}>
						{isPending ? "..." : <Check strokeWidth={5} /> }
					</Button>
				</div>
			</form>
			<DeleteJobBtnComponent id={jobId} /> {/* delete button must stay outside of the form to prevent calling onSubmit after deletion */}
		</Form>
	)
}

{/* <Button className='self-end rounded-tl-lg rounded-br-lg rounded-tr-none rounded-bl-none' type='submit' disabled={isPending}>
	{isPending ? 'Updating...' : 'Save changes'}
</Button> */}