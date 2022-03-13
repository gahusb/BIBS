const mongoose = require('mongoose');

const { Schema } = mongoose;

const User = new Schema({
    userId: { type: String, required: true },
    pass: { type: String, required: true }
});

// 모델 생성
module.exports = mongoose.model('User', User); // 스키마 이름, 스키마 객체