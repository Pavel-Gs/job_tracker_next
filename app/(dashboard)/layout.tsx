// DASHBOARD LAYOUT

// IMPORT CUSTOM COMPONENTS
import { NavbarComponent } from '../../components/NavbarComponent.tsx'
import { SidebarComponent } from '../../components/SidebarComponent.tsx'


// represents the layout for the dashboard (since "(dashboard)" folder is in parentheses, it won't be included in routing) (must be default export, file name must be layout.*)
// prop's type (destructured from an object)
export default function dashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<main className="min-h-screen bg-image-one dark:bg-image-two"> {/* bg-fixed bg-[url('../public/assets/images/banner.svg')] */} {/* light and dark mode background images are set in tailwind.config.ts */}
			<div className='hidden xl:block'>
				<SidebarComponent />
			</div>
			<div className='min-h-screen'>
				<NavbarComponent />
				<div className="py-16 px-4 sm:px-8 lg:px-16 xl:pl-80 xl:pr-6 xl:py-6">
					{children}
				</div>
			</div>
		</main>
	)
}

{/*
<main className='h-screen grid lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 3xl:grid-cols-9' >
	<div className='hidden xl:block xl:col-span-1 xl:min-h-screen'>
		<SidebarComponent />
	</div>
	<div className='lg:col-span-6 xl:col-span-6 2xl:col-span-7 3xl:col-span-8 h-screen'>
		<NavbarComponent />
		<div className="py-16 px-4 sm:px-8 lg:px-16 xl:pl-24 xl:pr-6 xl:py-6 bg-fixed bg-[url('../public/assets/images/banner.svg')]">
			{children}
		</div>
	</div>
</main>
*/}


{/*
<main className="h-screen bg-fixed bg-[url('../public/assets/images/banner.svg')]">
	<div className='hidden xl:block'>
		<SidebarComponent />
	</div>
	<div className='h-screen'>
		<NavbarComponent />
		<div className="py-16 px-4 sm:px-8 lg:px-16 xl:pl-80 xl:pr-6 xl:py-6">
			{children}
		</div>
	</div>
</main>
*/}