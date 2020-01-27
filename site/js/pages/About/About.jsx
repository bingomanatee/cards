import {
  Text, TextInput, Box, Button, Heading,
} from 'grommet';
import React, { Component } from 'react';
import PageFrame from '../../views/PageFrame';

export default class About extends Component {
  render() {
    return (
      <PageFrame>
        <Heading color="neutral-1">About Word Quiz</Heading>

        <Text>Word Quiz presents a series of words to quiz the viewer on term definitions. </Text>

        <Heading level={2}>Word Lists</Heading>
        <Text>
          Each quiz presents a word from the list of words, which are a named series of terms. The terms are defined
          in the
          {' '}
          <a href="/words">Words</a>
          {' '}
          collection, which provide a definition for the word.
          While it is not necessary to define the words, if you don't, the quiz won't provide a hint for the user.
        </Text>

        <Text>
          You can
          {' '}
          <a href="/create-lists">Create a new word list</a>
          {' '}
          which simultaneously adds a word list and its words to the dictionary. After you add a word list,

          {' '}
          <a href="/words">Visit the Word List</a>
          {' '}
          to add definitions to the words. (you can use the dictionary lookup to help you.)
        </Text>

        <Heading level={2}>Playing a WordList</Heading>
        <Text>
          A WordList can be played from the home page or the
          {' '}
          <a href="/lists">Word List</a>
          {' '}
          page.
        </Text>

        <Heading level={2}>Lifespan of Word Lists</Heading>
        <Text>Word Lists and Words are stored in local storage. </Text>
      </PageFrame>
    );
  }
}
