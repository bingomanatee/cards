import React, { PureComponent } from 'react';
import {
  Button, DropButton, ResponsiveContext, Box,
} from 'grommet';
import styled from 'styled-components';
import NavGrid from './NavGrid';
import siteStore from '../../store/site.store';

const NavItem = styled.div`
margin-top: 1rem;
margin-right: 1rem;
margin-left: -1px;
`;

const NavItemSmall = styled.div`
margin: 2px;
height: 2rem;
`;
const NavButtonInner = styled(Button)`
text-align: center;
`;

const NavButton = (props) => (
  <ResponsiveContext.Consumer>
    {(size) => {
      const Container = NavItemSmall; //  (size === 'small') ? NavItemSmall : NavItem;
      return (
        <Container>
          <NavButtonInner color="brand" {...props} plain={false} fill>
            {props.children}
          </NavButtonInner>
        </Container>
      );
    }}
  </ResponsiveContext.Consumer>
);

export default class Navigation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { ...siteStore.value };
  }

  componentDidMount() {
    this._sub = siteStore.subscribe(({ value }) => this.setState(value));
  }

  componentWillUnmount() {
    this._sub.unsubscribe();
  }

  render() {
    const { history } = this.props;
    const { wordCount } = this.state;
    return (
      <NavGrid>
        <NavButton onClick={() => history.push('/')}>
          Home
        </NavButton>
        <NavButton onClick={() => history.push('/create-list')}>
          Create List
        </NavButton>
        <NavButton onClick={() => history.push('/lists')}>
          Word Lists
        </NavButton>
        <NavButton onClick={() => history.push('/words')}>
          Words
          {` (${wordCount})`}
        </NavButton>
        <NavButton onClick={() => history.push('/about')}>
          Help
        </NavButton>
      </NavGrid>
    );
  }
}
