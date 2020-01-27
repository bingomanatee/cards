import {
  Text, TextInput, Box, Button, Heading,
} from 'grommet';
import React, { Component } from 'react';
import PageFrame from '../../views/PageFrame';
import siteStore from '../../store/site.store';

export default class About extends Component {
  render() {
    const { history } = this.props;
    return (
      <PageFrame>
        <Heading color="accent-1">About Word Quiz</Heading>

        <Text>Word Quiz presents a series of words to quiz the viewer on term definitions. </Text>

        <Heading level={2}>Word Lists</Heading>
        <Text>
          Each quiz presents a word from the list of words, which are a named series of terms. The terms are defined
          in the
          {' '}
          <Button plain color="accent-1"  onClick={() => history.push('/words')}>Words</Button>
          {' '}
          collection, which provide a definition for the word.
          While it is not necessary to define the words, if you don't, the quiz won't provide a hint for the user.
        </Text>

        <Text>
          You can
          {' '}
          <Button plain color="accent-1" onClick={() => history.push('/create-lists')}>Create a new word list</Button>
          {' '}
          which simultaneously adds a word list and its words to the dictionary. After you add a word list,

          {' '}
          <Button plain  color="accent-1" onClick={() => history.push('/words')}>Visit the Word List</Button>
          {' '}
          to add definitions to the words. (you can use the dictionary lookup to help you.)
        </Text>

        <Heading level={2}>Playing a WordList</Heading>
        <Text>
          A WordList can be played from the home page or the
          {' '}
          <Button plain  color="accent-1" color="accent-1"  onClick={() => history.push('/lists')}>Word List</Button>
          {' '}
          page.
        </Text>

        <Heading level={2}>Lifespan of Word Lists</Heading>
        <Text>Word Lists and Words are stored in local storage. </Text>

        <Heading color="status-critical">Resetting local data</Heading>
        <Text>
          If you have made an utter mess of your words or lists and want to reset to "factory settings"
        </Text>
        <Button primary  color="accent-1" color="status-critical" plain={false} onClick={siteStore.do.reset}>Click Here to Reset</Button>
        <Text>
          and all your word customization or lists are erased.
        </Text>
      </PageFrame>
    );
  }
}
