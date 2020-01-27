import { proppify } from '@wonderlandlabs/propper';
import siteStore from '../../store/site.store';

export class WordTile {
  constructor(word) {
    this.label = word;
    this.word = siteStore.my.words.get(word);
  }
}

proppify(WordTile)
  .addProp('label', '', 'string')
  .addProp('reveal', false, 'boolean')
  .addProp('word', null);
