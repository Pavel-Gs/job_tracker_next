'use client'  // runs on the client side only

import { Check } from 'lucide-react'
// IMPORT ZOD COMPONENTS
import { zodResolver } from '@hookform/resolvers/zod'
// IMPORT NAVIGATION COMPONENTS
import { useRouter } from 'next/navigation'
// IMPORT QUERY HOOKS
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
// IMPORT REACT COMPONENTS
import { useForm } from 'react-hook-form'
// IMPORT SHADCN-UI COMPONENTS
import { Button } from '../ui/button.tsx'
import { Form } from '../ui/form.tsx'
import { useToast } from '../ui/use-toast.ts'
// IMPORT CUSTOM TYPES
import { TimesheetDescription, TimesheetType, createAndEditTimesheetSchema, CreateAndEditTimesheetDescription } from '../../utils/types.ts'
// IMPORT CUSTOM ACTIONS
import { getSingleTimesheetAction, updateTimesheetAction } from '../../utils/actionsTimesheets.ts'
// IMPORT CUSTOM FORM COMPONENTS
import { CustomFormTimesheetField, CustomFormTimesheetSelect, CustomFormDatePicker } from './FormTimesheetComponents.tsx'
import { DeleteTimesheetBtnComponent } from './DeleteTimesheetBtnComponent.tsx'


// EDIT TIMESHEET FORM COMPONENT
//														// prop's type (destructured from an object)
export const EditTimesheetFormComponent = ({ timesheetId }: { timesheetId: string }) => {
	const queryClient = useQueryClient()
	const { toast } = useToast()
	const router = useRouter()

	const { data } = useQuery({
		queryKey: ['timesheet', timesheetId],
		queryFn: () => getSingleTimesheetAction(timesheetId)
	})

	const { mutate, isPending } = useMutation({
		mutationFn: (values: CreateAndEditTimesheetDescription) =>
			updateTimesheetAction(timesheetId, values),
		onSuccess: (data) => {
			if (!data) {
				toast({
					description: 'There was an error (possibly, that job does not exist)',
				})
				return
			}
			toast({ description: 'timesheet updated' })
			queryClient.invalidateQueries({ queryKey: ['jobs'] })
			queryClient.invalidateQueries({ queryKey: ['timesheets'] })
			queryClient.invalidateQueries({ queryKey: ['timesheet', timesheetId] })
			queryClient.invalidateQueries({ queryKey: ['time-stats'] })
			router.push('/timesheets')
			// form.reset()
		}
	})

	// 1. Define the form.
	const form = useForm<CreateAndEditTimesheetDescription>({
		resolver: zodResolver(createAndEditTimesheetSchema),
		defaultValues: {
			job: data?.job.trim() || '', // trim white spaces
			hours: data?.hours || 0,
			description: data?.description || '',
			for: data?.for || '',
			date: data?.date ? new Date(data.date) : undefined, // Convert string to Date or set to undefined
			type: (data?.type as TimesheetType) || TimesheetType.Office
		}
	})

	// 2. Define a submit handler.
	function onSubmit(values: CreateAndEditTimesheetDescription) {
		values.job = values.job.trim() // Trim whitespace from the job field before submitting
		mutate(values)
	}

	return (
		<Form {...form}>
			<form className='bg-muted rounded-lg shadow-md' onSubmit={form.handleSubmit(onSubmit)}>
				<div className='p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-start'>
					<CustomFormTimesheetField name='job' control={form.control} />
					<CustomFormTimesheetField name='hours' control={form.control} />
					<CustomFormTimesheetField name='description' control={form.control} />
					<CustomFormTimesheetField name='for' control={form.control} />
					<CustomFormTimesheetSelect name='type' control={form.control} labelText='timesheet type' items={Object.values(TimesheetType)} />
					<CustomFormDatePicker name='date' control={form.control} />
				</div>
				<div className='flex justify-end'>
					<Button className='self-end rounded-tl-lg rounded-br-lg rounded-tr-none rounded-bl-none hover:bg-secondary hover:text-primary' type='submit' disabled={isPending}>
						{isPending ? '...' : <Check strokeWidth={5} />}
					</Button>
				</div>
			</form>
			<DeleteTimesheetBtnComponent id={timesheetId} /> {/* delete button must stay outside of the form to prevent calling onSubmit after deletion */}
		</Form>
	)
}

{/* <Button className='self-end rounded-tl-lg rounded-br-lg rounded-tr-none rounded-bl-none' type='submit' disabled={isPending}>
	{isPending ? 'updating...' : 'Save changes'}
</Button> */}
