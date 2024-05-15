import Link from 'next/link'
import { AlignLeft } from 'lucide-react'
import { Button } from './ui/button.tsx'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu.tsx'
import { linksList } from '../utils/linksList.tsx'


export const LinksDropdownComponent = () => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild className='xl:hidden'>
				<Button variant='outline' size='icon'>
					<AlignLeft />
					<span className='sr-only'>
						Toggle links
					</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-52 xl:hidden' align='start' sideOffset={25}>
				{linksList.map(i => {
					return ( // note: it won't close, if a link is clicked; adding "asChild" to "DropdownMenuItem" could solve it, but it results in errors in the browser's console. UPDATED: for some reason now there is no error
						<DropdownMenuItem asChild key={i.href}>
							<Link href={i.href} className='flex items-center gap-x-2'>
								{i.icon}
								<span>
									{i.label}
								</span>
							</Link>
						</DropdownMenuItem>
					)
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
