import { ValueStream } from '@wonderlandlabs/looking-glass-engine';
import _ from 'lodash';
import siteStore from '../../store/site.store';

export default (props) => {
  const { match, history } = props;
  const labelB = _.get(props, 'match.params.label', '');
  const label = decodeURIComponent(labelB);
  console.log('match: ', match, 'label:', labelB, label);

  const list = siteStore.my.lists.get(label);
  const words = _.get(list, 'words', []);
  const ListStore = new ValueStream('listStore')
    .property('list', list)
    .property('wordIndex', 0, 'integer')
    .method('reveal', (s, word) => {
      word.reveal = true;
      s.do.setWords([...s.my.words]);
    })
    .method('next', (s) => {
      console.log('------ updating wordIndex:', s.my.wordIndex);
      try {
        s.do.setWordIndex(s.my.wordIndex + 1);
        console.log('------ to:', s.my.wordIndex);
      } catch (err) {
        console.log('update error:', err);
      }
      s.broadcast();
    })
    .method('goHome', (s) => {
      history.push('/');
    })
    .property('frame', 0, 'integer')
    .method('incFrame', (s) => s.do.setFrame(s.my.frame + 1))
    .method('replay', (s) => {
      s.do.setWords(_.shuffle(s.my.words));
      s.do.setWordIndex(0);
    })
    .property('words', _.shuffle(words));

  ListStore.watch('wordIndex', 'incFrame');
  ListStore.subscribe(({ value }) => {
    console.log('----words:', value.words);
    console.log('---wordIndex:', value.wordIndex);
  });
  return ListStore;
};
