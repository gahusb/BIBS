import { createAction, handleActions } from 'redux-actions';

import { Map, List, fromJS } from 'immutable';
import { pender } from 'redux-pender';
import * as api from 'lib/api';

// action types
const SHOW_MODAL = 'base/SHOW_MODAL';
const HIDE_MODAL = 'base/HIDE_MODAL';

const LOGIN = 'base/LOGIN';
const LOGOUT = 'base/LOGOUT';
const CHECK_LOGIN = 'base/CHECK_LOGIN';
const CHANGE_PASSWORD_INPUT = 'base/CHANGE_PASSWORD_INPUT';
const INITIALIZE_LOGIN_MODAL = 'base/INITIALIZE_LOGIN_MODAL';
const TEMP_LOGIN = 'base/TEMP_LOGIN';

const USERLOGIN = 'base/USERLOGIN';
const USERLOGOUT = 'base/USERLOGOUT';
const USERLOGUP = 'base/USERLOGUP';
const CHECK_USER_LOGIN = 'base/CHECK_USER_LOGIN';

const CHANGE_LOGIN_ID_INPUT = 'base/CHANGE_LOGIN_ID_INPUT';
const CHANGE_LOGIN_PASSWORD_INPUT = 'base/CHANGE_LOGIN_PASSWORD_INPUT';

const CHANGE_LOGUP_ID_INPUT = 'base/CHANGE_LOGUP_ID_INPUT';
const CHANGE_LOGUP_PASSWORD_INPUT = 'base/CHANGE_LOGUP_PASSWORD_INPUT';

const INITIALIZE_USER_LOGIN_MODAL = 'base/INITIALIZE_USER_LOGIN_MODAL';
const INITIALIZE_USER_LOGUP_MODAL = 'base/INITIALIZE_USER_LOGUP_MODAL';

// const GPS = 'base/GPS';
// const INITIALIZE_GPS_MODAL = 'base/INITIALIZE_GPS_MODAL';

// action creators
export const showModal = createAction(SHOW_MODAL);
export const hideModal = createAction(HIDE_MODAL);

export const login = createAction(LOGIN, api.login);
export const logout = createAction(LOGOUT, api.logout);
export const checkLogin = createAction(CHECK_LOGIN, api.checkLogin);
export const changePasswordInput = createAction(CHANGE_PASSWORD_INPUT);
export const initializeLoginModal = createAction(INITIALIZE_LOGIN_MODAL);
export const tempLogin = createAction(TEMP_LOGIN);

export const userLogin = createAction(USERLOGIN, api.userLogin);
export const userLogout = createAction(USERLOGOUT, api.userLogout);
export const userLogup = createAction(USERLOGUP, api.userLogup);
export const checkUserLogin = createAction(CHECK_USER_LOGIN, api.checkUserLogin);

export const changeLoginIdInput = createAction(CHANGE_LOGIN_ID_INPUT);
export const changeLoginPasswordInput = createAction(CHANGE_LOGIN_PASSWORD_INPUT);
export const changeLogupIdInput = createAction(CHANGE_LOGUP_ID_INPUT);
export const changeLogupPasswordInput = createAction(CHANGE_LOGUP_PASSWORD_INPUT);

export const initializeUserLoginModal = createAction(INITIALIZE_USER_LOGIN_MODAL);
export const initializeUserLogupModal = createAction(INITIALIZE_USER_LOGUP_MODAL);

// export const gps = createAction(GPS, api.gps);
// export const initializeGpsModal = createAction(INITIALIZE_GPS_MODAL);

// initial state
const initialState = Map({
    // Modal의 가시성 상태
    modal: Map({
        remove: false,
        loginState: false
    }),
    loginModal: Map({
        password: '',
        error: false
    }),
    userLoginModal: Map({
        userId: '',
        userPassword: '',
        error: false
    }),
    userLogupModal: Map({
        userId: '',
        userPassword: '',
        error: false
    }),
    // gpsModal: Map({
    //     lat: '',
    //     lon: '',
    //     error: false
    // }),
    userList: Map({
        posts: List(),
        lastPage: null,
        error: false
    }),
    logged: false, // 현재 로그인 상태
    userLogged: false,
    loginUserId : ''
});

// reducer
export default handleActions({
    [SHOW_MODAL]: (state, action) => {
        const { payload: modalName } = action;
        return state.setIn(['modal', modalName], true);
    },
    [HIDE_MODAL]: (state, action) => {
        const { payload: modalName } = action;
        return state.setIn(['modal', modalName], false);
    },

    ...pender({
        type: LOGIN,
        onSuccess: (state, action) => { // 로그인 성공할 때
            return state.set('logged', true);
        },
        onError: (state, action) => {
            return state.setIn(['loginModal', 'error'], true)
                        .setIn(['loginModal', 'password'], '');
        }
    }),
    ...pender({
        type: CHECK_LOGIN,
        onSuccess: (state, action) => {
            const { logged } = action.payload.data;
            return state.set('logged', logged);
        }
    }),
    [CHANGE_PASSWORD_INPUT]: (state, action) => {
        const { payload: value } = action;
        return state.setIn(['loginModal', 'password'], value);
    },
    [INITIALIZE_LOGIN_MODAL]: (state, action) => {
        // 로그인 모달의 상태를 초기 상태로 설정(텍스트/오류 초기화)
        return state.set('loginModal', initialState.get('loginModal'));
    },
    [TEMP_LOGIN]: (state, action) => {
        return state.set('logged', true)
                    .set('userLogged', true);
    },

    ...pender({
        type: USERLOGIN,
        onSucess: (state, action) => {
            const { userId } = action.payload.data;
            console.log(userId);
            return state.set('userLogged', true)
                        .set('loginUserId', userId);
        },
        onError: (state, action) => {
            return state.setIn(['userLoginModal', 'error'], true)
                        .setIn(['userLoginModal', 'userId'], '')
                        .setIn(['userLoginModal', 'userPassword'], '');
        }
    }),
    ...pender({
        type: USERLOGUP,
        onSucess: (state, action) => {
            return state.set('userLogged', false);
        },
        onError: (state, action) => {
            return state.setIn(['userLogupModal', 'error'], true)
                        .setIn(['userLogupModal', 'userId'], '')
                        .setIn(['userLogupModal', 'userPassword'], '');
        }
    }),
    ...pender({
        type: CHECK_USER_LOGIN,
        onSuccess: (state, action) => {
            const { userLogged } = action.payload.data;
            return state.set('userLogged', userLogged);
        }
    }),
    // value가 두번 들어와야 한당
    [CHANGE_LOGIN_ID_INPUT]: (state, action) => {
        const { payload: value } = action;
        return state.setIn(['userLoginModal', 'userId'], value);
    },
    [CHANGE_LOGIN_PASSWORD_INPUT]: (state, action) => {
        const { payload: value2 } = action;
        return state.setIn(['userLoginModal', 'userPassword'], value2);
    },
    [CHANGE_LOGUP_ID_INPUT]: (state, action) => {
        const { payload: value } = action;
        return state.setIn(['userLogupModal', 'userId'], value);
    },
    [CHANGE_LOGUP_PASSWORD_INPUT]: (state, action) => {
        const { payload: value2 } = action;
        return state.setIn(['userLogupModal', 'userPassword'], value2);
    },
    [INITIALIZE_USER_LOGIN_MODAL]: (state, action) => {
        return state.set('userLoginModal', initialState.get('userLoginModal'));
    },
    [INITIALIZE_USER_LOGUP_MODAL]: (state, action) => {
        return state.set('userLogupModal', initialState.get('userLogupModal'));
    },
    // [GPS]: (state, action) => {
    //     const { payload: lat, lon } = state;
    //     return state.setIn(['gpsModal', 'lat'], lat)
    //                 .setIn(['gpsModal', 'lon'], lon);
    // },
    // [INITIALIZE_GPS_MODAL]: (state, action) => {
    //     return state.set('gpsModal', initialState.get('gpsModal'));
    // },
}, initialState)