import React from 'react';
import styles from './UserLogupModal.scss';
import classNames from 'classnames/bind';
import ModalWrapper from 'components/modal/ModalWrapper';

const cx = classNames.bind(styles);

const UserLogupModal = ({
    visible, userId, userPassword, error, onCancel, onUserLogup, onIdChange, onPassChange, onKeyPress
}) => (
    <ModalWrapper visible={visible}>
        <div className={cx('form')}>
            <div onClick={onCancel} className={cx('close')}>&times;</div>
            <div className={cx('title')}>회원가입</div>
            <div className={cx('description')}>아이디를 입력하세요</div>
            <input autoFocus type="id" placeholder="아이디 입력" value={userId}
            onChange={onIdChange} onKeyPress={onKeyPress}/>
            <div className={cx('description')}>비밀번호를 입력하세요</div>
            <input type="password" placeholder="비밀번호 입력" value={userPassword}
            onChange={onPassChange} onKeyPress={onKeyPress}/>
            { 
                error && <div className={cx('error')}>
                    회원가입 실패
                </div>
            }
            <div className={cx('logup')} onClick={onUserLogup}>회원가입</div>
        </div>
    </ModalWrapper>
);

export default UserLogupModal;