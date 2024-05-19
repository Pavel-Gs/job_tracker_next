'use client'  // runs on the client side only

import { Check } from 'lucide-react'
// IMPORT REACT HOOKS
import { useState, useEffect } from 'react'
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
import { Button } from '../ui/button.tsx'
import { Form } from '../ui/form.tsx'
import { useToast } from '../ui/use-toast.ts'
// IMPORT CUSTOM TYPES
import { TimesheetType, createAndEditTimesheetSchema, CreateAndEditTimesheetDescription } from '../../utils/types.ts'
// IMPORT CUSTOM ACTIONS
import { createTimesheetAction } from '../../utils/actionsTimesheets.ts'
// IMPORT CUSTOM COMPONENTS
import { CustomFormTimesheetField, CustomFormTimesheetSelect, CustomFormDatePicker } from './FormTimesheetComponents.tsx'


export const CreateTimesheetFormComponent = () => {
	// Set user.firstName for the current user to local storage
	const { user } = useUser()
	const [forField, setForField] = useState(localStorage.getItem('userFirstName') || "unknown")
	useEffect(() => {
		if (user) {
			localStorage.setItem('userFirstName', user.firstName || "unknown")
			setForField(user.firstName || "unknown")
		}
	}, [user])

	// populate the form
	const currentDate = new Date();
	const formattedDate = currentDate.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short', // Short month format
		day: '2-digit',
	})
	const form = useForm<CreateAndEditTimesheetDescription>({
		resolver: zodResolver(createAndEditTimesheetSchema),
		defaultValues: {
			job: "",
			hours: 0,
			description: "",
			for: forField,
			date: new Date(formattedDate.split(',').join('')), // Convert string to Date
			//date: new Date().toISOString().split('T')[0],
			type: TimesheetType.Office
		}
	})
	// update user.firstName, when new user logs in
	useEffect(() => {
		if (user) {
			setForField(user.firstName || "unknown")
			form.setValue("for", user.firstName || "unknown")
		}
	}, [user])

	const { toast } = useToast()
	const queryClient = useQueryClient()
	const router = useRouter()
	const { mutate, isPending } = useMutation({
		mutationFn: (values: CreateAndEditTimesheetDescription) => createTimesheetAction(values),
		onSuccess: (data) => {
			if (!data) {
				toast({ description: "There was an error (possibly, that job does not exist" })
				return
			}
			toast({ description: "time added" })
			queryClient.invalidateQueries({ queryKey: ['timesheets'] })
			queryClient.invalidateQueries({ queryKey: ['jobs'] })
			queryClient.invalidateQueries({ queryKey: ['time-stats'] })
			queryClient.invalidateQueries({ queryKey: ['time-charts'] })
			//form.reset() // resets the form values (but selected values from the dropdown will stay)
			router.push('/timesheets') // navigate away after time is added
		}
	})

	const onSubmit = (values: CreateAndEditTimesheetDescription) => {
		/* if (!user?.organizationMemberships || user.organizationMemberships.length === 0) { // prevents creation of new entries for users, who are not members of an organization
			toast({ description: "You must be a member of an organization. Please, contact your administrator." })
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
			ADD MORE TIME
		</h2>
		<Form {...form}>
			<form className='bg-muted rounded-lg shadow-md text-right mb-16' onSubmit={form.handleSubmit(onSubmit)}>
				<div className='p-4 text-left grid gap-4 items-start md:grid-cols-2 lg:grid-cols-3'>
					<CustomFormTimesheetField name='job' control={form.control} placeholder="Existing job number" />
					<CustomFormTimesheetField name='hours' control={form.control} placeholder="Hours spent (decimal value)" />
					<CustomFormTimesheetField name='description' control={form.control} placeholder="Notes (what was done)" />
					<CustomFormTimesheetField name='for' control={form.control} placeholder="Yours or another existing user's name" />
					<CustomFormTimesheetSelect name='type' control={form.control} labelText="type" items={Object.values(TimesheetType)} />
					<CustomFormDatePicker name='date' control={form.control} placeholder="timesheet's corresponding date" />
				</div>
				<Button className='self-end rounded-tl-lg rounded-br-lg rounded-tr-none rounded-bl-none hover:bg-secondary hover:text-primary' type='submit' disabled={isPending}>
					{isPending ? "..." : <Check strokeWidth={5} />}
				</Button>
			</form>
		</Form>
	</>)
}

{/* <Button className='self-end bg-muted-foreground rounded-tl-lg rounded-br-lg rounded-tr-none rounded-bl-none' type='submit' disabled={isPending}>
	{isPending ? "loading" : "Add time"}
</Button> */}