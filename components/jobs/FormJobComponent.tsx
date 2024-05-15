// IMPORT REACT FORM HOOKS
import { Control } from 'react-hook-form'
// IMPORT SHADCN-UI COMPONENTS
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select.tsx'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form.tsx'
import { Input } from '../ui/input.tsx'


// types for custom form field
type CustomFormFieldProps = {
	name: string
	placeholder?: string
	control: Control<any>
}
//									// prop's type (destructured from an object)
export const CustomFormJobField = ({ name, control, placeholder }: CustomFormFieldProps) => {
	return (
		<FormField control={control} name={name} render={({ field }) => (
			<FormItem>
				<FormLabel>
					{name}
				</FormLabel>
				{name === 'latitude' || name === 'longitude' ? ( // workaround to make the input field accept numbers (not only strings)
					<FormControl>
						<Input {...field} type="number" onChange={(e) => { field.onChange(parseFloat(e.target.value)) }} placeholder={placeholder} />
					</FormControl>
				) : (
					<FormControl>
						<Input {...field} placeholder={placeholder} />
					</FormControl>
				)}
				<FormMessage />
			</FormItem>
		)}
		/>
	)
}

// types for custom form select
type CustomFormSelectProps = {
	name: string
	control: Control<any>
	items: string[]
	labelText?: string
}
//									// prop's type (destructured from an object)
export const CustomFormJobSelect = ({ name, control, items, labelText }: CustomFormSelectProps) => {
	return (
		<FormField control={control} name={name} render={({ field }) => {
			return (
				<FormItem>
					<FormLabel>
						{labelText || name}
					</FormLabel>
					<Select onValueChange={field.onChange} defaultValue={field.value}>
						<FormControl>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							{items.map(i => {
								return (
									<SelectItem key={i} value={i}>
										{i}
									</SelectItem>
								)
							})}
						</SelectContent>
					</Select>
					<FormMessage />
				</FormItem>
			)
		}}
		/>
	)
}