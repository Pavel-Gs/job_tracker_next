// LANDING PAGE (route: '/')

// IMPORT NEXT.JS COMPONENTS
import Image from 'next/image'
import Link from 'next/link'
// IMPORT SHADCN-UI COMPONENTS
import { Button } from '../components/ui/button.tsx'
// IMPORT SHADCN-UI COMPONENTS
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel.tsx"
// IMPORT ICONS
import { MessageSquareDot } from "lucide-react"
// IMPORT CAROUSEL IMAGES
import Img1 from '../assets/carousel/img1.jpg'
import Img2 from '../assets/carousel/img2.jpg'
import Img3 from '../assets/carousel/img3.jpg'
import Img4 from '../assets/carousel/img4.jpg'
import Img5 from '../assets/carousel/img5.jpg'
import Img6 from '../assets/carousel/img6.jpg'
import Img7 from '../assets/carousel/img7.jpg'
import Img8 from '../assets/carousel/img8.jpg'
import Img9 from '../assets/carousel/img9.jpg'
import Img10 from '../assets/carousel/img10.jpg'


// landing page component (must be default export, file name must be page.*)
export default function Home() {
	const getCurrentYear = () => { // for "all rights reserved" in the footer
		return new Date().getFullYear()
	}

	return (
		<main className='min-h-screen p-2 lg:p-8 bg-image-one dark:bg-image-two'>
			<section className='max-w-screen-xl mx-auto'>
				<div className='flex flex-row justify-between'>
					<h1 className='text-3xl font-bold md:text-6xl pr-2'>project <span className='text-primary'>tracker</span></h1>
					<Button asChild className='p-6'><Link href='/all-jobs'>LOGIN</Link></Button>
				</div>
				<p className='mt-4 text-justify'>This application combines the functionalities of a job tracker, time-sheets, map and project database, providing a comprehensive solution for efficient project management. With its user-friendly interface and robust features, it streamlines workflow, enhances collaboration, and ensures accurate tracking of tasks and resources.</p>
			</section>

			{/* <div className='bg-none lg:bg-secondary mt-8 pt-4 pb-8 rounded-lg shadow-none lg:shadow-md max-w-screen-3xl mx-auto'> */}
			<div className='mt-8 pt-4 pb-8 rounded-lg max-w-screen-3xl mx-auto'>
				<div className='text-xl font-bold md:text-4xl text-center mt-8 2xl:-mt-4 3xl:mt-0 mb-4'>GETTING STARTED</div>
				<Carousel className='sm:w-full md:w-1/2 3xl:w-2/5 m-auto border-2 rounded-md shadow-md bg-white'> {/* autoplay plugin is enabled directly in the ui component */}
					<CarouselContent className='flex items-center'>

						<CarouselItem className='basis-full'>
							<div className='flex flex-col'>
								<Image src={Img8} alt="see all your projects on a global map" />
								<div className='flex items-center bg-primary shadow-lg text-secondary text-xl rounded-b-md mt-8 p-4 opacity-80' style={{boxShadow: '0px -5px 10px rgba(0, 0, 0, 0.5)'}}>
									<MessageSquareDot className='mr-4' />See all your projects on a global map
								</div>
							</div>
						</CarouselItem>

						<CarouselItem className='basis-full'>
							<div className='flex flex-col'>
								<div className='flex items-center bg-primary text-secondary text-xl mb-8 p-4 opacity-80' style={{boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.5), 0px -2px 5px rgba(0, 0, 0, 0.5)'}}>
									<MessageSquareDot className='mr-4' />Fill up the form and create new project card
								</div>
								<Image src={Img1} alt="fill up the form and create new project card" />
							</div>
						</CarouselItem>

						<CarouselItem className='basis-full'>
							<div className='flex flex-col'>
								<Image src={Img2} alt="search jobs based on job#, job status, job type, plan#, company name, etc..." />
								<div className='flex items-center bg-primary text-secondary text-xl p-4 opacity-80' style={{boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5), 0px -5px 10px rgba(0, 0, 0, 0.5)'}}>
									<MessageSquareDot className='mr-4' />Search jobs based on job#, job status, job type, plan#, company name, etc...
								</div>
							</div>
						</CarouselItem>

						<CarouselItem className='basis-full'>
							<div className='flex flex-col'>
								<div className='flex items-center bg-primary shadow-lg text-secondary text-xl mb-8 p-4 opacity-80' style={{boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.5), 0px -2px 5px rgba(0, 0, 0, 0.5)'}}>
									<MessageSquareDot className='mr-4' />See the exact location on the map, modify all form inputs as needed
								</div>
								<Image src={Img3} alt="see the exact location on the map, modify all form inputs as needed" />
							</div>
						</CarouselItem>

						<CarouselItem className='basis-full'>
							<div className='flex flex-col'>
								<Image src={Img4} alt="view all time-sheets for corresponding job" />
								<div className='flex items-center bg-primary shadow-lg text-secondary text-xl mt-8 p-4 opacity-80' style={{boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5), 0px -5px 10px rgba(0, 0, 0, 0.5)'}}>
									<MessageSquareDot className='mr-4' />View all time-sheets for corresponding job
								</div>
							</div>
						</CarouselItem>

						<CarouselItem className='basis-full'>
							<div className='flex flex-col'>
								<div className='flex items-center bg-primary shadow-lg text-secondary text-xl mb-8 p-4 opacity-80' style={{boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.5), 0px -2px 5px rgba(0, 0, 0, 0.5)'}}>
									<MessageSquareDot className='mr-4' />Create new timesheets for all members of your organization
								</div>
								<Image src={Img5} alt="create new timesheets for all members of your organization" />
							</div>
						</CarouselItem>

						<CarouselItem className='basis-full'>
							<div className='flex flex-col'>
								<Image src={Img6} alt="view your daily hours" />
								<div className='flex items-center bg-primary shadow-lg text-secondary text-xl mt-8 p-4 opacity-80' style={{boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5), 0px -5px 10px rgba(0, 0, 0, 0.5)'}}>
									<MessageSquareDot className='mr-4' />Review your daily hours
								</div>
							</div>
						</CarouselItem>

						<CarouselItem className='basis-full'>
							<div className='flex flex-col'>
								<Image src={Img7} alt="search all time-sheets based on job#, work type, description and date range" />
								<div className='flex items-center bg-primary shadow-lg text-secondary text-xl mt-8 p-4 opacity-80' style={{boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5), 0px -5px 10px rgba(0, 0, 0, 0.5)'}}>
									<MessageSquareDot className='mr-4' />Search all time-sheets based on job#, work type, description and date range
								</div>
							</div>
						</CarouselItem>

						<CarouselItem className='basis-full'>
							<div className='flex flex-col'>
								<div className='flex items-center bg-primary shadow-lg text-secondary text-xl mb-8 p-4 opacity-80' style={{boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.5), 0px -2px 5px rgba(0, 0, 0, 0.5)'}}>
									<MessageSquareDot className='mr-4' />Check and analyze your annual job data
								</div>
								<Image src={Img9} alt="check and analyze your annual job data" />
							</div>
						</CarouselItem>

						<CarouselItem className='basis-full'>
							<div className='flex flex-col'>
								<div className='flex items-center bg-primary shadow-lg text-secondary text-xl mb-8 p-4 opacity-80' style={{boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.5), 0px -2px 5px rgba(0, 0, 0, 0.5)'}}>
									<MessageSquareDot className='mr-4' />View your annual time-sheet statistics
								</div>
								<Image src={Img10} alt="view your annual time-sheet statistics" />
							</div>
						</CarouselItem>
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			</div>
			{/* <footer className='mt-8'>
				<p>&copy; Pavel Generalov {getCurrentYear()}. All Rights Reserved.</p>
			</footer> */}
		</main>
	)
}
