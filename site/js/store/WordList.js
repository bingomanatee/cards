import _ from 'lodash';
import { proppify } from '@wonderlandlabs/propper';
import is from 'is';

export default class WordList {
  constructor(props) {
    this.label = _.get(props, 'label', '');
    this.words = this.validWords(_.get(props, 'words', []));
  }

  validWords(words) {
    const valid = _(words)
      .compact()
      .filter((w) => is.string(w) && w.length)
      .uniq()
      .sortBy()
      .value();

    console.log('words:', words, 'valid: ', valid);
    return valid;
  }

  get isValid() {
    return this.errors.length < 1;
  }

  get errors() {
    const errors = [];
    if (!this.label) errors.push('no label');
    if (this.words.length < 3) errors.push(`not enough words: ${this.words.join(', ')}`);
    return errors;
  }

  clone() {
    return new WordList(this);
  }
}

proppify(WordList)
  .addProp('label', '', 'string')
  .addProp('words', [], 'array');
