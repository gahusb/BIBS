import { createAction, handleActions } from 'redux-actions';

import { Map, List, fromJS } from 'immutable';
import { pender } from 'redux-pender';

import * as api from 'lib/api';

// action types
const GET_POST_LIST = 'list/GET_POST_LIST';
// const GET_USERID_LIST = 'list/GET_USERID_LIST';

// action creators
export const getPostList = createAction(GET_POST_LIST, api.getPostList, meta => meta);
// export const getUseridList = createAction(GET_USERID_LIST, api.getUseridList, meta => meta);

// initial state
const initialState = Map({
    posts: List(),
    lastPage: null,
    loginUserId: ''
});

// reducer
export default handleActions({
    ...pender({
        type: GET_POST_LIST,
        onSuccess: (state, action) => {
            const { data: posts } = action.payload;
            console.log('list GET_POST_LIST : ' + posts);
            const lastPage = action.payload.headers['last-page'];
            return state.set('posts', fromJS(posts))
                        .set('lastPage', parseInt(lastPage, 10));
        }
    }),
    // ...pender({
    //     type: GET_USERID_LIST,
    //     onSuccess: (state, action) => {
    //         const { data: posts } = action.payload;
    //         console.log('list GET_USERID_LIST : ' + posts.userId);
    //         const lastPage = action.payload.headers['last-page'];
    //         return state.set('posts', fromJS(posts))
    //                     .set('lastPage', parseInt(lastPage, 10));
    //     }
    // })
}, initialState)