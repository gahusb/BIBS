import React from 'react';
import styles from './PostBody.scss';
import classNames from 'classnames/bind';
import moment from 'moment';
import MarkdownRender from 'components/common/MarkdownRender';

const cx = classNames.bind(styles);

const PostBody = ({time, accTime, video, lat, lon, addr, carName, carNumber, handleGPSClick}) => (
    <React.Fragment>
    <div className={cx('post-body')}>
        <div className={cx('paper')}>
            {/* <MarkdownRender markdown={accAddr}/> */}
            <li>사고 시간 : {moment(accTime).format('lll')}</li>
            <li onClick={handleGPSClick}>사고 장소 : {addr}</li>
            <li>차량 이름 : {carName}</li>
            <li>차량 번호 : {carNumber}</li>
            <li>사고 영상 : </li>
            {
                video && <div>
                <video className={cx('video')} controls>
                    <source src={ window.location.origin + "/accidents/" + time + '.mp4' } type="video/mp4" />
                </video>
            </div>
            }
            
        </div>
    </div>
    </React.Fragment>
)

export default PostBody;