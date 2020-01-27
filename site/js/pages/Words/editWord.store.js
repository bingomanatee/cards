import { ValueStream } from '@wonderlandlabs/looking-glass-engine';
import _ from 'lodash';
import axios from 'axios';

const key = '02285a34-0c38-4162-b3c1-9a26d685948a';
const MERRIAM_API = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json';

export default ({ word, onSave, onCancel }) => {
  const EditWordStore = new ValueStream('editWord')
    .property('dictDef', null)
    .property('dictLoading', false, 'boolean')
    .property('dictLoaded', false, 'boolean')
    .method('save', (s) => {
      s.my.word.definition = s.my.newDef;
      console.log('word is now ', s.my.word);
      onSave(s.my.word);
    })
    .method('cancel', (s) => {
      onCancel();
    })
    .property('activeIndex', 0, 'integer')
    .method('lookup', (s) => {
      const url = `${MERRIAM_API}/${s.my.word.label.toLowerCase()}?key=${key}`;
      if (s.my.dictLoading) return;
      s.do.setDictLoaded(false);
      s.do.setDictLoading(true);
      axios.get(url)
        .then(s.do.completeLookup)
        .catch(s.do.lookupError);
    })
    .property('newDef', word.definition || '', 'string')
    .method('lookupError', (s, err) => {
      console.log('cannot find', s.my.word.label, err);
      s.do.setDictLoading(false);
      s.do.setDictLoaded(false);
      s.do.setDictLoadError(err);
    }, true)
    .method('completeLookup', (s, { data }) => {
      s.do.setDictDef(data);
      s.do.setDictLoaded(true);
      s.do.setDictLoading(false);
    }, true)
    .property('word', word);

  return EditWordStore;
};
