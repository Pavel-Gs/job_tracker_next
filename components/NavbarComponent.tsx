import { UserButton } from '@clerk/nextjs'
import { LinksDropdownComponent } from './LinksDropdownComponent.tsx'
import { ThemeToggleComponent } from './ThemeToggleComponent.tsx'


export const NavbarComponent = () => {
	return (
		<nav className='bg-muted xl:bg-transparent py-4 px-4 flex items-center justify-between sm:px-16 lg:px-24 xl:px-0 sticky top-0 z-10 xl:fixed shadow-md xl:shadow-none'> {/* style={{ boxShadow: '2px 2px 2px 0px rgba(0, 0, 0, 0.1)' }} */}
			<div className='mx-4 xl:mx-2'>
				<LinksDropdownComponent />
			</div>
			<div className='flex xl:flex-col xl:pl-56 items-center gap-x-4 gap-y-2'>
				<UserButton afterSignOutUrl='/' />
				<ThemeToggleComponent />
			</div>
		</nav>
	)
}
