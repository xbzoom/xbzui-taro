import bind from 'bind-decorator';

import Taro, { Component, Config } from '@tarojs/taro';
import { View, Button } from '@tarojs/components';
import dayjs from 'dayjs';

import AtButton from '../../../components/button/index';

import './index.scss';

import DocsHeader from '../../components/doc-header';
import AtCalendar from '../../../components/calendar/index';

export default class Index extends Component {
  config: Config = {
    navigationBarTitleText: 'Taro日历组件展示'
  };

  state = {
    now: Date.now(),
    minDate: '2018/06/11',
    maxDate: '2020/12/12',
    multiCurentDate: {
      start: Date.now()
    },
    hideTime: true,
    currentDate: dayjs().format('YYYY-MM-DD'),
    collapse: true,
    mark: [
      {
        value: '2019/12/21',
        normal: true,
      },
      {
        value: '2019/12/22',
        normal: false,
      },
      {
        value: '2018/09/03',
        normal: true,
      }
    ]
  };

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  @bind
  handleClick(key: string, value: string) {
    this.setState({
      [key]: value
    });
  }

  @bind
  handleDayClick(...arg) {
    console.log('handleDayClick', arg);
  }

  @bind
  handleDayLongClick(...arg) {
    console.log('handleDayLongClick', arg);
  }

  @bind
  handleDateChange(arg) {
    console.log('handleDateChange', arg);
  }

  @bind
  handleMonthChange(arg) {
    console.log('handleMonthChange', arg);
  }
  handleCollapse() {
    this.setState({
      collapse: !this.state.collapse
      // hideTime: !this.state.hideTime,
    });
  }
  handleSelectDate(e) {
    console.log('handleSelectDate', e);
  }

  render() {
    const {
      now,
      minDate,
      maxDate,
      mark,
      multiCurentDate,
      collapse,
      currentDate,
      hideTime
    } = this.state;
    return (
      <View className="page calendar-page">
        <DocsHeader title="Calendar 日历" />

        <View className="doc-body">
          <View className="panel">
            <View className="panel__title">一般案例</View>
            <View className="panel__content">
              <AtCalendar
                collapse={collapse}
                onSelectDate={this.handleSelectDate}
                onMonthChange={this.handleMonthChange}
                currentDate={currentDate}
                marks={mark}
                hideTime={hideTime}
                time="06:30"
                renderExtra={<View>343434</View>}
              />
            </View>
            <Button onClick={this.handleCollapse.bind(this)}>
              {!collapse ? '折叠' : '展开'}
            </Button>
          </View>
          {/* skb985J8LEmj5VPyu3N+9J+8suw= */}
          {/* <View className='panel'>
            <View className='panel__title'>跳转到指
            定日期</View>
            <View className='panel__content'>
              <AtCalendar currentDate={now} />
              <View className='body_controllers'>
                <AtButton
                  size='small'
                  onClick={this.handleClick.bind(this, 'now', '2018/01/01')}
                >
                  跳转到 2018/01/01
                </AtButton>
                <AtButton
                  size='small'
                  onClick={this.handleClick.bind(this, 'now', '2018/06/18')}
                >
                  跳转到 2018/6/18
                </AtButton>
              </View>
            </View>
          </View>

          <View className='panel'>
            <View className='panel__title'>指定最小日期和最大日期</View>
            <View className='panel__content'>
              <AtCalendar minDate={minDate} maxDate={maxDate} />
              <View className='body_controllers'>
                <AtButton
                  size='small'
                  onClick={this.handleClick.bind(this, 'minDate', '2018/01/01')}
                >
                  设置最小值 2018/1/1
                </AtButton>
                <AtButton
                  size='small'
                  onClick={this.handleClick.bind(this, 'maxDate', '2018/12/31')}
                >
                  设置最大值 2018/12/31
                </AtButton>
              </View>
            </View>
          </View>

          <View className='panel'>
            <View className='panel__title'>标记时间</View>
            <View className='panel__content'>
              <AtCalendar marks={mark} />
              <View className='body_controllers'>
                <AtButton
                  size='small'
                  className='button'
                  onClick={this.handleClick.bind(this, 'mark', [
                    {
                      value: Date.now()
                    }
                  ])}
                >
                  标记当前时间
                </AtButton>
              </View>
            </View>
          </View>

          <View className='panel'>
            <View className='panel__title'>禁止滑动</View>
            <View className='panel__content'>
              <AtCalendar isSwiper={false} />
            </View>
          </View>

          <View className='panel'>
            <View className='panel__title'>垂直滑动</View>
            <View className='panel__content'>
              <AtCalendar isVertical onSelectDate={this.handleDateChange}/>
            </View>
          </View>

          <View className='panel'>
            <View className='panel__title'>范围选择</View>
            <View className='panel__content'>
              <AtCalendar
                onSelectDate={this.handleDateChange}
                isMultiSelect
                currentDate={multiCurentDate}
              />
              <View className='body_controllers'>
                <AtButton
                  size='small'
                  className='button'
                  onClick={this.handleClick.bind(this, 'multiCurentDate', {
                    start: '2018/10/28',
                    end: '2018/11/11'
                  })}
                >
                  设置选择区间为 2018/10/28 - 2018/11/11
                </AtButton>
              </View>
            </View>
          </View>*/}
        </View>
      </View>
    );
  }
}
