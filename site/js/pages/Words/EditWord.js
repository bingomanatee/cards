import {
  Text, TextInput, TextArea, Box, Button, List, Heading, Tabs, Tab, Grid, Layer, Accordion, AccordionPanel,
} from 'grommet';
import React, { Component } from 'react';
import _ from 'lodash';
import siteStore from '../../store/site.store';
import editWordFactory from './editWord.store';

export default class EditWord extends Component {
  constructor(props) {
    super(props);
    this.stream = editWordFactory(props);
    this.state = { ...this.stream.value };
    this.updateDef = this.updateDef.bind(this);
    this.addToDef = this.addToDef.bind(this);
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

    this.stream.do.lookup();
  }

  updateDef(e) {
    const def = e.target.value || '';
    this.setState({ newDef: def }, () => {
      this.stream.do.setNewDef(def);
    });
  }

  addToDef(def) {
    const newDef = `${this.state.newDef}\n\n${def}`;
    this.setState({ newDef }, () => {
      this.stream.do.setNewDef(newDef);
    });
  }

  render() {
    const {
      word, dictLoading, dictLoaded, dictError, dictDef, newDef, activeIndex
    } = this.state;
    return (
      <Box
        pad="large"
        overflow="hidden"
        fill
      >
        <Box
          border={{
            color: 'accent-3', size: '3px',
          }}
          elevation="large"
          round="medium"
          background="white"
          pad="medium"
          as="section"
          fill
        >
          <Grid
            columns={['flex', '1/3', '1/4']}
            rows={['5rem', 'flex', '5rem']}
            style={{height: '100%'}}
            areas={[
              {
                name: 'head',
                end: [0, 2],
                start: [0, 0],
              },
              {
                name: 'dict',
                start: [2, 1],
                end: [2, 2],
              },
              {
                name: 'field',
                start: [1, 1],
                end: [1, 2],
              },
              {
                name: 'main',
                start: [0, 1],
                end: [0, 1],
              },
              {
                name: 'buttons',
                start: [0, 2],
                end: [0, 2],
              },
            ]}
          >
            <Box gridArea="head">
              <Heading color="accent-3">
                Editing Word &quot;
                {word.label}
                &quot;
              </Heading>
            </Box>

            <Box gridArea="main" overflow="auto"
                 pad="small">
              <Heading level={2}>Current Definition:</Heading>
              <Text size="large" pad="medium">{word.definition || ''}</Text>
            </Box>

            <Box
              gridArea="field"
              overflow="auto"
              pad="small"
            >
              <Heading level={2}>New Definition:</Heading>
              <TextArea fill value={newDef} onChange={this.updateDef} />
            </Box>
            <Box gridArea="buttons" gap="small" pad={0} direction="row" justify="around">
              <Box>
                <Button pad="small" plain={false} onClick={this.stream.do.save}>Save</Button>
              </Box>
              <Box>
                <Button pad="small" plain={false} onClick={this.stream.do.cancel}>Cancel</Button>
              </Box>
            </Box>

            <Box
              gridArea="dict"
              overflow="auto"
              pad="medium"
            >
              {dictLoading ? <Text><i>Loading dictionary definition...</i></Text> : ''}
              {dictLoaded && dictDef ? (
                <Accordion activeIndex={activeIndex} onActive={([i]) => {
                  this.stream.do.setActiveIndex(i);
                }}>
                  {dictDef.map((definition, i) => (
                    <AccordionPanel key={_.get(definition, 'meta.uuid', i)} label={`${i + 1}: ${_.get(definition, 'hwi.fi', '')}`}>
                      {_.get(definition, 'shortdef', []).join(' ')}
                      <Button plain={false} onClick={() => this.addToDef(_.get(definition, 'shortdef', []).join(' '))}>Add To Definition</Button>
                    </AccordionPanel>
                  ))}
                </Accordion>
              ) : ''}
            </Box>
          </Grid>
        </Box>
      </Box>
    );
  }
}
