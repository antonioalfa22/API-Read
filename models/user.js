"use strict"

const mongoUsers = require("../modules/mongoUsers")
const crypto = require("crypto")

const userSchema = new mongoUsers.Schema({
    userName: { type: String, required: true, unique: true, index: true , trim:true},
    hash: { type: String },
    salt: { type: String},
    rol: { type: String }
}, { autoIndex: false })

class UserClass {
    setPassword(password) {
        this.salt = crypto.randomBytes(16).toString("hex")
        this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`)
    }
    setRol(rol){
        this.rol = rol;
    }
    static validate(userName, password) {
        return new Promise((res, rej) => {
            this.findOne({ userName: userName }, (err, doc) => {
                if(err){
                    rej("Validation system is down")
                }else if (doc===null) {
                    rej("User doesnt exist")
                } else {
                    let hash = crypto.pbkdf2Sync(password, doc.salt, 1000, 64, `sha512`).toString(`hex`)
                    if(doc.hash === hash){
                        res(doc)
                    }else{
                        rej("Invalid user password combination")
                    }
                }
            })
        })
    }

}

userSchema.loadClass(UserClass)
module.exports = mongoUsers.model("User", userSchema)