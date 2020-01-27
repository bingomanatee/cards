import React, { PureComponent } from 'react';
import { Box, Text, Button } from 'grommet';

import siteStore from '../../store/site.store';

export default class SiteHeader extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { ...siteStore.value };
  }

  componentDidMount() {
    this._sub = siteStore.subscribe((stream) => {
      console.log('site header knows undefinedWordCount = ',
        stream.my.undefinedWordCount);
      this.setState({ ...stream.value });
    });
  }

  componentWillUnmount() {
    this._sub.unsubscribe();
  }

  render() {
    const { undefinedWordCount } = this.state;
    return (
      <Box
        direction="row"
        background="brand"
        gap="medium"
        pad="none"
        align="center"
        alignContent="stretch"
        as="header"
        fill="vertical"
        className="SiteHeaderContainer"
      >
        <Box basis="300px" direction="column" className="logo" align="center">
          <img src="/img/logo.svg" />
          <Text
            as="div"
            size="1.25rem"
            color="accent-1"
            style={({ fontFamily: 'LotaGrotesqueAlt2-Black' })}
          >
            WORD QUIZ
          </Text>
        </Box>
        <Box direction="row-reverse" fill align="center" className="nav">
          {undefinedWordCount ? (
            <Button margin="small" primary color="accent-4" plain={false}>
              {undefinedWordCount}
              {' '}
              Undefined words
            </Button>
          ) : ''}
          <Button margin="small" plain={false}>
            {siteStore.do.listCount()}
            {' '}
            Word Lists
          </Button>
        </Box>
      </Box>
    );
  }
}
