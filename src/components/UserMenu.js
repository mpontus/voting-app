import React from 'react'
import { RaisedButton } from 'material-ui'
import GitHubIcon from './svg-icons/GitHub'

export default () => (
  <RaisedButton
    label="Login with GitHub"
    primary={true}
    icon={<GitHubIcon/>}
  />
)