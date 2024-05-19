'use client' // works on the client side only

// IMPORT NAVIGATION COMPONENTS
import { usePathname } from 'next/navigation'
import Link from 'next/link'
// IMPORT CLERK COMPONENTS
import { useUser } from '@clerk/nextjs'
// IMPORT SHADCN-UI COMPONENTS
import { Button } from './ui/button.tsx'
// IMPORT CUSTOM COMPONENTS
import { linksList } from '../utils/linksList.tsx'
// IMPORT LUCIDE REACT ICONS
import { Briefcase } from 'lucide-react'
// IMPORT NEXTJS IMAGE COMPONENT
import Image from 'next/image'
// IMPORT CUSTOM IMAGES
import LogoImg from '../assets/logo.png'
import LogoIOA from '../assets/logoIOA.png'
import LogoPG from '../assets/logo.gif'


export const SidebarComponent = () => {
	const pathname = usePathname()
	const { user } = useUser()

	let sidebarContent
	switch (user?.publicMetadata?.orgName) {
		case undefined:
			sidebarContent = (<span className='flex flex-col items-center text-center gap-2 text-sm'>
				<Briefcase className='w-10 h-10' />
				Organization ID<br /> is not assigned<br /> (contact your admin)
			</span>)
			break
		case "IOA":
			sidebarContent = (<Image src={LogoIOA} alt="IOA logo" className='mx-auto w-auto max-h-14 sticky top-4' />)
			break
		case "geomatics-consulting":
			sidebarContent = (<Image src={LogoPG} alt="IOA logo" className='mx-auto w-auto max-h-20 sticky top-4' />)
			break
		default:
			sidebarContent = (<Image src={LogoImg} alt="default logo" className='mx-auto w-auto max-h-14 sticky top-4' />)
			break
	}

	return (
		<aside className='bg-muted py-4 px-8 h-full fixed' style={{ boxShadow: '2px 0px 3px 0px rgba(0, 0, 0, 0.09)' }}>
			{sidebarContent}
			<div className='flex flex-col mt-20 gap-y-4 items-start sticky top-40'>
				{linksList.map(i => {
					return (
						<Button asChild key={i.href} variant={pathname === i.href ? 'default' : 'link'} className={`-m-2 ${pathname === i.href ? 'bg-muted-foreground' : ''}`}>
							<Link href={i.href} className='flex items-center gap-x-4 text-secondary-foreground'>
								{i.icon}
								<span>
									{i.label}
								</span>
							</Link>
						</Button>
					)
				})}
			</div>
		</aside>
	)
}
