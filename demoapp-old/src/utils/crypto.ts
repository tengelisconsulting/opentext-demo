import jwt from 'jsonwebtoken';

const privateKey = process.env["RSA_PRIVATE_KEY"];


const codingChallengeInfos = yaml.load(fs.readFileSync('./data/static/codefixes/' + key + '.info.yml', 'utf8'))
