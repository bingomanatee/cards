import React, { PureComponent } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Grommet, Grid, Box } from 'grommet';

import SiteHeader from '../SiteHeader';
import Content from '../../views/Content';
import Navigation from '../Navigation';

import MainGrid from './MainGrid';
import siteStore from '../../store/site.store';
import theme from '../../theme';

// pages

import Home from '../../pages/Home';
import CreateList from '../../pages/CreateList';
import Words from '../../pages/Words';
import Lists from '../../pages/Lists';
import About from '../../pages/About';
import List from '../../pages/List';

export default class Main extends PureComponent {
  render() {
    return (
      <main>
        <Grommet theme={theme} full>
          <MainGrid>
            <Box gridArea="header">
              <SiteHeader />
            </Box>
            <Box gridArea="nav" background="brand">
              <Navigation />
            </Box>
            <Box gridArea="main" background="brand">
              <Content>
                <Switch>
                  <Route path="/" exact component={Home} />
                  <Route path="/create-list" component={CreateList} />
                  <Route path="/lists" component={Lists} />
                  <Route path="/list/:label" component={List} />
                  <Route path="/words" component={Words} />
                  <Route path="/about" component={About} />
                  <Route component={Home} />
                </Switch>
              </Content>
            </Box>
          </MainGrid>
        </Grommet>
      </main>
    );
  }
}
