import React from 'react'

import {
  Card,
  CardHeader,
  CardText,
} from 'material-ui'

import OptionList from './OptionList'

export default ({poll}) => (
  <Card>
    <CardHeader title={poll.title}/>
    <CardText>
      <OptionList options={poll.options}/>
    </CardText>
  </Card>
)