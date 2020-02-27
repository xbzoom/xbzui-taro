import dayjs, { Dayjs } from 'dayjs'
import classnames from 'classnames'
import Taro from '@tarojs/taro'
import { Text, View, Picker } from '@tarojs/components'
import { Props, State } from './interface'

export default class AtCalendarController extends Taro.Component<Props, State> {
  timeArray:string[][];
  constructor(props) {
    super(props);
    const {
      time,
    } = this.props;
    console.log(time);
    this.timeArray =  this.initTime();
    let timeIndex = [0, 0];
    if(time) {
      const hourTemp = time.split(':')[0];
      const timeTemp = time.split(':')[1];
      const hourTempIndex = this.timeArray[0].findIndex(item => item == hourTemp);
      const timeTempIndex = this.timeArray[1].findIndex(item => item == timeTemp);
      timeIndex = [hourTempIndex, timeTempIndex];
    }
    this.state = {
      timeIndex,
    }
  }
  static options = { addGlobalClass: true }
  
  initTime  = () => {
    const hours = Array(24).fill(null).map((_, h) => h < 9 ? '0' + h : '' + h);
    const times:string[] = [];
    const step  = this.props.timeStep;
    for(let i = 0 ; i < 60 ; i+= step) {
      times.push(i < 10 ? '0' + i : '' + i);
    }
    return [hours, times]
  }
  
  handleOnTimeChange = e => {
    const timeIndex = e.detail.value;
    const time = this.timeArray[0][timeIndex[0]] + ':' + this.timeArray[1][timeIndex[1]]
    this.setState({
      timeIndex,
    })
    this.props.onSelectTime(time);
  }
  render () {
    const {
      generateDate,
      minDate,
      maxDate,
      monthFormat,
      hideArrow,
      time,
      selectedDate,
      collapse,
      hideTime,
    } = this.props
    const {
      timeIndex,
    } = this.state; 
    let dayjsDate: Dayjs = dayjs(generateDate)


    if(collapse) {
      const dayjsSelectData = dayjs(selectedDate.start);
      if(!dayjsSelectData.isBefore(dayjsDate) && !dayjsSelectData.isAfter(dayjsDate.add(6, 'day'))) {
        dayjsDate = dayjsSelectData
      }
      
    }

    
    const dayjsMinDate: Dayjs | boolean = !!minDate && dayjs(minDate)
    const dayjsMaxDate: Dayjs | boolean = !!maxDate && dayjs(maxDate)

    const isMinMonth: boolean =
      dayjsMinDate && dayjsMinDate.startOf('month').isSame(dayjsDate)

    const isMaxMonth: boolean =
      dayjsMaxDate && dayjsMaxDate.startOf('month').isSame(dayjsDate)

    const minDateValue: string = dayjsMinDate
      ? dayjsMinDate.format('YYYY-MM-DD')
      : ''
    const maxDateValue: string = dayjsMaxDate
      ? dayjsMaxDate.format('YYYY-MM-DD')
      : ''

    return (
      <View className='at-calendar__controller controller'>
        {hideArrow ? null : (
          <View
            className={classnames('controller__arrow controller__arrow--left', {
              'controller__arrow--disabled': isMinMonth
            })}
            onClick={this.props.onPreMonth.bind(this, isMinMonth)}
          />
        )}
        <Picker
          mode='date'
          fields='month'
          end={maxDateValue}
          start={minDateValue}
          onChange={this.props.onSelectDate}
          onCancel={this.props.onCancel}
          value={dayjsDate.format('YYYY-MM-DD')}
        >
          <Text className='controller__info'>
            {dayjsDate.format(monthFormat)}
          </Text>
        </Picker>
        {!hideTime && <Picker
          mode="multiSelector"
          range={this.timeArray}
          onChange={this.handleOnTimeChange}
          onCancel={this.props.onCancel}
          value={timeIndex}
        >
          <Text className='controller__info controller__info--time'>
            {time}
          </Text>
        </Picker>
        }
        {hideArrow ? null : (
          <View
            className={classnames(
              'controller__arrow controller__arrow--right',
              {
                'controller__arrow--disabled': isMaxMonth
              }
            )}
            onClick={this.props.onNextMonth.bind(this, isMaxMonth)}
          />
        )}
        <View className="controller__info--extra">{this.props.renderExtra}</View>
      </View>
    )
  }
}
