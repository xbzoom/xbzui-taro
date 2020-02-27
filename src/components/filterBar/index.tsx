import { ComponentType, ReactNode } from 'react';
import Taro, { Component, Config } from '@tarojs/taro';
import { AtIcon, AtToast } from 'taro-ui';
import classnames from 'classnames';
import { View, Button, Text, Image, ScrollView } from '@tarojs/components';
import FilterItem from './filterItem';
import { selectEnabledJobs } from '@/api/work';

import MyTag from '@/components/myTag/index';
import checkedSrc from '@/public/images/checked.png';

import './index.scss';

interface ComponentProps {
  title?: String;
  children?: ReactNode;
  confirmEmit?: (val: any) => void;
  chooseSingleEmit?: (val: any) => void;
}

interface ComponentState {
  visible: Boolean;
  singleArr1: Array<any>;
  asyncTag: Array<any>;
  prevAsyncTag: Array<any>;
  settlementTypesArr: Array<any>;
  prevSettlementTypesArr: Array<any>;
  workPeriodArr: Array<any>;
  prevWorkPeriodArr: Array<any>;
  singleCurrent: Number;
  single2Current: Number;
  open1: Boolean;
  open2: Boolean;
  open3: Boolean;
  open4: Boolean;
  filter1Text: String;
  filter2Text: String;
  filter3Text: String;
  filter4Text: String;
}

class FilterBar extends Component<ComponentProps, ComponentState> {
  constructor(props) {
    super(props);
  }

  state = {
    visible: false,
    singleArr1: [
      {
        id: 1,
        name: '不限',
        value: 1
      },
      {
        id: 2,
        name: '1km以内',
        value: 1
      },
      {
        id: 3,
        name: '3km以内',
        value: 3
      },
      {
        id: 4,
        name: '5km以内',
        value: 5
      },
      {
        id: 5,
        name: '10km以内',
        value: 10
      },
      {
        id: 6,
        name: '20km以内',
        value: 20
      }
    ],
    asyncTag: [],
    prevAsyncTag: [],
    singleCurrent: 1,
    tagCurrent: 1,
    open1: false,
    filter1Text: '更多筛选',
    open2: false,
    open3: false,
    filter2Text: '工作距离',
    filter3Text: '全部职位',
    filter4Text: '空闲时间',
    open4: false,
    singleArr2: [
      {
        id: 1,
        name: '不限',
        value: 0
      },
      {
        id: 2,
        name: '周末/节假日',
        value: 1
      },
      {
        id: 3,
        name: '工作日',
        value: 2
      },
      {
        id: 4,
        name: '寒暑假',
        value: 3
      }
    ],
    single2Current: 1,
    settlementTypesArr: [
      {
        id: 1,
        name: '不限',
        value: 0,
        active: true
      },
      {
        id: 2,
        name: '日结',
        value: 1,
        active: false
      },
      {
        id: 3,
        name: '周结',
        value: 2,
        active: false
      },
      {
        id: 4,
        name: '月结',
        value: 3,
        active: false
      },
      {
        id: 5,
        name: '完工结',
        value: 4,
        active: false
      }
    ],
    prevSettlementTypesArr: [],
    workPeriodArr: [
      {
        id: 1,
        name: '不限',
        value: 2,
        active: true
      },
      {
        id: 2,
        name: '长期工作',
        value: 1,
        active: false
      },
      {
        id: 3,
        name: '短期工作',
        value: 0,
        active: false
      }
    ],
    prevWorkPeriodArr: []
  };

  chooseSingle = ({ num, name, value }) => {
    if (name === 'filter1') {
      this.setState({
        filter1Text: `${value}`,
        open1: false,
        singleCurrent: num
      });
    } else if (name === 'filter2') {
      this.setState({
        filter2Text: num !== 1 ? `${value}` : '工作距离',
        open2: false,
        singleCurrent: num
      }, () => {
        this.props.chooseSingleEmit && this.props.chooseSingleEmit({distance: value.slice(0, -4)});
      });
    } else if (name === 'filter4') {
      this.setState({
        filter4Text: num !== 1 ? `${value}` : '空闲时间',
        open4: false,
        single2Current: num
      }, () => {
        this.props.chooseSingleEmit && this.props.chooseSingleEmit({workTime: num});
      });
    }
  };
  // 切换FilterItem
  triggleOpen = (name) => {
    const { open1, open2, open3, open4 } = this.state;
    if (open1 && name === 'filter1') return;
    if (open2 && name === 'filter2') return;
    if (open3 && name === 'filter3') return;
    if (open4 && name === 'filter4') return;
    this.setState({
      open1: name === 'filter1',
      open2: name === 'filter2',
      open3: name === 'filter3',
      open4: name === 'filter4',
      prevAsyncTag: [],
      prevSettlementTypesArr: [],
      prevWorkPeriodArr: []
    });
  };
  // 关闭FilterItem
  closeFilter = (name) => {
    this.setState({
      open1: false,
      open2: false,
      open3: false,
      open4: false
    });
  };
  // 带全部/不限 互斥标签
  dealRejectTag = (arr1, arr2, aimTag) => {
    let arr = !arr2.length ? JSON.parse(JSON.stringify(arr1)) : JSON.parse(JSON.stringify(arr2));
    arr.forEach((item) => {
      if (aimTag.id === 0) {
        if (!aimTag.active) {
          if (item.id === 0) {
            item.active = true;
          } else {
            item.active = false;
          }
        }
      } else {
        if (item.id === 0) {
          item.active = false;
        }
        if (item.id === aimTag.id) {
          item.active = !aimTag.active;
        }
      }
    });
    let len = arr.filter((item2) => item2.active && item2.id !== 0).length;
    arr.forEach((item, idx, arr) => {
      if (!len && item.id === 0) {
        item.active = true;
      }
    });

    return arr;
  };
  // 互斥标签
  dealNormalTag = (arr1, arr2, aimTag) => {
    let arr = !arr2.length ? JSON.parse(JSON.stringify(arr1)) : JSON.parse(JSON.stringify(arr2));
    arr.forEach((item) => {
      if (item.id === aimTag.id) {
        item.active = true;
      } else {
        item.active = false;
      }
    });
    return arr;
  };
  // 标签选择
  tagTrigger = (tag, type) => {
    const {
      asyncTag,
      prevAsyncTag,
      settlementTypesArr,
      prevSettlementTypesArr,
      workPeriodArr,
      prevWorkPeriodArr
    } = this.state;
    let preArr;
    switch (type) {
      case 'type1':
        preArr = this.dealRejectTag(asyncTag, prevAsyncTag, tag);
        this.setState({
          prevAsyncTag: preArr
        });
        break;
      case 'type2':
        preArr = this.dealRejectTag(settlementTypesArr, prevSettlementTypesArr, tag);
        this.setState({
          prevSettlementTypesArr: preArr
        });
        break;
      case 'type3':
        preArr = this.dealNormalTag(workPeriodArr, prevWorkPeriodArr, tag);
        this.setState({
          prevWorkPeriodArr: preArr
        });
        break;

      default:
        break;
    }
  };

  reset = () => {
    const { asyncTag, prevAsyncTag } = this.state;
    let preArr = !prevAsyncTag.length ? JSON.parse(JSON.stringify(asyncTag)) : JSON.parse(JSON.stringify(prevAsyncTag));
    preArr.forEach((item: { id: number; active: boolean }) => {
      if (item.id === 0) {
        item.active = true;
      } else {
        item.active = false;
      }
    });
    this.setState({
      prevAsyncTag: preArr
    });
  };

  confirm = () => {
    const { prevAsyncTag, asyncTag } = this.state;
    let arr = prevAsyncTag && prevAsyncTag.length ? prevAsyncTag : asyncTag;
    let filterArr = arr.filter((item: { id: number; active: boolean }) => item.id !== 0 && item.active)
    let filterNum = filterArr.length;
    let text = filterNum ? `期望职位(${filterNum})` : '全部职位';
    this.setState({
      asyncTag: arr,
      filter3Text: text
    }, () => {

      const idArr = filterArr.map((item: {id: number}) => item.id);
      this.props.confirmEmit && this.props.confirmEmit({jobIds: idArr});
    });
    this.closeFilter('filter3');
  };

  resetFilter1 = () => {
    const { settlementTypesArr, prevSettlementTypesArr, workPeriodArr, prevWorkPeriodArr } = this.state;
    let preArr1 = !prevSettlementTypesArr.length
      ? JSON.parse(JSON.stringify(settlementTypesArr))
      : JSON.parse(JSON.stringify(prevSettlementTypesArr));
    let preArr2 = !prevWorkPeriodArr.length
      ? JSON.parse(JSON.stringify(workPeriodArr))
      : JSON.parse(JSON.stringify(prevWorkPeriodArr));
    preArr1.forEach((item: { id: number; active: boolean }) => {
      if (item.id === 1) {
        item.active = true;
      } else {
        item.active = false;
      }
    });
    preArr2.forEach((item: { id: number; active: boolean }) => {
      if (item.id === 1) {
        item.active = true;
      } else {
        item.active = false;
      }
    });
    this.setState({
      prevSettlementTypesArr: preArr1,
      prevWorkPeriodArr: preArr2
    });
  };

  confirmFilter1 = () => {
    const { settlementTypesArr, prevSettlementTypesArr, workPeriodArr, prevWorkPeriodArr } = this.state;
    let text;
    let arr1 = prevSettlementTypesArr && prevSettlementTypesArr.length ? prevSettlementTypesArr : settlementTypesArr;
    let arr2 = prevWorkPeriodArr && prevWorkPeriodArr.length ? prevWorkPeriodArr : workPeriodArr;
    let filterArr1 = arr1.filter((item: { id: number; active: boolean }) => item.id !== 1 && item.active);
    let filterArr2 = arr2.filter((item: { id: number; active: boolean }) => item.id !== 1 && item.active);
    let filterNum1 = filterArr1.length;
    let filterNum2 = filterArr2.length;
    if (filterNum1 || filterNum2) {
      text = '更多筛选 ';
    } else {
      text = '更多筛选';
    }

    this.setState({
      settlementTypesArr: arr1,
      workPeriodArr: arr2,
      filter1Text: text
    }, () => {
      const idArr1 = filterArr1.map((item: {id: number, value: number}) => item.value);
      const idArr2 = filterArr2.map((item: {id: number, value: number}) => item.value);
      this.props.confirmEmit && this.props.confirmEmit({settlementTypes: idArr1, workPeriod: idArr2});
    });

    this.closeFilter('filter1');
  };

  renderFilter3 = () => {
    const { asyncTag, prevAsyncTag } = this.state;
    let arr :Array<any> = prevAsyncTag && prevAsyncTag.length ? prevAsyncTag : asyncTag;
    return arr.map((item, index) => (
      <MyTag
        tagTrigger={() => this.tagTrigger(item, 'type1')}
        value={item.active}
        key={item.id}
        disable={item.id === 0}
        title={item.name}
        defaultValue={item.active}
      />
    ));
  };

  renderSettlementType = () => {
    const { settlementTypesArr, prevSettlementTypesArr } = this.state;
    let arr = prevSettlementTypesArr && prevSettlementTypesArr.length ? prevSettlementTypesArr : settlementTypesArr;
    return arr.map((item: { active: boolean; id: number; name: string }) => {
      return (
        <MyTag
          tagTrigger={() => this.tagTrigger(item, 'type2')}
          value={item.active}
          key={item.id}
          disable={item.id === 1}
          title={item.name}
          defaultValue={item.active}
          limitStyle={false}
        />
      );
    });
  };

  renderWorkPeriod = () => {
    const { workPeriodArr, prevWorkPeriodArr } = this.state;
    let arr = prevWorkPeriodArr && prevWorkPeriodArr.length ? prevWorkPeriodArr : workPeriodArr;
    return arr.map((item) => {
      return (
        <MyTag
          tagTrigger={() => this.tagTrigger(item, 'type3')}
          value={item.active}
          key={item.id}
          disable={item.id === 1}
          title={item.name}
          defaultValue={item.active}
          limitStyle={false}
        />
      );
    });
  };

  async componentDidMount() {
    try {
      const { data } = await selectEnabledJobs();
      const resArr = data.map((item) => {
        return {
          id: item.id,
          name: item.name,
          active: false
        };
      });
      resArr.unshift({ id: 0, name: '全部', active: true });
      this.setState({
        asyncTag: resArr
      });
    } catch (error) {}
  }

  touchMove = (e) => {
    e.stopPropagation();
    return false
  }

  render() {
    const {
      singleArr1,
      singleCurrent,
      open1,
      open2,
      filter1Text,
      filter3Text,
      open3,
      open4,
      singleArr2,
      single2Current,
      filter4Text,
      filter2Text
    } = this.state;
    return (
      <View className="filterBarWrap" onTouchMove={this.touchMove}>
        <FilterItem
          triggleOpen={this.triggleOpen.bind(this, 'filter3')}
          closeFilter={this.closeFilter.bind(this, 'filter3')}
          reset={this.reset.bind(this, 'filter3')}
          confirm={this.confirm.bind(this, 'filter3')}
          open={open3}
          text={filter3Text}
          hasFooter
          type="async"
        >
          <ScrollView scroll-y className="scrollview">
            {open3 && this.renderFilter3()}
          </ScrollView>
        </FilterItem>

        <FilterItem
          triggleOpen={this.triggleOpen.bind(this, 'filter4')}
          closeFilter={this.closeFilter.bind(this, 'filter4')}
          open={open4}
          text={filter4Text}
          type="single"
        >
          {open4 &&
            singleArr2.map((item, index, arr) => (
              <View
                key={item.id}
                className={classnames({
                  singleItemAct: single2Current === item.id,
                  singleItem: true,
                  noBorder: index === arr.length - 1
                })}
                onClick={() => this.chooseSingle({ num: item.id, name: 'filter4', value: item.name })}
              >
                <span>{item.name}</span>
                {single2Current === item.id && <Image className="checkedImg" src={checkedSrc} />}
              </View>
            ))}
        </FilterItem>
        <FilterItem
          triggleOpen={this.triggleOpen.bind(this, 'filter2')}
          closeFilter={this.closeFilter.bind(this, 'filter2')}
          open={open2}
          text={filter2Text}
          type="single"
        >
          {open2 &&
            singleArr1.map((item, index, arr) => (
              <View
                key={item.id}
                className={classnames({
                  singleItemAct: singleCurrent === item.id,
                  singleItem: true,
                  noBorder: index === arr.length - 1
                })}
                onClick={() => this.chooseSingle({ num: item.id, name: 'filter2', value: item.name })}
              >
                <span>{item.name}</span>
                {singleCurrent === item.id && <Image className="checkedImg" src={checkedSrc} />}
              </View>
            ))}
          <View className="tipWrap">
            <span className="tipIcon">
              <AtIcon value="alert-circle" size="16" color="#dd3740" />
            </span>
            <span className="tip">根据您当前工作出发地计算</span>
          </View>
        </FilterItem>
        <FilterItem
          triggleOpen={this.triggleOpen.bind(this, 'filter1')}
          closeFilter={this.closeFilter.bind(this, 'filter1')}
          open={open1}
          text={filter1Text}
          hasFooter
          confirm={() => this.confirmFilter1()}
          reset={() => this.resetFilter1()}
          type="single"
        >
          <View className="filterItemWrap">
            <View className="filterItemTit">结算方式(可多选)</View>
            <View className="filterItemCon">{this.renderSettlementType()}</View>
            <View className="filterItemTit">工作周期</View>
            <View className="filterItemCon">{this.renderWorkPeriod()}</View>
          </View>
        </FilterItem>
      </View>
    );
  }
}

export default FilterBar;
