// import { ReactNode } from 'react';
import Taro, { Component, Config } from '@tarojs/taro';
import { View, Button, Text, Image, Label, Block } from '@tarojs/components';

import shareFri from '../../assets/images/shareFri.png';
import shareCir from '../../assets/images/shareCir.png';

import './index.scss';

interface ComponentProps {
  title?: string;
  children?: any;
  visible: boolean;
  close?: () => void;
  saveCanvas: () => void;
  btnId?: string;
  footer?: any;
}

interface ComponentState {}

export default class ShareCanvas extends Component<ComponentProps, ComponentState> {
  constructor(props) {
    super(props);
  }

  state = {};

  closeCvs = () => {
    this.props.close && this.props.close();
  };

  saveCanvas = () => {
    this.props.saveCanvas && this.props.saveCanvas();
  };

  touchmove = (e) => {
    e.stopPropagation();
  };

  render() {
    const { visible, btnId, footer } = this.props;
    return (
      visible && (
        <View className="shareCanvasWrap" onTouchMove={this.touchmove.bind(this)}>
          <View className="content">
            <View className="canvasWrap" onClick={() => this.closeCvs()}>
              {this.props.children}
            </View>
            <Button id={btnId || 'shareBtn'} openType="share" />
            <View className="footer">
              <View className="toolBar">
                <Label className="footerItem" for={btnId || 'shareBtn'}>
                  <Image src={shareFri} />
                  <Label>
                    <Text>分享给好友</Text>
                  </Label>
                </Label>
                <View className="footerItem" onClick={() => this.saveCanvas()}>
                  <Image src={shareCir} />
                  <Text>分享朋友圈</Text>
                </View>
              </View>
              <View className="barTip">
                {footer ? (
                  footer
                ) : (
                  <Block>
                    <View className="barTipLine">
                      <View className="tipDot" />
                      <View>用户通过你分享的链接注册并认证成功</View>
                      <Text className="mark">获10元</Text>
                    </View>
                    <View className="barTipLine noMargin">
                      <View className="tipDot" />
                      <View>通过你分享的链接报名并确认到岗再</View>
                      <Text className="mark">获20元</Text>
                    </View>
                  </Block>
                )}
              </View>
            </View>
          </View>
        </View>
      )
    );
  }
}

