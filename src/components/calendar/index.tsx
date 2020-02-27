import bind from 'bind-decorator'
import classnames from 'classnames'
import dayjs, { Dayjs } from 'dayjs'

import _pick from 'lodash/pick'
import _isObject from 'lodash/isObject'
import _isFunction from 'lodash/isFunction'

import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { BaseEvent } from '@tarojs/components/types/common'

import Calendar from './types'
import AtCalendarBody from './body/index'
import AtCalendarController from './controller/index'

import { DefaultProps, Props, State, PropsWithDefaults } from './interface'

const defaultProps: DefaultProps = {
  marks: [],
  isSwiper: true,
  hideArrow: true,
  time: '',
  timeStep: 15,
  hideTime: true,
  isVertical: false,
  selectedDates: [],
  isMultiSelect: false,
  format: 'YYYY-MM-DD',
  currentDate: Date.now(),
  monthFormat: 'YYYY年MM月',
  collapse: false,
  collapsible: false,
}

export default class AtCalendar extends Taro.Component<Props, Readonly<State>> {
  static options = { addGlobalClass: true }
  static defaultProps: DefaultProps = defaultProps

  constructor (props: Props) {
    super(...arguments)

    const { currentDate, isMultiSelect, collapse, time } = props as PropsWithDefaults
    this.state = this.getInitializeState(currentDate, isMultiSelect, collapse, time)
  }

  componentWillReceiveProps (nextProps: Props) {
    const { currentDate, isMultiSelect,  collapse, } = nextProps
    if(collapse !== this.state.collapse) {
      this.handleCollapse(collapse);
    }
    if (!currentDate || currentDate === this.props.currentDate) return
    if (isMultiSelect && this.props.isMultiSelect) {
      const { start, end } = currentDate as Calendar.SelectedDate
      const { start: preStart, end: preEnd } = this.props
        .currentDate as Calendar.SelectedDate

      if (start === preStart && preEnd === end) {
        return
      }
    }
    const stateValue: State = this.getInitializeState(
      currentDate,
      isMultiSelect,
      collapse,
      nextProps.time || this.state.time
    )

    this.setState(stateValue)
  }

  @bind
  private getSingleSelectdState (value: Dayjs): Partial<State> {
    const { generateDate, collapse } = this.state
    
    const stateValue: Partial<State> = {
      selectedDate: this.getSelectedDate(value.valueOf())
    }

    const dayjsGenerateDate: Dayjs = collapse ? value.startOf('week') : value.startOf('month')
    const generateDateValue: number = dayjsGenerateDate.valueOf()
    if (generateDateValue !== generateDate) {
      this.triggerChangeDate(dayjsGenerateDate)
      stateValue.generateDate = generateDateValue
    }

    return stateValue
  }

  @bind
  private getMultiSelectedState (value: Dayjs): Pick<State, 'selectedDate'> {
    const { selectedDate } = this.state
    const { end, start } = selectedDate

    const valueUnix: number = value.valueOf()
    const state: Pick<State, 'selectedDate'> = {
      selectedDate
    }

    if (end) {
      state.selectedDate = this.getSelectedDate(valueUnix, 0)
    } else {
      state.selectedDate.end = Math.max(valueUnix, +start)
      state.selectedDate.start = Math.min(valueUnix, +start)
    }

    return state
  }

  private getSelectedDate (start: number, end?: number): Calendar.SelectedDate {
    const stateValue: Calendar.SelectedDate = {
      start,
      end: start
    }


    if (typeof end !== 'undefined') {
      stateValue.end = end
    }

    return stateValue
  }

  private getInitializeState (
    currentDate: Calendar.DateArg | Calendar.SelectedDate,
    isMultiSelect = false,
    collapse = false,
    time: string
  ): State {
    let end: number
    let start: number
    let generateDateValue: number

    if (isMultiSelect) {
      const { start: cStart, end: cEnd } = currentDate as Calendar.SelectedDate

      const dayjsStart = dayjs(cStart)

      start = dayjsStart.startOf('day').valueOf()
      generateDateValue = dayjsStart.startOf('month').valueOf()

      end = cEnd
        ? dayjs(cEnd)
          .startOf('day')
          .valueOf()
        : start
    } else {
      const dayjsStart = dayjs(currentDate as Calendar.DateArg)
      start = dayjsStart.startOf('day').valueOf()
      generateDateValue = collapse ?  dayjsStart.valueOf() : dayjsStart.startOf('month').valueOf()
      end = start
    }
    
    return {
      generateDate: generateDateValue,
      selectedDate: this.getSelectedDate(start, end),
      collapse,
      time,
    }
  }

  @bind
  private triggerChangeDate (value: Dayjs) {
    const { format } = this.props

    if (!_isFunction(this.props.onMonthChange)) return

    this.props.onMonthChange(value.format(format))
  }

  @bind
  setMonth (vectorCount: number) {
    const { format } = this.props
    const { generateDate, collapse } = this.state

    const _generateDate: Dayjs = dayjs(generateDate).add(vectorCount, collapse ? 'week' : 'month')
    this.setState({
      generateDate: _generateDate.valueOf()
    })

    if (vectorCount && _isFunction(this.props.onMonthChange)) {
      this.props.onMonthChange(_generateDate.format(format))
    }
  }

  @bind
  handleClickPreMonth (isMinMonth?: boolean): void {
    if (isMinMonth === true) {
      return
    }

    this.setMonth(-1)

    if (_isFunction(this.props.onClickPreMonth)) {
      this.props.onClickPreMonth()
    }
  }

  @bind
  handleClickNextMonth (isMaxMonth?: boolean): void {
    if (isMaxMonth === true) {
      return
    }

    this.setMonth(1)

    if (_isFunction(this.props.onClickNextMonth)) {
      this.props.onClickNextMonth()
    }
  }

  // picker 选择时间改变时触发
  @bind
  handleSelectDate (e: BaseEvent & { detail: { value: string } }) {
    const { value } = e.detail
    const _generateDate: Dayjs = dayjs(value)
    let _generateDateValue: number = _generateDate.valueOf()
    
    // if(this.state.collapse && dayjs(this.state.selectedDate.start).month() === _generateDate.month()) {
      
    //   _generateDateValue = dayjs(this.state.selectedDate.start).valueOf();
    // }
    
    if (this.state.generateDate === _generateDateValue) return
    
    this.triggerChangeDate(_generateDate)
    this.setState({
      generateDate: _generateDateValue
    })
  }
  @bind
  handleSelectTime (value:string) {
    this.setState({
      time: value,
    }, () => {
      this.handleSelectedDate()
    })
    if (!_isFunction(this.props.onTimeChange)) return
    this.props.onTimeChange(value)
  }

  @bind
  handleDayClick (item: Calendar.Item) {
    const { isMultiSelect } = this.props
    const { isDisabled, value } = item

    if (isDisabled) return

    const dayjsDate: Dayjs = dayjs(value)

    let stateValue: Partial<State> = {}

    if (isMultiSelect) {
      stateValue = this.getMultiSelectedState(dayjsDate)
    } else {
      stateValue = this.getSingleSelectdState(dayjsDate)
    }
   

    this.setState(stateValue as State, () => {
      this.handleSelectedDate()
    })

    if (_isFunction(this.props.onDayClick)) {
      this.props.onDayClick({ value: item.value })
    }
  }

  handleSelectedDate () {
    const selectDate = this.state.selectedDate
    const time = this.state.time;
    if (_isFunction(this.props.onSelectDate)) {
      const info: Calendar.SelectedDate = {
        start: dayjs(selectDate.start).format(this.props.format)
      }

      if (selectDate.end) {
        info.end = dayjs(selectDate.end).format(this.props.format)
      }

      this.props.onSelectDate({
        value: info,
        time,
      })
    }
  }

  @bind
  handleDayLongClick (item: Calendar.Item) {
    if (_isFunction(this.props.onDayLongClick)) {
      this.props.onDayLongClick({ value: item.value })
    }
  }
  handleCollapse (collapse) {
    

    const {
      selectedDate,
      generateDate,
      time,
    } = this.state;
    const {
      isMultiSelect,
    } = this.props;
    
    // 选中日期不在当前月，则直接关闭
    if(dayjs(generateDate).month() !== dayjs(selectedDate.start).month()) {
      return this.setState({
        collapse,
      })
    }

    // 选中日期在当前月，则重新 generateDate = selectedDate.start
    const stateValue: State = this.getInitializeState(
      selectedDate.start,
      isMultiSelect,
      collapse,
      time
    )
    this.setState(stateValue)
  }
  startX: number;
  startY: number;
  handleTouchStart = e => {
    const { clientX, clientY } = e.touches[0]
    this.startX = clientX;
    this.startY = clientY;
  }
  handleTouchEnd = e => {
    console.log(this.props.collapsible)
    // 不可折叠
    if(!this.props.collapsible) return;
    
    const {  clientY } = e.changedTouches[0]
    if(clientY - this.startY > 40  ) {
      this.handleCollapse(false)
    }
    if(clientY - this.startY < -40) {
      this.handleCollapse(true)
    }
    
  }
  render () {
    const { generateDate, selectedDate, collapse, time, } = this.state
    const {
      marks,
      format,
      minDate,
      maxDate,
      isSwiper,
      className,
      hideArrow,
      isVertical,
      monthFormat,
      selectedDates,
      hideTime,
      timeStep,
      collapseBtn,
    } = this.props as PropsWithDefaults
    return (
      <View className={classnames('at-calendar', className)} 
      onTouchStart={this.handleTouchStart}
      onTouchEnd={this.handleTouchEnd}>
        <AtCalendarController
          minDate={minDate}
          maxDate={maxDate}
          hideArrow={hideArrow}
          hideTime={hideTime}
          time={time}
          timeStep={timeStep}
          monthFormat={monthFormat}
          generateDate={generateDate}
          onPreMonth={this.handleClickPreMonth}
          onNextMonth={this.handleClickNextMonth}
          onSelectDate={this.handleSelectDate}
          onSelectTime={this.handleSelectTime}
          selectedDate={selectedDate}
          renderExtra={this.props.renderExtra}
          collapse={collapse}
        />
        <AtCalendarBody
          marks={marks}
          format={format}
          minDate={minDate}
          maxDate={maxDate}
          isSwiper={isSwiper}
          isVertical={isVertical}
          selectedDate={selectedDate}
          selectedDates={selectedDates}
          generateDate={generateDate}
          onDayClick={this.handleDayClick}
          onSwipeMonth={this.setMonth}
          onLongClick={this.handleDayLongClick}
          collapse={collapse}
        />
        {collapseBtn  && <View className={`at-calendar__collapse-btn ${collapse ? 'arrow-bottom' : 'arrow-top'}`} onClick={this.handleCollapse.bind(this, !collapse)}>{collapse? '展开' :'收起'}</View> }
      </View>
    )
  }
}
