import { ValueStream } from '@wonderlandlabs/looking-glass-engine';
import is from 'is';
import _ from 'lodash';

import Word from './Word';
import WordList from './WordList';

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
    localStorage.setItem(`w.${data.label}`, def);
    s.do.addWord(data);
  })
  .method('addList', (s, list) => {
    const newList = new WordList(list);
    if (newList.isValid) s.my.lists.set(newList.label, newList);
    else console.log('invalid list:', newList, newList.errors, 'from', list);
    s.broadcast('lists');
  })
  .method('listCount', (s) => s.my.lists.size)
  .method('deleteList', (s, list) => {
    const label = _.get(list, 'label');
    console.log('----- deleting list ', label, list);
    if (s.my.lists.has(label)) {
      s.my.lists.delete(label);
      localStorage.removeItem(`l.${label}`);
    }
    s.do.updateCounts();
  })
  .method('newList', (s, list) => {
    console.log('new list ---  listCount = ', s.my.listCount);
    const { label, words } = list;
    s.do.addList(list);
    localStorage.setItem(`l.${label}`, JSON.stringify({ type: 'list', label, words }));

    words.forEach((word) => {
      if (!s.my.words.has(word)) {
        s.do.newWord({
          label: word,
          definition: '',
        });
      }
    });

    console.log('------- cloning list map');
    const map = new Map();
    s.my.lists.forEach((item, key) => {
      map.set(key, item);
    });
    s.do.setLists(map);
    s.do.updateCounts();
    s.broadcast();
    console.log('---- done with new list ', list);
    console.log('new list ---  list length = ', s.my.lists.size, 'after', list);
  }, true)
  .method('undefinedWords', (s) => {
    let undef = 0;
    s.my.words.forEach((word) => {
      if (!_.trim(word.definition)) {
        ++undef;
      }
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
    if (s.my.listCount !== s.my.lists.size) {
      s.do.setListCount(s.my.lists.size);
      console.log('updating list count', s.my.listCount);
    }
  })
  .method('reset', (s) => {
    localStorage.clear();
    s.do.initialize();
    window.location.reload();
  })
  .method('initialize', (s) => {
    s.do.newList({
      label: 'Types of insurance',
      words: ['health insurance', 'vehicle insurance', 'life insurance'],
    });

    s.do.newWord({
      label: 'health insurance',
      definition: 'Health insurance policies cover the cost of medical treatments. Dental insurance, like medical insurance, protects policyholders for dental costs. In most developed countries, all citizens receive some health coverage from their governments, paid through taxation. In most countries, health insurance is often part of an employer\'s benefits.',
    });

    s.do.newWord({
      label: 'vehicle insurance',
      definition: 'Vehicle insurance (also known as car insurance, motor insurance, or auto insurance) is insurance for cars, trucks, motorcycles, and other road vehicles. Its primary use is to provide financial protection against physical damage or bodily injury resulting from traffic collisions and against liability that could also arise from incidents in a vehicle. Vehicle insurance may additionally offer financial protection against theft of the vehicle, and against damage to the vehicle sustained from events other than traffic collisions, such as keying, weather or natural disasters, and damage sustained by colliding with stationary objects. The specific terms of vehicle insurance vary with legal regulations in each region. ',
    });

    s.do.newWord({
      label: 'life insurance',
      definition: 'Life insurance provides a monetary benefit to a decedent\'s family or other designated beneficiary, and may specifically provide for income to an insured person\'s family, burial, funeral and other final expenses. Life insurance policies often allow the option of having the proceeds paid to the beneficiary either in a lump sum cash payment or an annuity. In most states, a person cannot purchase a policy on another person without their knowledge. ',
    });

    s.do.newList({
      label: 'Insurable Risks',
      words: ['Large number of similar exposure units', 'Definite Loss',
        'Accidental Loss', 'Large Loss', 'Affordable Premium', 'Calculable Loss',
        'Limited risk of catastrophically large losses',
      ],
    });

    s.do.newWord({
      label: 'Large number of similar exposure units',
      definition: 'Since insurance operates through pooling resources, the majority of insurance policies are provided for individual members of large classes, allowing insurers to benefit from the law of large numbers in which predicted losses are similar to the actual losses. Exceptions include Lloyd\'s of London, which is famous for insuring the life or health of actors, actresses and sports figures. However, all exposures will have particular differences, which may lead to different rates.',
    });

    s.do.newWord({
      label: 'Definite Loss',
      definition: 'The loss takes place at a known time, in a known place, and from a known cause. The classic example is death of an insured person on a life insurance policy. Fire, automobile accidents, and worker injuries may all easily meet this criterion. Other types of losses may only be definite in theory. Occupational disease, for instance, may involve prolonged exposure to injurious conditions where no specific time, place or cause is identifiable. Ideally, the time, place and cause of a loss should be clear enough that a reasonable person, with sufficient information, could objectively verify all three elements.',
    });

    s.do.newWord({
      label: 'Accidental Loss',
      definition: 'The event that constitutes the trigger of a claim should be fortuitous, or at least outside the control of the beneficiary of the insurance. The loss should be ‘pure,’ in the sense that it results from an event for which there is only the opportunity for cost. Events that contain speculative elements, such as ordinary business risks, are generally not considered insurable.',
    });

    s.do.newWord({
      label: 'Large Loss',
      definition: ' The size of the loss must be meaningful from the perspective of the insured. Insurance premiums need to cover both the expected cost of losses, plus the cost of issuing and administering the policy, adjusting losses, and supplying the capital needed to reasonably assure that the insurer will be able to pay claims. For small losses these latter costs may be several times the size of the expected cost of losses. There is little point in paying such costs unless the protection offered has real value to a buyer.',
    });

    s.do.newWord({
      label: 'Affordable Premium',
      definition: ' If the likelihood of an insured event is so high, or the cost of the event so large, that the resulting premium is large relative to the amount of protection offered, it is not likely that anyone will buy insurance, even if on offer. Further, as the accounting profession formally recognizes in financial accounting standards, the premium cannot be so large that there is not a reasonable chance of a significant loss to the insurer. If there is no such chance of loss, the transaction may have the form of insurance, but not the substance.',
    });

    s.do.newWord({
      label: 'Calculable Loss',
      definition: 'There are two elements that must be at least estimable, if not formally calculable: the probability of loss, and the attendant cost. Probability of loss is generally an empirical exercise, while cost has more to do with the ability of a reasonable person in possession of a copy of the insurance policy and a proof of loss associated with a claim presented under that policy to make a reasonably definite and objective evaluation of the amount of the loss recoverable as a result of the claim.',
    });

    s.do.newWord({
      label: 'Limited risk of catastrophically large losses',
      definition: 'Insurable losses are ideally independent and non-catastrophic, meaning that the one losses do not happen all at once and individual losses are not severe enough to bankrupt the insurer; insurers may prefer to limit their exposure to a loss from a single event to some small portion of their capital base, on the order of 5 percent. Capital constrains insurers\' ability to sell earthquake insurance as well as wind insurance in hurricane zones. In the U.S., flood risk is insured by the federal government. An instance where the question whether insurability exists is contested is the case of nanotechnology.[4] In commercial fire insurance it is possible to find single properties whose total exposed value is well in excess of any individual insurer\'s capital constraint. Such properties are generally shared among several insurers, or are insured by a single insurer who syndicates the risk into the reinsurance market.',
    });
  })
  .property('words', new Map())
  .property('wordCount', 0)
  .property('listCount', 0)
  .property('undefinedWordCount', 0)
  .property('lists', new Map());

const sub = SiteStore.subscribe((s) => {
  s.do.updateCounts();
}, (e) => console.log('error in global stream', e));

SiteStore.do.loadFromStore();
if (!SiteStore.my.lists.has('Types of Insurance')) {
  SiteStore.do.initialize();
}


export default SiteStore;
