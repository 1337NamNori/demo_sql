const db = require('./database')

async function validateNewEmail(email){
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
        query = `select * from user where email = ${db.escape(email)}`
        ret = await db.query(query)
        if(ret.length <= 0)
            return true
        else
            return false
    }
    return false
}

async function validateNewUsername(username){
    if (username!= null && username.length >= 4){
        query = `select * from user where email = ${db.escape(username)}`
        ret = await db.query(query)
        if(ret.length <= 0)
            return true
        else
            return false
    }
    return false
}

async function validatePassword(password){
    let passwordMinLength = 4
    if(password != null && password.length >= passwordMinLength){
        return true
    }
    return false
}

async function validateNotNull(text, minLength=4){
    if(!text){
        return false
    }
    if(typeof text == 'undefined'){
        return false
    }
    if(text.length < minLength){
        return false
    }
    return true
}

module.exports={
    validateNewEmail,
    validateNewUsername,
    validatePassword,
    validateNotNull
}