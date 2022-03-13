import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { ListPage, PostPage, EditorPage, NotFoundPage } from 'pages';
import Base from 'containers/common/Base';
import Intro from './Intro/intro.js';
// import GrommetWorldMap from './GrommetWorldMap';
// import VideoPage from './videos/video';
// import GPS from './gps/gps';

const App = () => {
    return (
        <div>
            {/* <Navigators/> Nav*/}
            <Switch>
                <Route exact path="/" component={Intro}/>
                <Route path="/page" component={ListPage}/> {/* list 불러오는것*/}
                <Route path="/page/:page" component={ListPage}/> {/* list 번호 있는 페이지 불러오는것*/}
                <Route path="/page/:userId/:page?" component={ListPage}/> {/* userId가 붙어있는것 불러오기 */}
                <Route path="/post/:id" component={PostPage}/> {/* id를 불러서 포스트 가져오기 */}
                <Route path="/editor" component={EditorPage}/>
                {/* <Route path="/video/" component={VideoPage}/>
                <Route path="/maps/" component={GrommetWorldMap}/> */}
                {/* <Route path="/gps/" component={GPS}/> */}
                <Route component={NotFoundPage}/>
            </Switch>
            <Base/>
        </div>
    );
};

export default App;