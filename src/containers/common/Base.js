import React, { Component } from 'react';
import LoginModalContainer from 'containers/modal/LoginModalContainer';
import UserLoginModalContainer from 'containers/modal/UserLoginModalContainer';
import UserLogupModalContainer from 'containers/modal/UserLogupModalContainer';
// import GpsModalContainer from 'containers/modal/GpsModalContainer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as baseActions from 'store/modules/base';
import { inform } from 'lib/shouldCancel';

class Base extends Component {
    initialize = async () => {
        // 로그인 상태 확인
        const { BaseActions } = this.props;
        // 로그인 정보 캐시가 로컬로 남아있다면, 임시 관리자 로그인
        // if(localStorage.logged === "true") {
        //     BaseActions.tempLogin();
        // }
        BaseActions.checkLogin();
        BaseActions.checkUserLogin();
    }
    componentDidMount() {
        this.initialize();
        inform(); // 서버사이드 렌더링을 할 때, cancel 값이 클라이언트 첫 렌더링을 완료하기 전에는 true가 되고 그 이후에는 false
    }
    render() {
        return (
            <div>
                <LoginModalContainer/>
                <UserLoginModalContainer/>
                <UserLogupModalContainer/>
                {/* <GpsModalContainer/> */}
                {
                    /* 전역적으로 사용하는 컴포넌트들이 있다면 여기에 렌더링 */
                }
            </div>
        )
    }
}

export default connect(
    null,
    (dispatch) => ({
        BaseActions: bindActionCreators(baseActions, dispatch)
    })
)(Base);