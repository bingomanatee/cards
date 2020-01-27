import {
  Text, TextInput, Box, Button, List, Heading, Tabs, Tab, Grid, Layer,
} from 'grommet';
import React, { Component } from 'react';
import styled from 'styled-components';

import PageFrame from '../../views/PageFrame';
import wordsStore from './words.store';
import siteStore from '../../store/site.store';
import EditWord from './EditWord';
import ItemWrapper from '../../views/ItemWrapper';

const MODES = ['all', 'defined', 'undefined'];

export default class Words extends Component {
  constructor(props) {
    super(props);
    this.stream = wordsStore(siteStore.my.words);
    this.state = { ...this.stream.value };
  }

  componentWillUnmount() {
    if (this._sub) {
      this._sub.unsubscribe();
    }
  }

  componentDidMount() {
    this._sub = this.stream.subscribe((stream) => {
      console.log('state is ', stream.value);
      this.setState(stream.value);
    }, (err) => {
      console.log('word stream error: ', err);
    });
  }

  render() {
    const { listMode, activeWord } = this.state;
    return (
      <>
        {activeWord ? (
          <Layer full plain animation="fadeIn">
            <EditWord word={activeWord} onCancel={this.stream.do.clearActiveWord} onSave={this.stream.do.saveActiveWord} />
          </Layer>
        ) : ''}
        <PageFrame>
          <Heading color="neutral-1">Words</Heading>

          <Box direction="row" justify="center" gap="medium" fill="horizontal">
            {MODES.map((mode) => (
              <Box
                key={mode}
                background={listMode === mode ? 'accent-2' : '#FFF'}
                pad="small"
                onClick={() => this.stream.do.setListMode(mode)}
                direction="row"
                round="small"
              >
                <Text>
View
                  {` ${mode} ` }
Words
                </Text>
              </Box>
            ))}
          </Box>

          {this.stream.do.sortedWords().map((item, index) => (
            <ItemWrapper key={item.label}>
              <Grid
                columns={['150px', 'auto', '150px']}
                rows={['auto', 'auto']}
                gap="2px"
                fill
                areas={[
                  {
                    name: 'label',
                    start: [0, 0],
                    end: [0, 0],
                  },
                  {
                    name: 'word',
                    start: [1, 0],
                    end: [1, 0],
                  },
                  {
                    name: 'icon',
                    start: [2, 0],
                    end: [2, 0],
                  },
                  {
                    name: 'def',
                    start: [1, 1],
                    end: [2, 1],
                  },
                  {
                    name: 'defBtn',
                    start: [0, 1],
                    end: [0, 1],
                  },
                ]}
              >
                <Box pad="2px" gridArea="icon">
                  <img src={item.definition ? '/img/wordOk.svg' : '/img/wordUndef.svg'} />
                </Box>
                <Box pad="2px" gridArea="label" direction="row-reverse" align="end">
                  <Text textAlign="right">Word:</Text>
                </Box>
                <Box pad="2px" gridArea="word">
                  <Text weight="bold">{item.label}</Text>
                </Box>
                <Box gridArea="defBtn" pad={0} fill="true" direction="column-reverse">
                  <Button plain={false} color="brand" margin="medium" onClick={() => this.stream.do.setActiveWord(item)}>
                  Define
                  </Button>
                </Box>
                <Box pad="2px" gridArea="def">
                  <Text>{item.definition || '(undefined)'}</Text>
                </Box>
              </Grid>
            </ItemWrapper>
          ))}
        </PageFrame>
      </>
    );
  }
}
