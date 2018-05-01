function Semaphore() {
    
    // variables //
    var callbacks = [];
    var isRunning = false;
    var finalCheckoutTimeout = {};
    /** final check, makes sure that all the callbacks were executed */

    // public method //
    this.add = function (callback) {
        callbacks.push(new Promise(function (resolve, reject) {
            try {
                callback();
                resolve();
            } catch (e) {
                reject(e);  
            }
        }));
        if (!isRunning) {
            execute();
        } else {
            clearTimeout(finalCheckoutTimeout);
            finalCheckoutTimeout = setTimeout(execute, 50);
        }
    }

    // private method //
    var execute = function () {
        isRunning = true;
        if (callbacks.length <= 0) {
            isRunning = false;
            return;
        }
        callbacks[0]().then(
            function () {
                callbacks.shift();
                execute();
            },
            function (err) {
                console.error('semaphore crashed ', err);
            }
        );
    }
}

module.exports = Semaphore;