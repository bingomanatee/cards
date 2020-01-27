import {
  Button, Heading, Layer, Stack, Box, Text,
} from 'grommet';
import React, { Component } from 'react';
import listStoreFactory from './list.store';
import PageFrame from '../../views/PageFrame';
import WordPanel from './WordPanel';

export default class List extends Component {
  constructor(props) {
    // const { match } = props;
    super(props);

    this.stream = listStoreFactory(props);

    this.state = { ...this.stream.state };
  }

  componentWillUnmount() {
    if (this._sub) {
      this._sub.unsubscribe();
    }
  }

  componentDidMount() {
    this._sub = this.stream.subscribe(({ value }) => {
      this.setState(value);
    }, (err) => {
      console.log('list stream error: ', err);
    });
  }

  render() {
    const {
      list, words, wordIndex, frame,
    } = this.state;
    if (!list) {
      return (
        <PageFrame>
          <Heading>Error - missing list </Heading>
          <Button primary plain={false} onClick={() => this.props.history.push('/')}>Go Home</Button>
        </PageFrame>
      );
    }
    return (
      <Layer full>
        <Box direction="row" justify="between">
          <Button
            primary
            round={0}
            color="neutral-4"
            icon={<Box pad="small"><img src="/img/replay-sm.svg" /></Box>}
            label={<Text color="white">Replay</Text>}
            plain={false}
            pad="0"
            margin="small"
            onClick={this.stream.do.replay}
          />
          <Heading size="2rem" color="neutral-4" textAlign="center">
            List &#8220;{list.label}&#8221;
            {wordIndex < words.length ? ` (${wordIndex + 1} of ${words.length})` : ' done '}
          </Heading>
          <Button
            primary
            reverse
            round={0}
            color="neutral-4"
            icon={<Box pad="small"><img src="/img/home-sm.svg" /></Box>}
            label={<Text color="white">Try Another List</Text>}
            plain={false}
            pad="0"
            margin="small"
            onClick={this.stream.do.goHome}
          />
        </Box>
        {(wordIndex < words.length) ? (
          <Stack fill>
            {words.slice(0, wordIndex + 1).map((word) => (
              <WordPanel
                next={this.stream.do.next}
                key={`${frame}-${wordIndex}`}
                word={word}
              />
            ))}
          </Stack>
        ) : (
          <WordPanel done>
            <Heading textAlign="center">
              You have viewed all the words in
              {list.label}
              !
            </Heading>
            <Box direction="row" pad="large" justify="around" align="center">
              <Button
                primary
                icon={<Box pad="small"><img src="/img/replay.svg" /></Box>}
                label={<Text size="large">Try Again</Text>}
                plain={false}
                pad="large"
                onClick={this.stream.do.replay}
              />
              <Button
                primary
                icon={<Box pad="small"><img src="/img/home.svg" /></Box>}
                label={<Text size="large">Try Another List</Text>}
                plain={false}
                pad="large"
                onClick={this.stream.do.goHome}
              />
            </Box>
          </WordPanel>
        )}
      </Layer>
    );
  }
}
/*

  */
