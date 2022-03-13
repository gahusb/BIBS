/*global daum*/
import React, { Component } from 'react';
import PostInfo from 'components/post/PostInfo';
import PostBody from 'components/post/PostBody';
import * as postActions from 'store/modules/post';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import shouldCancel from 'lib/shouldCancel';
import removeMd from 'remove-markdown';
import { Helmet } from 'react-helmet';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'

import * as baseActions from 'store/modules/base';

const geocoder = new daum.maps.services.Geocoder();

class Post extends Component {
    constructor() {
        super();
        this.state = {
            userId: null,
            time: null,
            accTime: null,
            lat: null,
            lon: null,
            video: null,
            accNum: null,
            carName: null,
            carNumber: null,
            publishedDate: null,
            detailAddr: null,
            alert: true
        };
    }

    initialize = async () => {
        if(shouldCancel()) return;
        const { PostActions, id } = this.props;
        try {
            await PostActions.getPost(id);
            // await this.updateHeader();
        } catch(e) {
            console.log(e);
        }
    }

    update = async (userId, accTime, lat, lon, video, accNum, carName, carNumber, publishedDate) => {
        var lat_1 = Number(lat);
        var lon_1 = Number(lon);

        geocoder.coord2Address(lon_1, lat_1, (result, stats) => {
            //console.log(stats); 
            if (stats === daum.maps.services.Status.OK) {
                var addr = result[0].address.address_name;
                this.setState({
                    userId: userId,
                    time: accTime,
                    accTime: accTime.substring(0, 10) + " " + accTime.substring(11, 13) + ":" + accTime.substring(14, 16) + ":" + accTime.substring(17, 19),
                    lat: lat,
                    lon: lon,
                    video: video,
                    accNum: accNum,
                    carName: carName,
                    carNumber: carNumber,
                    publishedDate: publishedDate,
                    detailAddr : addr
                });
            }
        });
    }

    componentDidMount = async () => {
        await this.initialize();
        const { post } = this.props;
        const { userId, accTime, lat, lon, video, accNum, carName, carNumber, publishedDate } = post.toJS();

        if(video == '권한이 없음'){
            // this.setState({ alert: true });
            this.handleErrorMsg();
            this.onDismiss = this.onDismiss.bind(this);
            setTimeout(() => window.location.replace("/page/"), 2000);
        } else if(video == 'No Change'){
            this.handleSuccessMsg();
            this.onDismiss = this.onDismiss.bind(this);
            await this.update(userId, accTime, lat, lon, video, accNum, carName, carNumber, publishedDate);
        } else if(video == 'Is Change'){
            this.handleInconsistencyMsg();
            this.onDismiss = this.onDismiss.bind(this);
            await this.update(userId, accTime, lat, lon, video, accNum, carName, carNumber, publishedDate);
        } else if(video == 'pending'){
            this.handlePending();
            this.onDismiss = this.onDismiss.bind(this);
            await this.update(userId, accTime, lat, lon, video, accNum, carName, carNumber, publishedDate);
        }
    }
    
    onDismiss() {
        this.setState({ visible: false });
    }
    handlePending = () => {
        this.submit('영상 정보가 블록에 올라가는중입니다. 잠시 후 위,변조 여부를 확인해주세요.');
    }
    handleErrorMsg = () => {
        this.submit('권한이 없습니다.');
    }
    handleSuccessMsg = () => {
        this.submit('블록 데이터와 대조 결과 일치. 영상 무결성 보장!');
    }
    handleInconsistencyMsg = () => {
        this.submit('블록 데이터와 대조 결과 불일치. 영상 위,변조 의심');
    }
    submit = (msg) => {
        confirmAlert({
          title: msg,
          message: '확인을 눌러주세요.',
          buttons: [
            {
              label: '확인',
            //   onClick: () => alert('Click No')
            }
          ]
        })
    };

    // handleGPSClick = async () => {
    //     const { BaseActions } = this.props;
        
    //     BaseActions.showModal('gps');
    //     BaseActions.initializeGpsModal();
    // }

    render() {
        const { loading } = this.props;

        if(loading) return null; // 로딩 중일 때는 아무것도 보여 주지 않음
        
        return (
            <div>
                {   this.state.lat && (
                    <Helmet>
                        <title>{this.state.userId}</title>
                    </Helmet>)
                }
                    <PostInfo userId={this.state.userId} accNum={this.state.accNum} publishedDate={this.state.publishedDate}/>
                    <PostBody 
                        time={this.state.time}
                        accTime={this.state.accTime}
                        video={this.state.video}
                        lat={this.state.lat}
                        lon={this.state.lon} 
                        addr={this.state.detailAddr} 
                        carName={this.state.carName} 
                        carNumber={this.state.carNumber}/>
            </div>
        )
    }
}

export default connect(
    (state) => ({
        post: state.post.get('post'),
        loading: state.pender.pending['post/GET_POST'] // 로딩 상태
    }),
    (dispatch) => ({
        PostActions: bindActionCreators(postActions, dispatch),
        BaseActions: bindActionCreators(baseActions, dispatch)
    })
)(Post);