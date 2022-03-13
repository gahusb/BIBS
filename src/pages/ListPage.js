import React from 'react';
import PageTemplate from 'components/common/PageTemplate';
import ListWrapper from 'components/list/ListWrapper';
import ListContainer from 'containers/list/ListContainer';
import * as listActions from 'store/modules/list';
import { bindActionCreators } from 'redux';
import { Helmet } from 'react-helmet';

const ListPage = ({match}) => {
    // page의 기본 값을 1로 설정
    const { page = 1, accNum } = match.params;

    // title 값을 page 값과 tag 값에 따라 동적으로 설정
    const title = (() => {
        let title = 'bibsboard';
        if(accNum) {
            title += ` #${accNum}`
        }
        if(page !== 1) {
            title += ` - ${page}`;
        }
        return title;
    })();

    return (
        <PageTemplate>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <ListWrapper>
                <ListContainer
                    page={parseInt(page, 10)}
                    accNum={accNum}
                />
            </ListWrapper>
        </PageTemplate>
    );
};

ListPage.preload = (dispatch, params) => {
    const { page = 1, accNum } = params;
    const ListActions = bindActionCreators(listActions, dispatch);
    return ListActions.getPostList({
        page, accNum
    });
}

export default ListPage;