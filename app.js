var ws = require("nodejs-websocket");
let connectDB = require('./db');
let db = connectDB();

function randomNumBoth(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.round(Rand * Range); //四舍五入
    return num;
};
let images = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.png', '7.png', '8.png', '9.jpeg', '11.png', '12.jpg'];

function createRandomId() {
    return (Math.random() * 10000000).toString(16).substr(0, 4);
}

let server = ws.createServer(conn => {
    conn.on('connection', () => {
        console.log('连接成功');
    })
    conn.on("text", obj => {
        let objContent = JSON.parse(obj);
        if (objContent.isFrist) {
            let random = randomNumBoth(0, 10);
            let nickname = createRandomId();
            let face = `/img/${images[random]}`;
            db.query('INSERT INTO user (nickname,face) VALUES(?,?)', [nickname, face], (err, results) => {
                if (results.insertId !== undefined) {
                    let data = {
                        id: results.insertId,
                        message: `${nickname}进入聊天室`,
                        nickname: nickname,
                        face: face,
                        isFrist: false,
                        common: true
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
            isFrist: false,
            common: false
        };
        server.connections.forEach(conn => {
            conn.sendText(JSON.stringify(data));
        })
    })
    conn.on("close", (code, reason) => {
        console.log("关闭连接");
    });
    conn.on("error", (code, reason) => {
        console.log("异常关闭");
    });
}).listen(9090);