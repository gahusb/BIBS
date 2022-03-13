import React, { Component } from 'react';
import Header from 'components/common/Header';
import { withRouter } from 'react-router-dom';
import * as baseActions from 'store/modules/base';
import * as ListActions from 'store/modules/list';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class HeaderContainer extends Component {
  handleUserLogUpClick = async () => {
    const { BaseActions } = this.props;
    
    BaseActions.showModal('userLogup');
    BaseActions.initializeUserLogupModal();
  }

  // 관리자 로그인 Header에서는 안쓰임
  handleLoginClick = async () => {
    const { BaseActions, logged } = this.props;
    if(logged) {
        try {
            await BaseActions.logout();
            window.location.reload(); // 페이지 새로고침
        } catch(e) {
            console.log(e);
        }
        return;
    }
    BaseActions.showModal('login');
    BaseActions.initializeLoginModal();
  }

  handleUserLogInClick = async () => {
    const { BaseActions, userLogged } = this.props;
    console.log('userLogged : ' + userLogged);
    if(userLogged) {
        try {
            await BaseActions.userLogout();
            window.location.reload(); // 페이지 새로고침
        } catch(e) {
            console.log(e);
        }
        return;
    }
    BaseActions.showModal('userLogin');
    BaseActions.initializeUserLoginModal();
  }
  
  handleRemove = () => {
    const { BaseActions } = this.props;
    BaseActions.showModal('remove');
  }

  render() {
    const { handleRemove, handleUserLogUpClick, handleUserLogInClick } = this;
    const { loading, match, logged, userLogged } = this.props;

    if(loading) return null;

    const { id } = match.params;
    return (
      <Header 
        postId={id}
        logged={logged}
        userLogged={userLogged}
        onRemove={handleRemove}
        onUserLogUp={handleUserLogUpClick}
        onUserLogIn={handleUserLogInClick}
      />
    );
  }
}

export default connect(
  (state) => ({
    logged: state.base.get('logged'),
    userLogged: state.base.get('userLogged'),
    loading: state.pender.pending['list/GET_USERID_LIST']
  }),
  (dispatch) => ({
    BaseActions: bindActionCreators(baseActions, dispatch)
  })
)(withRouter(HeaderContainer));
