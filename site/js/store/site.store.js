import { ValueStream } from '@wonderlandlabs/looking-glass-engine';
import is from 'is';
import _ from 'lodash';

import Word from './Word';

localStorage.setItem('l.nouns', JSON.stringify({
  type: 'list',
  label: 'nouns',
  words: ['hide', 'find', 'sort'],
}));
localStorage.setItem('w.hide', JSON.stringify({
  type: 'word',
  label: 'hide',
  definition: 'to conceal',
}));
localStorage.setItem('w.find', JSON.stringify({
  type: 'word',
  label: 'find',
  definition: 'to locate',
}));

const SiteStore = new ValueStream('siteStore')
  .method('inc', (s) => s.setCount(s.my.count + 1))
  .method('decodeEntry', (s, key, data) => {
    switch (data.type) {
      case 'word':
        s.do.addWord(data);
        break;

      case 'list':
        s.do.addList(data);
        break;
    }
  })
  .method('updateWord', (s, word) => {
    s.do.newWord({ label: word.label, definition: word.definition });
    s.do.updateCounts();
  })
  .method('addWord', (s, data) => {
    const word = new Word(data);
    s.my.words.set(word.label, word);
    s.do.updateCounts();
    s.broadcast();
  })
  .method('newWord', (s, data) => {
    let def;
    try {
      def = JSON.stringify({ type: 'word', ...data });
    } catch (err) {
      console.log('cannot add new word ', data, err);
      return;
    }
    localStorage.setItem(`l.${data.label}`, def);
    s.do.addWord(data);
  })
  .method('addList', (s, { label, words }) => {
    if (Array.isArray(words)) {
      s.my.lists.set(label, {
        label, words,
      });
    }
    s.broadcast();
  })
  .method('listCount', (s) => s.my.lists.size)
  .method('newList', (s, { label, words }) => {
    s.do.addList(`l.${label}`, { label, words });
    localStorage.setItem(`l.${label}`, JSON.stringify({ type: 'list', label, words }));

    words.forEach((word) => {
      if (!s.my.words.has(word)) {
        s.do.newWord({
          label: word,
          definition: '',
        });
      }
    });
  })
  .method('undefinedWords', (s) => {
    let undef = 0;
    s.my.words.forEach((word) => {
      if (!_.trim(word.definition)) ++undef;
    });
    return undef;
  })
  .method('loadFromStore', (s) => {
    if (typeof localStorage === 'undefined') {
      return;
    }
    Object.entries(localStorage).forEach(([key, value]) => {
      try {
        const data = JSON.parse(value);
        if (data) {
          s.do.decodeEntry(key, data);
        }
      } catch (err) {
        console.log('cannot parse ', key);
      }
    });
  })
  .method('updateCounts', (s) => {
    if (s.my.undefinedWordCount !== s.do.undefinedWords()) {
      s.do.setUndefinedWordCount(s.do.undefinedWords());
    }
    if (s.my.wordCount !== s.my.words.size) {
      s.do.setWordCount(s.my.words.size);
    }
  })
  .property('words', new Map())
  .property('wordCount', 0)
  .property('undefinedWordCount', 0)
  .property('lists', new Map());

const sub = SiteStore.subscribe((s) => {
  s.do.updateCounts();
}, (e) => console.log('error in global stream', e));

SiteStore.do.loadFromStore();

export default SiteStore;
