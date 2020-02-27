import Calendar from './types'

export interface PropsBase {
  format?: string

  minDate?: Calendar.DateArg

  maxDate?: Calendar.DateArg

  isSwiper?: boolean

  marks?: Array<Calendar.Mark>

  monthFormat?: string

  hideArrow?: boolean
  hideTime?: boolean;
  time?: string

  timeStep?: number;

  isVertical?: boolean

  className?: Calendar.classNameType

  onClickPreMonth?: () => void

  onClickNextMonth?: () => void

  onSelectDate?: (item: { value: Calendar.SelectedDate, time: string }, ) => void

  onDayClick?: (item: { value: string }) => void

  onDayLongClick?: (item: { value: string }) => void

  onMonthChange?: (value: string) => void

  onTimeChange?: (value: string) => void
  collapse?: boolean

  collapsible? :boolean;
  
  renderExtra?: JSX.Element;
}

export interface SingleSelectedProps extends PropsBase {
  isMultiSelect?: false

  currentDate?: Calendar.DateArg
}

export interface MutilSelectedProps extends PropsBase {
  isMultiSelect?: true

  currentDate?: Calendar.SelectedDate
}

export type Props = SingleSelectedProps | MutilSelectedProps

export interface DefaultProps {
  format: string

  isSwiper: boolean

  marks: Array<Calendar.Mark>

  currentDate: Calendar.DateArg | Calendar.SelectedDate

  monthFormat: string

  hideArrow: boolean
  hideTime: boolean;

  time: string;
  timeStep: number;

  isVertical: boolean

  isMultiSelect: boolean

  selectedDates: Array<Calendar.SelectedDate>
  collapse: boolean;
  collapsible: boolean;

  collapseBtn: boolean;
}

export interface State {
  generateDate: number

  selectedDate: Calendar.SelectedDate
  time: string
  collapse: boolean;
}

export type PropsWithDefaults = Props & DefaultProps
