import { ComponentType, ReactNode } from 'react';
import Taro, { Component, Config } from '@tarojs/taro';
import { AtIcon } from '../icon/index';
import { View, Button, Text, Image } from '@tarojs/components';
import loadingpng from '@/public/images/loading.png';
import './index.scss';

interface ComponentProps {
  title?: string;
  children?: ReactNode;
  loading: boolean;
  loadingErr: boolean;
  hasNextPage: boolean;
  noData: boolean;
  renderNodata?: ReactNode;
}

interface ComponentState {
  visible: boolean;
}

class LoadingView extends Component<ComponentProps, ComponentState> {
  constructor(props) {
    super(props);
  }

  state = {
    visible: false
  };

  renderBtm = () => {
    const { loading, loadingErr, hasNextPage, noData } = this.props;
    // if (!loading && !loadingErr && !hasNextPage) {
    //   return null;
    // }
    // console.log(noData, renderNodata)
    if (noData && !loading) {
      return this.props.renderNodata;
    }

    if (loadingErr) {
      return (
        <View className="loadingBtm">
          <View className="icon">
            <AtIcon value="arrow-up" size="16" />
          </View>
          <span>上拉加载更多</span>
        </View>
      );
    }
    if (!hasNextPage) {
      return (
        <View className="loadingBtm">
          <View className="line" />
          <View className="btm">没有更多了～</View>
          <View className="line" />
        </View>
      );
    }
    if (loading) {
      return (
        <View className="loadingBtm">
          <Image className="trans" src={loadingpng} />
          <span>加载中</span>
        </View>
      );
    }

    return null;
  };

  render() {
    return (
      <View className="loadingViewWrap">
        <View className="loadingViewBody">{this.props.children}</View>
        {this.renderBtm()}
      </View>
    );
  }
}

export default LoadingView;
