require('dotenv').config();

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const api = require('./api');
const mongoose = require('mongoose');
const session = require('koa-session');
const ssr = require('./ssr');
const path = require('path');
const serve = require('koa-static');

const app2 = require('express')();
const http = require('http').Server(app2);
const bodyParser2 = require('body-parser');
const fs = require('fs');
const multer = require('multer');
const crypto = require('crypto');

const staticPath = path.join(__dirname, '../../BIBS/build'); // path 변경필요
const videoPath = path.join(__dirname, '../../public/accidents/');

var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var abi = [
	{
		"constant": true,
		"inputs": [],
		"name": "getCreator",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getAccident",
		"outputs": [
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "count",
				"type": "uint256"
			},
			{
				"name": "_video_hash",
				"type": "string"
			},
			{
				"name": "_time",
				"type": "string"
			},
			{
				"name": "_latitude",
				"type": "string"
			},
			{
				"name": "_longitude",
				"type": "string"
			}
		],
		"name": "addAccidentInfo",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	}
];

var ContractAddress = "0x9bb6770696aee7bd82ab0a29be382ec4f5c79c3b";
var AccCon = web3.eth.contract(abi);
var AccContract = AccCon.at(ContractAddress);

var postModel = require(__dirname + '/models/post');
var userModel = require(__dirname + '/models/user');

var upload = multer({
   storage: multer.diskStorage({
      destination : function(req, file, cb){
         cb(null, videoPath);
      },
      filename: function(req, file, cb){
         cb(null, file.originalname);
      }
   }),
});

const {
    PORT: port = 4000, // 값이 존재하지 않는다면 4000을 기본 값으로 사용
    MONGO_URI: mongoURI,
    COOKIE_SIGN_KEY: signKey
} = process.env;

mongoose.Promise = global.Promise; // Node의 Promise로 사용하도록 설정
mongoose.set('useCreateIndex', true)
mongoose.connect(mongoURI,{useNewUrlParser: true}).then(() => {
    console.log('connected to mongodb');
}).catch((e) => {
    console.error(e);
});

const app = new Koa();
const router = new Router();

// 라우터 설정
router.use('/api', api.routes()); // api 라우트 적용
router.get('/', ssr);

// 라우터 적용 전에 bodyParser 적용
app.use(bodyParser());

// 세션을 부여하는 부분
// 세션/키 적용
const sessionConfig = {
    maxAge: 86400000, // 하루
    // signed: true(기본으로 설정되어 있다.)
};
// 세션 설정을 이용하여 signKey의 값이 일치하면 부여
app.use(session(sessionConfig, app));
app.keys = [signKey];

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

app.use(serve(staticPath)); // 주의: serve가 ssr전에 와야만 한다.
app.use(ssr); // 일치하는 것이 없으면 ssr을 실행

app.listen(port, async () => {
    console.log('listening to port', port);
});

app2.use(bodyParser2.json());

// AccContract.getAccidentCount(function(e, r){
//     if(e) console.log(e);
//     else{
//         console.log(r.toString(10));
//         console.log(Number(r));
//     }
// });
// var mappingNumber = postModel.find({"accNum" : $max});


app2.post('/', upload.any(), async (req, res)=>{
//   console.log(req);
   console.log('Success!');

   var s_time_1 = req.body.video1_start_time;
   var e_time_1 = req.body.video1_end_time;
   var s_time_2 = req.body.video2_start_time;
   var e_time_2 = req.body.video2_end_time;
   var acc_time = req.body.accident_time;

   var e1_s = e_time_1.substring(17,19);
   var acc_s = acc_time.substring(17,19);

   var e1_m = e_time_1.substring(14, 16);
   var acc_m = acc_time.substring(14, 16);

   var sec;
   var front_sec = 30;

   // calculate cutting time
   if(e1_m == acc_m){
      sec = Number(e1_s) - Number(acc_s) + 1;
   } else{
      sec = Number(e1_s) + 60 - Number(acc_s) + 1;
   }
   
   front_sec = front_sec - sec;

   // cut video file 1
   var execSync = require('child_process').execSync,
      child;

   child = execSync("ffmpeg -i " + videoPath + req.body.first_file_name + " -acodec copy -vcodec copy -ss " + front_sec.toString() + " -t " + (sec + 1).toString() + " " + videoPath + "accf.h264 -y" , function(error, stdout, stderr){
      console.log('stdout : ' + stdout);
      console.log('stderr : ' + stderr);
      if(error !== null){
         console.log('exec error : ' + error);
      } else {
         console.log('Success!');
      }
   });

   // cut video file 2
   var execSync = require('child_process').execSync,
      child;

   child = execSync("ffmpeg -i " + videoPath +  req.body.second_file_name + " -acodec copy -vcodec copy -ss 0 -t " + front_sec.toString() + " " + videoPath + "accb.h264 -y" , function(error, stdout, stderr){
      console.log('stdout : ' + stdout);
      console.log('stderr : ' + stderr);
      if(error !== null){
         console.log('exec error : ' + error);
      } else {
         console.log('Success!');
      }
   });

   // cat video file
   var execSync = require('child_process').execSync,
      child;

   child = execSync("ffmpeg -f concat -i " + videoPath + "/videolist.txt -c copy " + videoPath + acc_time + ".h264 -y" , function(error, stdout, stderr){
      console.log('stdout : ' + stdout);
      console.log('stderr : ' + stderr);
      if(error !== null){
         console.log('exec error : ' + error);
      } else {
         console.log('Success!');
      }
   });
   //TODO MAP API and BlockChain TEST NET 
         
   var execSync = require('child_process').execSync,
      child;

   child = execSync("ffmpeg -i " + videoPath + "/" + acc_time + ".h264 -vcodec h264 -acodec mp2 " + videoPath + acc_time + ".mp4 -y" , function(error, stdout, stderr){
      console.log('stdout : ' + stdout);
      console.log('stderr : ' + stderr);
      if(error !== null){
         console.log('exec error : ' + error);
      } else {
         console.log('Success!');
      }
   });

   fs.unlink(videoPath + req.body.first_file_name, function(err){
         if(err) throw err;
         console.log('successfully deleted ' + req.body.first_file_name);
   });

   fs.unlink(videoPath + req.body.second_file_name, function(err){
         if(err) throw err;
         console.log('successfully deleted ' + req.body.second_file_name);
   });

   fs.unlink(videoPath + acc_time + ".h264", function(err){
         if(err) throw err;
         console.log('successfully deleted ' + acc_time + '.h264');
   })

   var file = fs.readFileSync(videoPath + acc_time +  ".mp4");
   var sha = crypto.createHash('sha256');
   sha.update(file);
   var output = sha.digest('hex').toString();

   console.log(output);
//    var lat_2 = 37.5536067;
//    lat_2 = lat_2.toString();
//    var lon_2 = 126.96961950000002;
//    lon_2 = lon_2.toString();
   var lat_1 = req.body.latitude;
   var lon_1 = req.body.longitude;

   lat_1 = Number(lat_1);
   lon_1 = Number(lon_1);

   var mappingNumber = -1;
   await postModel.find({}).sort({accNum:-1}).limit(1)
                  .exec(function(err, data){
                     if(!err){
                        // console.log(data);
                        // console.log(data[0].accNum);
                        mappingNumber = data[0].accNum;
                        mappingNumber++;
                        console.log(mappingNumber);

                        var post = new postModel({
                           userId : 'sherry92',
                           accTime : acc_time,
                           lat : lat_1,
                           lon : lon_1,
                           video : videoPath + acc_time + '.mp4',
                           accNum : mappingNumber,
                           carName : req.body.carName,
                           carNumber : req.body.carNumber
                        });
                        //console.log(post);
                     
                        post.save(function(error, data){
                              if(error){
                                 console.log('DB ERROR!');
                                 console.log(error);
                              } else {
                                 console.log('successfully new data Insert!');
                              }
                        });
                     
                        AccContract.addAccidentInfo.sendTransaction(mappingNumber, output, acc_time, req.body.latitude, req.body.longitude, {
                                                                     to : web3.eth.accounts[0],
                                                                     from : '0x03466bd0862f7fdec52e9d5c697ea2bd5bc68dec',
                                                                     gas: 8000000
                                                                     }, function(error, transactionHash){
                           if(!error){
                                 console.log('Contract no error');
                           }else{
                                 console.log(error);
                           }
                        });
                     } else {
                        console.log('DB ERROR!');
                        console.log(err);
                     }
                  });
   // while(true){
   //    // console.log("waiting db data....");
   //    if(!isNaN(dbPost)) break;
   // }
   
   console.log('FINISH!');
   res.send('Good Job!');
});

http.listen(8000, function(){
   console.log('server running..');
});
