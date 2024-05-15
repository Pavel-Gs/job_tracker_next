export const JobInfoComponent = ({ icon, text, label }: { icon: React.ReactNode; text: string; label: string }) => {
	return (
		<div className='flex gap-x-2 items-center mb-1'>
			{icon}
			{label}
			{text}
		</div>
	)
}