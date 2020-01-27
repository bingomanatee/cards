const axios = require('axios');

const key = '02285a34-0c38-4162-b3c1-9a26d685948a';
const url = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/voluminous?key=' + key;

axios.get(url)
  .then(({data}) => {
    console.log('word: ', data);
  })

