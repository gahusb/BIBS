const mongoose = require('mongoose');

const { Schema } = mongoose;

const Post = new Schema({
    userId: { type: String, required: true },
    accTime: { type: String, required: true },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    video: { type: String, required: true },
    accNum: { type: Number, required: true, unique: true },
    carName: { type: String, required: true },
    carNumber: { type: String, required: true },
    publishedDate: {
        type: Date,
        default: new Date()
    }
});

// 모델 생성
module.exports = mongoose.model('Post', Post); // 스키마 이름, 스키마 객체