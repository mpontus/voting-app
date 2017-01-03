import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Header from './Header'
import Polls from './Polls'

export default () => (
  <MuiThemeProvider>
    <div>
      <Header/>
      <Polls/>
    </div>
  </MuiThemeProvider>
)