'use client'  // runs on the client side only

import { Check } from 'lucide-react'
// IMPORT CLERK COMPONENTS
import { useUser } from '@clerk/nextjs'
// IMPORT REACT QUERY
import { useMutation, useQueryClient } from '@tanstack/react-query'
// IMPORT ZOD LIBRARY COMPONENTS
import { zodResolver } from '@hookform/resolvers/zod'
// IMPORT REACT FORM HOOKS
import { useForm } from 'react-hook-form'
// IMPORT NAVIGATION COMPONENTS
import { useRouter } from 'next/navigation'
// IMPORT SHADCN-UI COMPONENTS
import { useToast } from '../ui/use-toast.ts'
import { Button } from '../ui/button.tsx'
import { Form } from '../ui/form.tsx'
// IMPORT CUSTOM TYPES
import { JobStatus, JobType, createAndEditJobSchema, CreateAndEditJobDescription } from '../../utils/types.ts'
// IMPORT CUSTOM ACTIONS
import { createJobAction } from '../../utils/actionsJobs.ts'
// IMPORT CUSTOM COMPONENTS
import { CustomFormJobField, CustomFormJobSelect } from './FormJobComponent.tsx'


export const CreateJobFormComponent = () => {
	const form = useForm<CreateAndEditJobDescription>({
		resolver: zodResolver(createAndEditJobSchema),
		defaultValues: {
			job: '',
			plan: '',
			lot: '',
			client: '',
			phone: '',
			email: '',
			company: '',
			address: '',
			latitude: 49,
			longitude: -122,
			status: JobStatus.New,
			type: JobType.TopoLegal
		}
	})

	const { toast } = useToast()
	const queryClient = useQueryClient()
	const router = useRouter()
	const { mutate, isPending } = useMutation({
		mutationFn: (values: CreateAndEditJobDescription) => createJobAction(values),
		onSuccess: (data) => {
			if (!data) {
				toast({ description: "There was an error (possibly a duplicate job name)" })
				return
			}
			toast({ description: "job created" })
			queryClient.invalidateQueries({ queryKey: ['jobs'] })
			queryClient.invalidateQueries({ queryKey: ['job-stats'] }) // add more queries here for time-sheets and map 	???
			queryClient.invalidateQueries({ queryKey: ['job-charts'] })
			router.push('/all-jobs') // where to navigate after a new job has been created
		}
	})

	const { user } = useUser()
	const onSubmit = async (values: CreateAndEditJobDescription) => {
		/* if (!user?.organizationMemberships || user.organizationMemberships.length === 0) { // prevents creation of new jobs for users, who are not members of an organization
			toast({ description: "You must be a member of an organization. Please, contact your administrator."})
			return
		} */		// --> in order for "if" statement to work, include dataWithUsername in else statement <---

		// organizationId, organizationName, createdBy, updatedBy - these values, technically, could be omitted entirely on the client side (because they've been checked for on the server side); note: organizationMemberships[0] - reading only the first entry in the array

		// !!! UPDATE: organizations are now assigned through "private metadata" in Clerk dashboard, not through the membership
		const dataWithUsername = {
			...values,
			organizationId: user?.organizationMemberships[0]?.organization.id, // this value will be overwritten by actions.ts (on the server side) by whatever string is stored in the private metadata
			organizationName: user?.organizationMemberships[0]?.organization.name, // this value will be overwritten by actions.ts (on the server side) by whatever string is stored in the private metadata
			createdBy: user?.firstName, // actions.ts (on the server side) is also accessing the same value
			updatedBy: user?.firstName, // actions.ts (on the server side) is also accessing the same value
		}
		mutate(dataWithUsername)
	}
	return (<>
		<h2 className='font-semibold text-3xl text-center mb-4'>
			ADD NEW JOB
		</h2>
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='bg-muted rounded-lg shadow-md text-right'>
				<div className='p-4 text-left grid gap-4 items-start md:grid-cols-2 lg:grid-cols-3'>
					<CustomFormJobField name='job' control={form.control} placeholder="New job number" />
					<CustomFormJobField name='plan' control={form.control} placeholder="Corresponding plan number" />
					<CustomFormJobField name='lot' control={form.control} placeholder="Corresponding lot number" />
					<CustomFormJobField name='client' control={form.control} placeholder="Client's full name" />
					<CustomFormJobField name='phone' control={form.control} placeholder="Client's phone number" />
					<CustomFormJobField name='email' control={form.control} placeholder="Client's email" />
					<CustomFormJobField name='company' control={form.control} placeholder="Client's company" />
					<CustomFormJobField name='address' control={form.control} placeholder="Site address" />
					<CustomFormJobField name='latitude' control={form.control} placeholder="BC lat. (positive decimal value)" />
					<CustomFormJobField name='longitude' control={form.control} placeholder="BC long. (negative decimal value)" />
					<CustomFormJobSelect name='status' control={form.control} labelText="job status" items={Object.values(JobStatus)} />
					<CustomFormJobSelect name='type' control={form.control} labelText="job type" items={Object.values(JobType)} />
				</div>
				<Button className='self-end rounded-tl-lg rounded-br-lg rounded-tr-none rounded-bl-none hover:bg-secondary hover:text-primary' type='submit' disabled={isPending}>
					{isPending ? "..." : <Check strokeWidth={5} />}
				</Button>
			</form>
		</Form>
	</>)
}

{/* <Button className='self-end rounded-tl-lg rounded-br-lg rounded-tr-none rounded-bl-none' type='submit' disabled={isPending}>
	{isPending ? "Loading" : "Create job"}
</Button> */}