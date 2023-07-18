// Generate ID key for boards
import {randomInt} from 'crypto';

const makeid = (length: number) => {
    var result = '';
    var characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(randomInt(63));
    }
    return result;
};


export default makeid;