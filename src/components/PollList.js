import React from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid';
import PollItem from './PollItem'

export default ({polls}) => (
  <Grid>
    {console.log(polls)}
    <Row>
      {polls.map(poll => (
        <Col key={poll.title} xs={6}>
          <PollItem poll={poll} />
        </Col>
      ))}
    </Row>
  </Grid>
)