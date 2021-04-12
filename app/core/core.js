const events = require('events');

const range = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f'];
const attempt = 3;

const config = {
    range: range,
    attempt: attempt,

}

class CoreGame {
    constructor(secret = this.randomSecret(), options = config) {
        this.secret = secret.toLowerCase();
        this.gameOptions = {
            ox: 0,
            cow: 0,
            trying: 0,
            status: false,
        };
        this.config = options;
        this.event = new events.EventEmitter();
      
    }

    randomSecret() {
        const workArr = range.slice(0);
        let removed = [];
        for (let i = 0; i < 6; i++) {
            const randomItem = Math.floor(Math.random() * workArr.length);
            removed += workArr.splice(randomItem, 1).slice(0);
        }
        return removed
    }

    checkSecret(value) {
        CoreGame.validateSecret(value);
        
        if(this.gameOptions.status) return

        const secretArr = this.secret.split('');
        const valueArr = value.split('');
        let ox = 0; // бики = правильний символ + позиція
        let cow = 0; // корови = правильних символів
        secretArr.forEach((item, index) => {
            if (valueArr.includes(item)) {
                cow++;
            }
            if (valueArr[index] === item) {
                ox++;
            }
        });
        console.log('Бичків:', ox, 'Корів:', cow, 'Залишилось спроб:', attempt - this.gameOptions.trying - 1);
        if (ox === 6) {
            this.gameOptions.status = true;
            this.event.emit('win');
            return true
        }
        if (this.gameOptions.trying === attempt - 1) {
            this.gameOptions.status = true;
            this.event.emit('lose');
            return true
        }
      
        this.setGameOptions(ox, cow, ++this.gameOptions.trying);
       
        return {cow, ox}
    }

    getGameOptions() {
        return this.gameOptions;
    }

    setGameOptions(ox, cow, trying) {
        this.gameOptions.ox = ox;
        this.gameOptions.cow = cow;
        this.gameOptions.trying = trying;
        this.gameOptions.status = false;
    }

    getSecret() {
        return this.secret;
    }

    setSecret(newSecret) {
        return this.secret = newSecret;
    }

    reset(newSecret) {
        this.setSecret(newSecret);
        this.setGameOptions(0, 0, 0);
        console.log('object reset success');
    }

    static validateSecret(secret) {
        if (secret.length != 6) throw new Error('must be 6 symbol');

        const arr = secret.split('');

        arr.forEach(item => {
            const res = range.includes(item);
            if (!res) throw new Error('error range');
        });

        const uniqueItems = Array.from(new Set(arr))
        if (arr.length != uniqueItems.length) throw new Error('must be uniq value');
        
        return true;
    }

}

const instans = new CoreGame('1234ab');

instans.event.on('win', ()=> {
    console.log('Huuh, you win!!!!');
});
instans.event.on('lose', () => {
    console.log('pfffff, you lose(((((((((');
});

CoreGame.validateSecret(instans.secret)

instans.checkSecret('1267ba');
instans.checkSecret('1263ab');
instans.checkSecret('1273ab');
// instans.checkSecret('1234ab');

instans.checkSecret('1239ab');
// instans.checkSecret('1234ab');

instans.reset('987654');

instans.checkSecret('98a7bc');
// instans.checkSecret('9876c');
instans.checkSecret('987654');

module.exports = CoreGame;