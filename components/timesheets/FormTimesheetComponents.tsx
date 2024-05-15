// IMPORT REACT FORM HOOKS
import { Control } from 'react-hook-form'
// IMPORT SHADCN-UI COMPONENTS
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select.tsx'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form.tsx'
import { Input } from '../ui/input.tsx'

import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'


// types for custom form field
type CustomFormFieldProp = {
	name: string,
	placeholder?: string,
	control: Control<any>
}
//										// prop's type (destructured from an object)
export const CustomFormTimesheetField = ({ name, placeholder, control }: CustomFormFieldProp) => {
	return (
		<FormField control={control} name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel>
						{name}
					</FormLabel>
					{name === 'hours' ? ( // workaround to make the input field accept numbers (not only strings)
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
export const CustomFormTimesheetSelect = ({ name, control, items, labelText }: CustomFormSelectProps) => {
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

// types for custom form date picker
type CustomFormDatePickerProps = {
	name: string
	control: Control<any>
	placeholder?: string
}

export const CustomFormDatePicker = ({ name, control, placeholder }: CustomFormDatePickerProps) => {
	return (
		<FormField control={control} name={name} render={({ field }) => (
			<FormItem>
				<FormLabel>{name}</FormLabel>
				<div className='border-2 w-28'>
					<ReactDatePicker className='w-full text-sm p-2'
						{...field}
						selected={field.value || null}
						onChange={(date) => field.onChange(date)}
						placeholderText={placeholder}
						dateFormat="yyyy-MM-dd" //dateFormat="yyyy-MM-dd" //dateFormat="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
					/>
				</div>
				<FormMessage />
			</FormItem>
		)} />
	)
}