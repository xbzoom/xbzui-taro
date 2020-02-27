import { BaseEvent } from '@tarojs/components/types/common'

import Calendar from '../types'

export interface Props {
  generateDate: Calendar.DateArg

  minDate?: Calendar.DateArg

  maxDate?: Calendar.DateArg

  hideArrow: boolean
  hideTime: boolean;
  time: string;
  timeStep: number;

  monthFormat: string
  collapse: boolean
  selectedDate: Calendar.SelectedDate
  renderExtra?: JSX.Element;

  onPreMonth: () => void

  onNextMonth: () => void

  onSelectDate: (e: BaseEvent) => void

  onSelectTime: (e:string) => void
}

export interface State {
  timeIndex: number[]
}
