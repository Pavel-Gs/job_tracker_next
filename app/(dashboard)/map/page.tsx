// MAP PAGE (route: '/map')

// DYNAMIC IMPORT
import dynamic from "next/dynamic" // must be dynamic import for Leaflet to work (refer to: https://andresprieto-25116.medium.com/how-to-use-react-leaflet-in-nextjs-with-typescript-surviving-it-21a3379d4d18)
// IMPORT REACT COMPONENTS
import { useMemo } from "react"


// map page (must be default export, file name must be page.*)
export default async function MapPage() {
	const MapPageGlobal = useMemo(() => dynamic(
		() => import('../../../components/map/MapGlobalComponent.tsx'),
		{
			loading: () => <p>loading...</p>,
			ssr: false
		}
	), [])
	return (<>
		<h2 className='font-semibold text-3xl text-center mb-4'>MAP OF OPERATIONS</h2>
		<div className="w-full h-[800px] shadow-md">
			<MapPageGlobal />
		</div>
	</>)
}
