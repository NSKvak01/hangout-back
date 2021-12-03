function getUniqueErrorMessage(err){
    let message = err.keyValue
    let messageKey = Object.keys(message)
    let messageValue = Object.values(message)
    return `${messageKey[0]} ${messageValue[0]} already exists`
}

function getErrorMessage(err){
    let message=''
    if(err.code){
        switch(err.code){
            case 11000:
            case 11001:
                message = getUniqueErrorMessage(err)
            break
            default: message = "Something went wrong"
        }
    } else if(err.message){
        return err.message
    } else {
        for (let errName in err.errors){
            if(err.error[errName].message){
                message=err.error[errName].message
            }
        }
    }
    return message
}

module.exports = getErrorMessage