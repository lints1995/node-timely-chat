var ws = require("nodejs-websocket");
let connectDB = require('./db');

function randomNumBoth(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.round(Rand * Range); //四舍五入
    return num;
}
let images = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.png', '7.png', '8.png', '9.jpeg', '11.png', '12.jpg']

function createRandomId() {
    return (Math.random() * 10000000).toString(16).substr(0, 4);
}
let db = connectDB();
// db.query('SELECT * FROM user', (err, rows) => {
//     // console.log(rows);

// });

var server = ws.createServer(conn => {
    conn.on('connection', con => {
        console.log('连接成功');
    })
    conn.on("text", obj => {
        let objContent = JSON.parse(obj);
        if (objContent.isFrist) {
            let random = randomNumBoth(0, 10);
            let nickname = createRandomId();
            let face = `/img/${images[random]}`;
            db.query('INSERT INTO user (nickname,face) VALUES(?,?)', [nickname, face], (err, results) => {
                // if (err)  
                console.log('插入用户数据成功');
                if (results.insertId !== undefined) {
                    let data = {
                        id: results.insertId,
                        message: `${nickname}进入聊天室`,
                        nickname: nickname,
                        face: face,
                        isFrist: false
                    };
                    server.connections.forEach(conn => {
                        conn.sendText(JSON.stringify(data));
                    })
                }
            })
            return;
        }
        let data = {
            id: objContent.id,
            message: objContent.message,
            nickname: objContent.nickname,
            face: objContent.face,
            isFrist: false
        };
        server.connections.forEach(conn => {
            conn.sendText(JSON.stringify(data));
        })
        return;

    })
    conn.on("close", (code, reason) => {
        console.log("关闭连接");
    });
    conn.on("error", (code, reason) => {
        console.log("异常关闭");
    });
}).listen(9000);