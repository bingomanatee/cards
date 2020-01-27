import React, { Component } from 'react';
import {
  Box, Heading, Text, Button,
} from 'grommet';
import styled from 'styled-components';
import _ from 'lodash';
import wordPanelStoreFactory from './wordPanel.store';

const ImgBtn = styled.div`
width: 200px;
position: absolute;
right: 0;
bottom: 5rem;
`;

const NextBtn = styled.div`
position: absolute;
left: 5rem;
bottom: 5rem;
`;

export default class WordPanel extends Component {
  constructor(props) {
    super(props);
    this.innerRef = React.createRef();
    this.stream = wordPanelStoreFactory(props, this.innerRef);
    this.state = { ...this.stream.value };
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
      console.log('Word panel stream error: ', err);
    });
  }

  componentDidUpdate(props) {
    if (props.word !== this.props.word) {
      this.stream.do.setWord(props.word);
    }
  }

  render() {
    const {
      word, definition, reveal,
    } = this.state;
    const { done, children } = this.props;
    console.log('wordPanel: word = ', word);
    return (
      <Box fill pad="large" background="white">
        <Box
          ref={this.innerRef}
          direction="column"
          border={{
            color: done ? 'dark-2' : 'neutral-1', size: '1rem',
          }}
          pad="large"
          round="medium"
          fill
          extend={{ display: 'relative' }}
        >
          {done ? children : (
            <>
              <Heading textAlign="center" size="xlarge">{word}</Heading>

              {(reveal && definition) ? (
                <Text size="xlarge" margin="large">{definition}</Text>
              ) : ''}

              {definition ? (
                <ImgBtn onClick={this.stream.do.reveal}>
                  <img src="/img/reveal.svg" />
                </ImgBtn>
              ) : false}

              <NextBtn>
                <Button
                  plain={false}
                  primary
                  icon={<Box pad="small"><img src="/img/next.svg" /></Box>}
                  onClick={() => {
                    console.log('next!');
                    this.stream.do.next();
                  }}
                  label={<Text size="large">Next Word</Text>}
                />
              </NextBtn>
            </>
          )}

        </Box>
      </Box>
    );
  }
}
