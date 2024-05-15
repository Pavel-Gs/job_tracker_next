// LOADING PAGE FOR TIME-SHEETS ROUTE

//'use client' // for shadcn-ui progress bar to work, due to usage of React hooks (refer to https://ui.shadcn.com/docs/components/progress )

// IMPORT REACT HOOKS
//import { useState, useEffect } from 'react'
// IMPORT SHADCN-UI COMPONENTS
import { Skeleton } from '@/components/ui/skeleton' // display page skeleton when loading
//import { Progress } from '../../../components/ui/progress.tsx' // display progress bar when loading


// DISPLAY PAGE SKELETON WHILE LOADING
// will be displayed, when accessing '/timesheets' route, while the actual page is loading (must be default export, file name must be loading.*)
export default function loading() {
	return (
		<div className='p-8 grid sm:grid-cols-2 md:grid-cols-3  gap-4 rounded-lg border'>
			<Skeleton className='h-10' />
			<Skeleton className='h-10' />
			<Skeleton className='h-10' />
		</div>
	)
}


// DISPLAY PROGRESS BAR WHEN LOADING
// will be displayed, when accessing '/all-jobs' route, while the actual page is loading (must be default export, file name must be loading.*)
/* export default function loading() {
	const [progress, setProgress] = useState(15) // initial fill bar indicator
	useEffect(() => {
		const timer = setTimeout(() => setProgress(90), 10) // final fill bar indicator
		return () => clearTimeout(timer)
	  }, [])
	return (
		<div className='flex flex-col items-center justify-center m-auto'>
			<Progress value={progress} className='w-[60%]'/>
			<h2 className='text-xl font-medium'>
				loading...
			</h2>
		</div>
	)
} */