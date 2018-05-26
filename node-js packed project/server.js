const express = require('express');
const app = express();
const http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 1337;

var index = '<h1>iPet Server</h1><hr>';
function printHtml(text) { index += text + '<br>'; return text; }

const pg = require('pg');
const ReadWriteLock = require('rwlock');
var lock = new ReadWriteLock();

var DatabaseURL = 'postgres://rdebzkdboixdao:gSukrACy2yRvwJnm29Mlna7JuN@ec2-54-225-79-232.compute-1.amazonaws.com:5432/d4r49b74js7oji';
pg.defaults.ssl = true;

    // Database
function DB(SQLscript, CallbackFunction) {
    lock.readLock(function (release) {
        pg.connect(DatabaseURL, function (err, client, done) {
            if (err) { CallbackFunction('Database error'); done(); release(); return; }
            client.query(SQLscript, function (err, result) {
                if (err) {
                    CallbackFunction('SQL Command error'); done(); release(); return;
                }
                if (result.rows[0]) {
                    CallbackFunction(result.rows); done(); release(); return;
                }
                CallbackFunction('No results'); done(); release(); return;
            });
        });
    });
}

DB("SELECT * FROM public.ownerusers WHERE userName = 'admin'", function (result) {
    if (result == 'Database error' || result == 'SQL Command error' || result == 'No results')
    { console.log(printHtml(result)); return; }
    console.log(printHtml('Connected to the Database'));
});

app.get('/', function (req, res, next)
{
    if (!req.query.command) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(index); next(); return;
    }
    var answer = new Object();
    switch (req.query.command) {
        case 'Connection':
            res.send('Connected!!'); next(); break;
        case 'OwnerLogin':
            OwnerLogin(req, res, answer, next); break;
        case 'OwnerSignup':
            OwnerSignup(req, res, answer, next); break;
        case 'AddPetToOwner':
            addPetToOwner(req, res, answer, next); break;
        case 'Petlogin':
            Petlogin(req, res, answer, next); break;
        case 'GetPetsList':
            GetsPetsList(req, res, answer, next); break;
        case 'GetFriendsList':
            GetFriendsList(req, res, answer, next); break;
        case 'AddFriend':
            AddFriend(req, res, answer, next); break;
        case 'GetFriendPets':
            GetFriendPets(req, res, answer, next); break;
    }
});

io.on('connection', function (socket) {
    console.log('new user');

    socket.on('Server', function (msg) {
        console.log(msg);
        io.emit('Client', 'From server');
    });
});

http.listen(port, function () { console.log(printHtml('Streaming on port:' + port)); });

    // ?command=OwnerLogin&userName=USER
function OwnerLogin(req, res, answer, next) {
    var SQL = "SELECT * FROM public.ownerusers WHERE userName = '" + req.query.userName + "'";
    DB(SQL, function (result) {
        if (checkError(res, answer, next, result, "User doesn't exists",true)) { return; }
        SQL = "UPDATE public.ownerusers SET status='on' WHERE username = '" + req.query.userName + "'";
        DB(SQL, function (result) {
            if (checkError(res, answer, next, result, '.',false)) { return; }
            answer.title = "login"; answer.user = req.query.userName;
            console.log(printHtml('Owner login :' + req.query.userName));
            res.send(answer); next();
        });
    });
}

    //  ?command=OwnerSignup&userName=USER&password=PASSWORD&phone=0543944989
function OwnerSignup(req, res, answer, next) {
    var SQL = "INSERT INTO public.ownerusers(username, status, password, phonenumber) VALUES";
    SQL += "('" + req.query.userName + "', 'off', '" + req.query.password + "', '" + req.query.phone + "')";
    DB(SQL, function (result) {
        if (result == 'SQL Command error') {
            sendError('User already exists', res, answer, next); return;
        }
        if (checkError(res, answer, next, result, '.',false)) { return; }
        OwnerLogin(req, res, answer, next);
    });
}

    //  ?command=AddPetToOwner&OwnerName=USER&petName=PET&petNumber=0543944989
function addPetToOwner(req, res, answer, next) {
    var SQL = "INSERT INTO public.ownerspetslink(ownername, petname, petnumber) ";
    SQL += "VALUES ('" + req.query.OwnerName + "', '" + req.query.petName + "', '" + req.query.petNumber + "')";
    DB(SQL, function (result) {
        if(result == 'SQL Command error'){
            sendError('pet number is not register or already on your list',res,answer,next); return;
        }
        if (checkError(res, answer, next, result, '.', false)) { return; }
        answer.title = "add"; answer.log = req.query.petName + " was add to your list";
        console.log(printHtml(answer.log));
        res.send(answer); next();
    });
}

    //  ?command=Petlogin&petNumber=0543944989
function Petlogin(req, res, answer, next) {
    var SQL = "INSERT INTO public.petsnumbers(petnumber) VALUES ('" + req.query.petNumber + "')";
    DB(SQL, function (result) {
        if (result == 'Database error') {
            res.send(result); next(); return;
        }
        res.send('Connected'); next(); return;
    });
}

    //  ?command=GetPetsList&userName=USER
function GetsPetsList(req, res, answer, next) {
    var SQL = "SELECT * FROM public.ownerspetslink WHERE ownername = '" + req.query.userName + "'";
    console.log(SQL);
    DB(SQL, function (result) {
        if (checkError(res, answer, next, result, "No pets to display", true)) { return; }
        answer.title = "list"; answer.log = result;
        console.log(printHtml('List request for ' + req.query.userName));
        res.send(answer); next();
    });
}

    // ?command=GetFriendsList&userName=USER
function GetFriendsList(req, res, answer, next) {
    var SQL = "SELECT * FROM public.friendslist WHERE username = '" + req.query.userName + "'";
    console.log(SQL);
    DB(SQL, function (result) {
        if (checkError(res, answer, next, result, "No friends are currently connected", true)) { return; }
        answer.title = "list"; answer.log = result;
        console.log(printHtml('Friends List for ' + req.query.userName));
        res.send(answer); next();
    });
}

    // ?command=AddFriend&userName=USER&friendName=FRIEND
function AddFriend(req, res, answer, next) {
    var SQL = "INSERT INTO public.friendslist(username, friendname) VALUES ('" + req.query.userName + "', '" + req.query.friendName + "')";
    DB(SQL, function (result) {
        if (result == 'SQL Command error') {
            sendError("Username doesn't exists", res, answer, next); return;
        }
        if (checkError(res, answer, next, result, '.', false)) { return; }
        answer.title = "add"; answer.log = req.query.friendName + " was add to your FriendsList";
        console.log(printHtml(answer.log));
        res.send(answer); next();
    });
}

    // ?command=GetFriendPets&friendName=USER
function GetFriendPets(req, res, answer, next) {
    var SQL = "SELECT * FROM public.ownerspetslink JOIN public.petslocation ON public.ownerspetslink.petnumber = public.petslocation.petnumber ";
    SQL += " WHERE public.ownerspetslink.ownername = '" + req.query.friendName + "'";
    SQL += " AND public.ownerspetslink.petnumber IN (SELECT petnumber FROM public.petslocation)";
    DB(SQL, function (result) {
        if (checkError(res, answer, next, result, "User has no pets", true)) { return; }
        answer.title = "list"; answer.log = result;
        console.log(printHtml('Friend pets Location ' + req.query.friendName));
        res.send(answer); next();
    });
}




//___________________________________________________________________________________//
    //....functions...//

function sendError(text, res, answer, next) {
    answer.title = "error"; answer.log = text;
    console.log(printHtml(text));
    res.send(answer); next();
}

function checkError(res, answer, next, result, NotFoundComment, SelectCommand) {
    if (result == 'Database error' || result == 'SQL Command error') {
        sendError(result, res, answer, next); return true;
    }
    if (!SelectCommand) { return false; }
    if (result == 'No results') {
        sendError(NotFoundComment, res, answer, next); return true;
    }
    return false;
}