import React, { Component } from 'react';
import UserLoginModal from 'components/modal/UserLoginModal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as baseActions from 'store/modules/base';

class UserLoginModalContainer extends Component {
  handleUserLogin = async () => {
    const { BaseActions, userId, userPassword } = this.props;
    try {
      // 로그인 시도, 성공하면 모달 닫기
      await BaseActions.userLogin(userId, userPassword);
      BaseActions.hideModal('userLogin');
      window.location.reload();
    } catch(e) {
      console.log(e);
    }
  }
  handleCancel = () => {
    const { BaseActions } = this.props;
    BaseActions.hideModal('userLogin');
  }
  handleIdChange = (e) => {
    const { value } = e.target;
    const { BaseActions } = this.props;
    BaseActions.changeLoginIdInput(value);
  }
  handlePasswordChange = (e) => {
    const { value } = e.target;
    const { BaseActions } = this.props;
    BaseActions.changeLoginPasswordInput(value);
  }
  handleKeyPress = (e) => {
    // 엔터 키를 누르면 로그인 호출 되도록
    if(e.key === 'Enter') {
      this.handleUserLogin();
    }
  }

  render() {
    const {
      handleUserLogin, handleCancel, handleIdChange, handlePasswordChange, handleKeyPress
    } = this;
    const { visible, error, userId, userPassword } = this.props;

    return (
      <UserLoginModal
        onUserLogin={handleUserLogin} onCancel={handleCancel}
        onIdChange={handleIdChange} onPassChange={handlePasswordChange} onKeyPress={handleKeyPress}
        visible={visible} error={error} userId={userId} userPassword={userPassword}
      />
    );
  }
}

export default connect(
  (state) => ({
    visible: state.base.getIn(['modal', 'userLogin']),
    userId: state.base.getIn(['userLoginModal', 'userId']),
    userPassword: state.base.getIn(['userLoginModal', 'userPassword']),
    error: state.base.getIn(['userLoginModal', 'error'])
  }),
  (dispatch) => ({
    // bindActionCreators 는 액션함수들을 자동으로 바인딩해준다.
    BaseActions: bindActionCreators(baseActions, dispatch)
  })
)(UserLoginModalContainer);
