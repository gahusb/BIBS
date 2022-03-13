import React, { Component } from 'react';
import UserLogupModal from 'components/modal/UserLogupModal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as baseActions from 'store/modules/base';

class UserLogupModalContainer extends Component {
  handleUserLogup = async () => {
    const { BaseActions, userId, userPassword } = this.props;
    try {
      // 회원가입 시도, 성공하면 모달 닫기
      await BaseActions.userLogup(userId, userPassword);
      BaseActions.hideModal('userLogup');
    } catch(e) {
      console.log(e);
    }
  }
  handleCancel = () => {
    const { BaseActions } = this.props;
    BaseActions.hideModal('userLogup');
  }
  handleIdChange = (e) => {
    const { value } = e.target;
    const { BaseActions } = this.props;
    BaseActions.changeLogupIdInput(value);
  }
  handlePasswordChange = (e) => {
    const { value } = e.target;
    const { BaseActions } = this.props;
    BaseActions.changeLogupPasswordInput(value);
  }
  handleKeyPress = (e) => {
    // 엔터 키를 누르면 로그인 호출 되도록
    if(e.key === 'Enter') {
      this.handleUserLogup();
    }
  }

  render() {
    const {
      handleUserLogup, handleCancel, handleIdChange, handlePasswordChange, handleKeyPress
    } = this;
    const { visible, error, userId, userPassword } = this.props;
    return (
      <UserLogupModal
        onUserLogup={handleUserLogup} onCancel={handleCancel}
        onIdChange={handleIdChange} onPassChange={handlePasswordChange} onKeyPress={handleKeyPress}
        visible={visible} error={error} userId={userId} userPassword={userPassword}
      />
    );
  }
}

export default connect(
  (state) => ({
    visible: state.base.getIn(['modal', 'userLogup']),
    userId: state.base.getIn(['userLogupModal', 'userId']),
    userPassword: state.base.getIn(['userLogupModal', 'userPassword']),
    error: state.base.getIn(['userLogupModal', 'error'])
  }),
  (dispatch) => ({
    // bindActionCreators 는 액션함수들을 자동으로 바인딩해준다.
    BaseActions: bindActionCreators(baseActions, dispatch)
  })
)(UserLogupModalContainer);
