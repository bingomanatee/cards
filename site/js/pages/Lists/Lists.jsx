import {
  Text, TextInput, Box, Button, Heading, List, Layer,
} from 'grommet';
import _ from 'lodash';
import React, { Component } from 'react';
import siteStore from '../../store/site.store';
import PageFrame from '../../views/PageFrame';
import ItemWrapper from '../../views/ItemWrapper';

export default class Lists extends Component {
  constructor(props) {
    // const { match } = props;
    super(props);

    this.stream = siteStore;

    this.state = { showWordsFor: null, toDelete: null, ...this.stream.value };

    this.goCreate = this.goCreate.bind(this);
    this.showWordsFor = this.showWordsFor.bind(this);
    this.delete = this.delete.bind(this);
    this.doDelete = this.doDelete.bind(this);
    this.quiz = this.quiz.bind(this);
  }

  showWordsFor(list) {
    if (list === this.state.showWordsFor) list = null;
    this.setState({ showWordsFor: list });
  }

  componentWillUnmount() {
    if (this._sub) this._sub.unsubscribe();
  }

  componentDidMount() {
    this._sub = this.stream.subscribe(({ state }) => {
      this.setState(state);
    }, (err) => {
      console.log('beta stream error: ', err);
    });
  }

  wordSummary(list) {
    const words = _.get(list, 'words', []);
    if (Array.isArray(words)) {
      return words.slice(0, 4).join(', ');
    }
    return '...';
  }

  goCreate() {
    this.props.history.push('/create-list');
  }

  quiz(list) {
    this.props.history.push(`/list/${encodeURIComponent(list.label)}`);
  }

  delete(list) {
    this.setState({ toDelete: list });
  }

  doDelete() {
    if (this.state.toDelete) {
      siteStore.do.deleteList(this.state.toDelete);
      this.setState({ toDelete: null });
    }
  }

  render() {
    const { lists, showWordsFor, toDelete } = this.state;
    console.log('---- lists', lists);
    return (
      <PageFrame>
        {toDelete ? (
          <Layer full margin="large" plain>
            <Box
              justify="between"
              background="white"
              border={{ size: '3px', color: 'status-warning' }}
              gap="medium"
              round="medium"
              elevation="large"
              pad="medium"
              direction="column"
              align="center"
            >
              <Heading>
Delete list "
                {toDelete.label}
"?
              </Heading>
              <Text textAlgin="center" size="large">
                permanently delete this list from memory? The words will not be deleted.
              </Text>
              <Box direction="row" justify="around" gap="large">
                <Button primary color="status-warning" plain={false} onClick={() => this.doDelete()}>Delete List</Button>
                <Button primary plain={false} onClick={() => this.delete()}>Cancel</Button>
              </Box>
            </Box>
          </Layer>
        ) : ''}
        <Heading color="accent-1">Word Lists</Heading>
        <Button margin="small" primary plain={false} onClick={this.goCreate}>Create New List</Button>
        {Array.from(lists.values()).map((list) => (
          <ItemWrapper key={list.label}>
            <Box direction="row" fill="horizontal" pad="4px" align="center" justify="stretch">
              <Button primary plain={false} onClick={() => this.quiz(list)} icon={<img src="/img/next.svg" />} label="Quiz" />
              <Box basis="1/3" pad="small">
                <Text weight="bold">
                  {list.label}
                  {` (${_.get(list, 'words.length', 0)})`}
                </Text>
              </Box>
              <Box basis="full">
                <Text size="small">
                  {this.wordSummary(list)}
                  {' '}
                </Text>
              </Box>
              <Button plain={false} onClick={() => this.showWordsFor(list)}>Words</Button>
              <Button margin="small" plain onClick={() => this.delete(list)} icon={<img src="/img/delete.svg" />} />
            </Box>
            {_.get(showWordsFor, 'label') === list.label ? <List data={list.words} /> : ''}
          </ItemWrapper>
        ))}
      </PageFrame>
    );
  }
}
