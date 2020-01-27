import { ValueStream } from '@wonderlandlabs/looking-glass-engine';
import _ from 'lodash';
import storeStream from '../../store/site.store';

export default (words) => {
  const WordsStore = new ValueStream('words')
    .property('words', Array.from(words.values()), 'array')
    .property('searchField', '', 'string')
    .property('listMode', 'all')
    .property('activeWord', null)
    .method('saveActiveWord', (s, word) => {
      s.do.clearActiveWord();
      s.do.setWords([...s.my.words]);
      storeStream.do.updateWord(word);
    }, true)
    .method('clearActiveWord', (s) => {
      s.do.setActiveWord(null);
    })
    .method('all', (s) => {
      console.log('view all');
      s.do.setListMode('all');
    })
    .method('viewDefined', (s) => {
      console.log('view defined');
      s.do.setListMode('defined');
    })
    .method('viewUndefined', (s) => {
      console.log('view undefined');
      s.do.setListMode('undefined');
    })
    .method('sortedWords', (s) => {
      let sorted = _.sortBy(s.my.words, 'label');
      console.log('sorted:', sorted);
      switch (s.my.listMode) {
        case 'defined':
          sorted = sorted.filter((w) => w.isDefined);
          break;

        case 'undefined':
          sorted = sorted.filter((w) => !w.isDefined);
          break;
      }
      if (s.my.searchField) {
        const re = new RegExp(s.my.searchField, 'i');
        return sorted.filter((w) => re.test(w.label));
      }
      return sorted;
    });

  return WordsStore;
};
