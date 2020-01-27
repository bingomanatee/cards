import { ValueStream } from '@wonderlandlabs/looking-glass-engine';
import _ from 'lodash';
import siteStore from '../../store/site.store';
const MODE_RE = /\?.*mode=([\w]+)/
export default (props, url) => {
  const { words } = siteStore.my;

  const { match } = props;
  console.log('match:', match, url);
  let mode = 'all';
  if (MODE_RE.test(url)) {
    mode = MODE_RE.exec(url)[1] || 'all';
  }

  const WordsStore = new ValueStream('words')
    .property('words', Array.from(words.values()), 'array')
    .property('searchField', '', 'string')
    .property('listMode', mode)
    .property('activeWord', null)
    .method('saveActiveWord', (s, word) => {
      s.do.clearActiveWord();
      s.do.setWords([...s.my.words]);
      siteStore.do.updateWord(word);
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
