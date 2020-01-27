import _ from 'lodash';
import { proppify } from '@wonderlandlabs/propper';

export default class Word {
  constructor(props) {
    this.label = _.get(props, 'label', '');
    this.definition = _.get(props, 'definition', '');
  }

  get isDefined() {
    return !!_.trim(this.definition);
  }

  clone() {
    return new Word(this);
  }
}

proppify(Word)
  .addProp('label', '', 'string')
  .addProp('reveal', false, 'boolean')
  .addProp('definition', '', 'string');
