import React from 'react';
import styles from './PostList.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import moment from 'moment';
// import removeMd from 'remove-markdown';

const cx = classNames.bind(styles);
    
const PostItem = ({userId, accTime, lat, lon, video, accNum, carName, carNumber, publishedDate, id}) => {
    // const tagList = accNum.map(
    //     accNum => <Link key={accNum} to={`/tag/${accNum}`}>#{accNum}</Link>
    // );
    return (
        <div className={cx('post-item')}>
            <h2><Link to={`/post/${id}`}>ID : {userId}</Link></h2>
            <div className={cx('date')}>{moment(publishedDate).format('ll')}</div>
            <ul>
                <li>사고 시간 : {accTime}</li>
                <li>차량 이름 : {carName}</li>
                <li>차량 번호 : {carNumber}</li>
            </ul>
            <div className={cx('tags')}>
                사고 번호={accNum}
            </div>
        </div>
    )
}

const PostList = ({posts}) => {
    const postList = posts.map(
        (post) => {
            const { _id, userId, accNum, accTime, lat, lon, publishedDate, video, carName, carNumber } = post.toJS()._doc;
            return (
                <PostItem
                    userId={userId}
                    accTime={accTime}
                    // lat={lat}
                    // lon={lon}
                    accNum={accNum}
                    carName={carName}
                    carNumber={carNumber}
                    publishedDate={publishedDate}
                    key={_id} // react-warning-keys
                    id={_id}
                />
            )
        }
    );
    return (
        <div className={cx('post-list')}>
            {postList}
        </div>
    )
};

export default PostList;