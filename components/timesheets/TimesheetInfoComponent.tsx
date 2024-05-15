//										// prop's type
export const TimesheetInfoComponent = ({ icon, text }: { icon: React.ReactNode; text: string }) => {
	return (
		<div className='flex gap-x-2 items-center'>
			{icon}
			{text}
		</div>
	)
}