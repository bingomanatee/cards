import { ValueStream } from '@wonderlandlabs/looking-glass-engine';
import _ from 'lodash';
import chroma from 'chroma-js';
import siteStore from '../../store/site.store';

const FADE_DURATION = 500;
const INTERVAL = 20;

export default ({ word, history, next }, ref) => {
  const WordPanelStore = new ValueStream('wordPanelStore')
    .property('word', word)
    .method('reveal', (s) => s.do.setReveal(!s.my.reveal))
    .method('next', (s) => {
      console.log('=====next word');
      s.do.setReveal(false);
      s.do.fadeFrom(Date.now());
    })
    .method('colorRef', (s, shade) => {
      if (!_.get(ref, 'current')) return;
      const color = chroma(shade, shade, shade).css();
      console.log('color = ', color);
      if (_.get(ref, 'current.style')) {
        ref.current.style.backgroundColor = color;
      }
    })
    .method('fadeFrom', (s, startTime) => {
      const now = Date.now();
      const duration = now - startTime;
      if (duration > FADE_DURATION) {
        s.do.colorRef(1);
        next();
      } else {
        const shade = Math.round(255 * (1 - (duration / FADE_DURATION)));
        s.do.colorRef(shade);
        setTimeout(() => s.do.fadeFrom(startTime), INTERVAL);
      }
    })
    .property('definition', '', 'string')
    .method('loadDef', (s) => {
      const wordData = siteStore.my.words.get(word);
      const def = _.get(wordData, 'definition', '');
      s.do.setDefinition(def);
    })
    .property('current', 0, 'integer')
    .property('reveal', false, 'boolean');

  WordPanelStore.do.loadDef();

  WordPanelStore.watch('word', 'loadDef');

  return WordPanelStore;
};
