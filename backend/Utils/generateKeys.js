import crpyto from 'crypto';

const secret = crpyto.randomBytes(32).toString('base64');

console.log(secret)
