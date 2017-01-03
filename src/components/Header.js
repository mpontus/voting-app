import React from 'react'

import {
  Toolbar,
  ToolbarGroup,
  ToolbarTitle,
} from 'material-ui'

import UserMenu from './UserMenu'

export default () => (
  <Toolbar>
    <ToolbarGroup>
      <ToolbarTitle text="Voting App" />
    </ToolbarGroup>
    <ToolbarGroup>
      <UserMenu/>
    </ToolbarGroup>
  </Toolbar>
)