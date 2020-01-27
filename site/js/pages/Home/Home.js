import React from 'react';
import { Heading, Box, Text } from 'grommet';
import styled from 'styled-components';

import siteStore from '../../store/site.store';

import PageFrame from '../../views/PageFrame';

const TileSet = styled.section`
width: 100%;
display: grid;
grid-gap: 4px;
grid-template-columns: repeat(3, 1fr);
`;

const Tile = styled.div`
user-select: none;
padding: 1rem;
background-color: #5d8f0b;
border-radius: 0.5rem;
text-align: center;
&:hover {
  background-color: #1c438a;
}
&:hover h3 {
    color: white !important;
}
`;

export default ({ history }) => (
  <PageFrame>
    <h1>Word Quiz</h1>
    <TileSet>
      {Array.from(siteStore.my.lists.values()).map((list) => (
        <Tile
          key={list.label}
          onClick={() => {
            history.push(`/list/${encodeURIComponent(list.label)}`);
          }}
        >
          <Box direction="row" fill gap="small" align="center" justify="center">
            <Heading color="black" level={3} className="head">&#8220;{list.label}&#8221;</Heading>
          </Box>
        </Tile>
      ))}
    </TileSet>
  </PageFrame>
);
