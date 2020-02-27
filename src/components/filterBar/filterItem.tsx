import { ReactNode } from 'react';
import Taro, { Component, Config } from '@tarojs/taro';
import { View } from '@tarojs/components';
import classnames from 'classnames';
import './filterItem.scss';

interface ComponentProps {
  text?: String;
  children?: ReactNode;
  type?: 'single' | 'multiply' | 'async';
  hasFooter?: Boolean;
  open: Boolean;
  triggleOpen?: () => void;
  closeFilter?: () => void;
  reset?: () => void;
  confirm?: () => void;
  tagArr?: Array<any>;
}

interface ComponentState {
  visible: Boolean;
  initText?: String;
}

class FilterItem extends Component<ComponentProps, ComponentState> {
  tagNode: any;
  constructor(props) {
    super(props);
  }

  state = {
    visible: false,
    initText: this.props.text
  };

  touchFilter = (e) => {
    const { triggleOpen } = this.props;
    triggleOpen && triggleOpen();
  };

  closeFilter = () => {
    const { closeFilter } = this.props;
    closeFilter && closeFilter();
  };

  confirm = () => {
    this.props.confirm && this.props.confirm();
  };

  reset = () => {
    this.props.reset && this.props.reset();
  };

  touchMove = (e) => {
    e.stopPropagation();
    return false
  }

  render() {
    const { text, hasFooter = false, type, open } = this.props;
    const { initText } = this.state;

    const classObject = {
      single: true
    };
    return (
      <View onTouchMove={(e) => this.touchMove(e)}>
        <View
          className={classnames({ filterItemWrap: true, filterItemWrapAct: open || initText !== text })}
          onClick={this.touchFilter.bind(this)}
          onTouchMove={(e) => this.touchMove(e)}
        >
          <View className="filterText">{text}</View>
          <span />
        </View>
        {open && (
          <View className="filter" onTouchMove={(e) => this.touchMove(e)}>
            {
              <View className="filterContent">
                {type === 'single' && <View className="single">{this.props.children}</View>}
                {type === 'async' && (
                  <View ref={(node) => (this.tagNode = node)} className={classnames(classObject)}>
                    {this.props.children}
                  </View>
                )}
                {hasFooter && (
                  <View className="confirmBar">
                    <View className="reset" onClick={this.reset.bind(this)}>
                      重置
                    </View>
                    <View className="confirm" onClick={this.confirm.bind(this)}>
                      确认
                    </View>
                  </View>
                )}
              </View>
            }
            <View className="filterMask" onClick={() => this.closeFilter()} />
          </View>
        )}
      </View>
    );
  }
}

export default FilterItem;
