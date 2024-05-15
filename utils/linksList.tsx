import { AreaChart, MapPinned, FolderPlus, Folders, CalendarPlus2, CalendarRange } from 'lucide-react'

type NavLinksType = {
	href: string
	label: string
	icon: React.ReactNode
}

export const linksList:NavLinksType[] = [
	{
		href: '/add-new-job',
		label: "Add new job",
		icon: <FolderPlus />
	},
	{
		href: '/all-jobs',
		label: "All jobs",
		icon: <Folders />
	},
	{
		href: '/job-stats',
		label: "Stats",
		icon: <AreaChart />
	},
	{
		href: '',
		label: "                    ",
		icon: ''
	},
	{
		href: '/add-time',
		label: "Add time",
		icon: <CalendarPlus2 />
	},
	{
		href: '/timesheets',
		label: "All time-sheets",
		icon: <CalendarRange />
	},
	{
		href: '/time-stats',
		label: "Stats",
		icon: <AreaChart />
	},
	{
		href: ' ',
		label: "                    ",
		icon: ''
	},
	{
		href: '/map',
		label: "Map",
		icon: <MapPinned />
	}
]
