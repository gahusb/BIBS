import React from 'react';
import styles from './intro.scss';
import classNames from 'classnames/bind';
import HeaderContainer from 'containers/common/HeaderContainer';
import FooterContainer from 'containers/common/FooterContainer';
import Button from 'components/common/Button';

const cx = classNames.bind(styles);

class Intro extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }; 
  }
  
  componentDidMount() {
  }

  render(){
    return (
      <div className={cx('page-template')}>
        <HeaderContainer/>
          <div className={cx('background')}>
            <div className={cx('button', 'vc', 'hc')}>
              <Button theme="outline" to="/page">Hello BIBS!</Button>
            </div>
          </div>
        <FooterContainer/>
      </div>
    );
  }
};

export default Intro;