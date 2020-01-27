import { ValueStream } from '@wonderlandlabs/looking-glass-engine';

export default (props) => {
  const CreateList = new ValueStream('createList')
    .property('label', '', 'string')
    .method('reset', (s) => {
      s.do.setLabel('');
      s.do.setWords([]);
    })
    .property('newWord', '', 'string')
    .property('words', [], 'array');

  return CreateList;
};
