import React from 'react'
import { List } from 'material-ui'
import OptionItem from './OptionItem'

export default ({options}) => (
  <List>
    {options.map(option => (
      <OptionItem key={option} option={option}/>
    ))}
  </List>
)