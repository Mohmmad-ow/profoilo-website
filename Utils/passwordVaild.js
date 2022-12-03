const crypto = require('crypto')
const {User} =require('../config/database')

function genPassword(password) {
    const salt = crypto.randomBytes(32).toString('hex')
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')

    return {salt: salt, hash: hash}
}

function validPassword(password, hash, salt) {
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}

// const salt = "b4ae530bc8237e7e7550c530a05edd50e699dd3f34de454d1d1127091e4bd47c"
// const hash = "205352693a857e7a4a0cc6361f8363b0b569497a5868e0264d144fb2352fdbabdb2db41f726762e7dbf135c1095f0bd12e9403e144e25f87e91a3216dac30d9f"
// console.log(validPassword("Moemessi10", hash, salt))
module.exports = {
    genPassword, validPassword
}