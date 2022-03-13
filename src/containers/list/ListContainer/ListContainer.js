import React, { Component } from 'react';
import PostList from 'components/list/PostList';
import Pagination from 'components/list/Pagination';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as listActions from 'store/modules/list';
import shouldCancel from 'lib/shouldCancel';
import { Link } from 'react-router-dom';

class ListContainer extends Component {
  getPostList = () => {
    if(shouldCancel()) return;
    // 페이지와 태그 값을 부모에게서 받아 온다
    const { accNum, page, ListActions } = this.props;
    ListActions.getPostList({
      page,
      accNum
    });
  }

  // getUseridList = () => {
  //   if(shouldCancel()) return;
  //   const { accNum, page, userId, ListActions } = this.props;
  //   ListActions.getUseridList({
  //     page,
  //     accNum,
  //     userId
  //   })
  // }
  
  componentDidMount() {
    this.getPostList();
  }

  componentDidUpdate(prevProps, prevState) {
    // 페이지/사고번호가 바뀔 때 리스트를 다시 불러온다
    if(prevProps.page !== this.props.page || prevProps.accNum !== this.props.accNum) {
      this.getPostList();
      // 스크롤바를 맨 위로 올린다
      document.documentElment.scrollTop = 0;
    }
  }

  render() {
    const { loading, posts, page, lastPage, accNum } = this.props;
    if(loading) return null; // 로딩 중에는 아무것도 보여 주지 않는다.
    console.log('ListContainer : ' + page + ' ' + accNum);
    return (
      <div>
        <PostList posts={posts}/>
        <Pagination page={page} lastPage={lastPage} accNum={accNum}/>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    lastPage: state.list.get('lastPage'),
    posts: state.list.get('posts'),
    loading: state.pender.pending['list/GET_POST_LIST']
  }),
  (dispatch) => ({
    ListActions: bindActionCreators(listActions, dispatch)
  })
)(ListContainer);
