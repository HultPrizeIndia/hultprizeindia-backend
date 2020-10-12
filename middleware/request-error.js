/**
 * 
 * request-error.js
 * RequestError
 * 
 * Created by Shivam Verma
 * 
 * If you need to log the remote ipaddress of the user whose req was being handled while the error occured.
 * take in "req.connection.remoteAddress" as a 4th param
 */

class RequestError extends Error {
    constructor(message, errorCode, err, ip) {
        super(message);
        this.code = errorCode;

        // If err is passed, it will be logged on the console
        // Ignoring the following IF for coverage because it is only 'reached' when there is a server error.
        // Can be tested if Unit Tests are implemented
        // but it already does work as the programmer explicitly passes "err"
        /* istanbul ignore if */
        if (err) {
            console.log("\n")
            const currentdate = new Date(); 
            const datetime = currentdate.getDate() + "/"
                            + (currentdate.getMonth()+1)  + "/" 
                            + currentdate.getFullYear() + " @ "  
                            + currentdate.getHours() + ":"  
                            + currentdate.getMinutes() + ":" 
                            + currentdate.getSeconds();
            console.log(`The following error occured on ${datetime}:`);
            console.log(err);
            console.log("\n")
        }
    }
}

module.exports = RequestError;