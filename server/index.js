const express = require('express')
const app = express()
const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');
const cors_app = require('cors');
app.use(cors_app());
require('dotenv').config()

app.use(express.static('client'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000

const getTranslatorInstance = () => {
  const languageTranslator = new LanguageTranslatorV3({
    version: '2018-05-01',
    authenticator: new IamAuthenticator({
      apikey: process.env.API_KEY,
    }),
    serviceUrl: process.env.API_URL
  });
  return languageTranslator
}

app.get('/', (req, res) => {
    return res.render('index.html')
})

app.get('/languages', (req, res) => {
  const trans = getTranslatorInstance()
  trans.listLanguages().then(languages => {
    return res.json(languages)
  })
  .catch(e => console.log(e))
})

app.post('/translate', (req, res) => {
  const lang = req.body.lang
  const text = req.body.text
  const trans = getTranslatorInstance()
  trans.translate({
    text: text,
    modelId: lang
  }).then(data => {
    return res.json(data)
  }).catch(err => {
    console.log(err)
    return res.json('error')
  }) 
})

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})