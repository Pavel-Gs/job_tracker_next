import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
// IMPORT TANSTACK REACT HOOKS
import { useMutation, useQueryClient } from '@tanstack/react-query'
// IMPORT SHADCN-UI COMPONENTS
import { Button } from '../ui/button.tsx'
import { useToast } from '../ui/use-toast.ts'
// IMPORT CUSTOM ACTIONS
import { deleteJobAction } from '@/utils/actionsJobs.ts'


// DELETE JOB BUTTON COMPONENT
//									 // prop's type (destructured from an object)
export const DeleteJobBtnComponent = ({ id }: { id: string }) => {
	const { toast } = useToast()
	const queryClient = useQueryClient()
	const router = useRouter()

	const { mutate, isPending } = useMutation({
		mutationFn: (id: string) => deleteJobAction(id),
		onSuccess: (data) => {
			if (!data) {
				toast({ description: "there was an error" })
				return
			}
			toast({ description: "job removed" })
			queryClient.invalidateQueries({ queryKey: ['jobs'] })
			queryClient.invalidateQueries({ queryKey: ['job-stats'] }) // add more queries here for time-sheets and map 	???
			queryClient.invalidateQueries({ queryKey: ['job-charts'] })
			router.push('/all-jobs')
		}
	})
	const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
		const confirmDelete = window.confirm("This action is permanent! DELETE?")
		if (confirmDelete) {
			mutate(id)
		} else { e.preventDefault() }
	}

	/* onClick={handleDelete} */
	/* onClick={() => mutate(id)} */
	/* style={{ top: '4.75rem' }} */
	/* className='bg-destructive hover:bg-red-700 rounded-tl-none rounded-br-none rounded-tr-none rounded-bl-lg absolute right-4 top-48 sm:right-8 md:right-8 lg:right-16 xl:right-6 xl:top-20' */
	return (
		<Button disabled={isPending} onClick={handleDelete} className='bg-transparent text-destructive hover:bg-destructive hover:text-secondary rounded-full absolute right-4 top-48 sm:right-8 md:right-8 lg:right-16 xl:right-6 xl:top-20'>
			{isPending ? "..." : <Trash2 strokeWidth={3} /> }
		</Button>
	)
}