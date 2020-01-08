var ws = new WebSocket('ws://192.168.173.228:9090');

new Vue({
    name: '#timely',
    el: '#timely',
    data() {
        return {
            USER_INFO: null,
            flag: true,
            sendMsg: '',
            msg: [],
            messageBody: {
                id: 0,
                nickname: '',
                face: '',
                message: '',
                isFrist: true
            },
        }
    },
    mounted() {
        this.WS();
    },
    methods: {
        trim(str) {
            return str.replace(/^\s+|\s+$/g, "");
        },
        handleSend() {
            if (this.trim(this.sendMsg).length <= 0) return alert('发送消息不能为空');
            this.messageBody.message = this.sendMsg;
            ws.send(JSON.stringify(this.messageBody));
        },
        scrollBottom() {
            this.$nextTick(() => {
                this.$refs.msg.scrollTop = this.$refs.msg.scrollHeight;
            })
        },
        WS() {
            ws.onopen = function (e) {
                console.log("连接服务器成功");
                ws.send(JSON.stringify(this.messageBody));
            }.bind(this);
            ws.onclose = function (e) {
                console.log("服务器关闭");
            }
            ws.onerror = function () {
                console.log("连接出错");
            }
            ws.onmessage = (e) => {
                this.sendMsg = '';
                let data = JSON.parse(e.data);
                if (this.flag) {
                    console.log(data);
                    this.USER_INFO = data;
                    this.messageBody.isFrist = false;
                    this.messageBody = data;
                    console.log(this.USER_INFO);
                    this.flag = false;
                    return;
                }
                this.msg.push(data);
                this.scrollBottom();
                // if (!data.isFrist) {
                //     
                //      return
                // }

            }
        }
    }
})