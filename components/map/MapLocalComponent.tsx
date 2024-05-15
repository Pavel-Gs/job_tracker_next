"use client" // must use as a client, in order to work

// IMPORT REACT COMPONENTS
import { useEffect, useState } from 'react'
// IMPORT REACT-LEAFLET COMPONENTS
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
// IMPORT LEAFLET TYPES
import { LatLngTuple } from 'leaflet'
// IMPORT LEAFLET COMPATIBILITY
import "leaflet-defaulticon-compatibility"
// IMPORT LEAFLET CSS
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
// IMPORT CUSTOM ACTIONS
import { getMapPinsAction } from '@/utils/actionsMap'


// types for mapProp
interface MapLocalProps {
    mapProp: { latProp: number | null | undefined, lngProp: number | null | undefined }[]
    zoomDefault?: number
}
// types for map pin data
interface MapPinType {
	latitude: number
	longitude: number
	name: string
}
// must be default export (so it can be imported inside MapPage function)
export default function MapLocalComponent({ mapProp, zoomDefault = 16 }: MapLocalProps) {
	const [mapPins, setMapPins] = useState<MapPinType[]>([])
	useEffect(() => {
		const fetchMapPins = async () => {
			try {
				const mapPinsData = await getMapPinsAction()
				setMapPins(mapPinsData.positions)
			} catch (error) {
				console.error("Error fetching map pins:", error)
			}
		}
		fetchMapPins()
	}, [])
	
	const centerDefault: LatLngTuple = [
		mapProp[0]?.latProp ?? 49.10609676962696,
		mapProp[0]?.lngProp ?? -122.65039398133032
	]

	return (
		<MapContainer className='h-full w-full z-0' center={centerDefault} zoom={zoomDefault} scrollWheelZoom={false}>
			<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
			{mapPins.map((i, index) => (
				<Marker key={index} position={[i.latitude, i.longitude]} draggable={false}>
					<Popup>{i.name}</Popup>
				</Marker>
			))}
		</MapContainer>
	)
}
