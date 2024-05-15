import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
// IMPORT REACT QUERY COMPONENTS
import { useMutation, useQueryClient } from '@tanstack/react-query'
// IMPORT SHADCN-UI COMPONENTS
import { Button } from '../ui/button.tsx'
import { useToast } from '../ui/use-toast.ts'
// IMPORT CUSTOM ACTIONS
import { deleteTimesheetAction } from '../../utils/actionsTimesheets.ts'


export const DeleteTimesheetBtnComponent = ({ id }: { id: string }) => {
	const { toast } = useToast()
	const queryClient = useQueryClient()
	const router = useRouter()

	const { mutate, isPending } = useMutation({
		mutationFn: (id: string) => deleteTimesheetAction(id),
		onSuccess: (data) => {
			if (!data) {
				toast({
					description: 'there was an error'
				})
				return
			}
			toast({ description: 'timesheet removed' })
			queryClient.invalidateQueries({ queryKey: ['jobs'] })
			queryClient.invalidateQueries({ queryKey: ['time-stats'] })
			queryClient.invalidateQueries({ queryKey: ['time-charts'] })
			queryClient.invalidateQueries({ queryKey: ['timesheets'] })
			router.push('/timesheets')
		}
	})

	const handleDelete = () => {
		const confirmDelete = window.confirm("This action is permanent! DELETE?")
		if (confirmDelete) {
			mutate(id)
		}
	}

	return (
		<Button disabled={isPending} onClick={handleDelete} className='bg-transparent hover:bg-destructive hover:text-secondary text-destructive rounded-full absolute right-4 top-48 sm:right-8 md:right-8 lg:right-16 xl:right-6 xl:top-20'>
			{isPending ? "..." : <Trash2 strokeWidth={3} /> }
		</Button>
	)
}

{/* <Button disabled={isPending} onClick={handleDelete} className='bg-destructive hover:bg-red-700 rounded-tl-none rounded-br-none rounded-tr-lg rounded-bl-lg'>
	{isPending ? 'deleting...' : 'Delete'}
</Button> */}