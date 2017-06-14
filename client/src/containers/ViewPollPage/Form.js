import React from 'react';
import {
    Avatar, Card, CardText, CardTitle, Checkbox, Divider, FlatButton, Menu, MenuItem, RaisedButton,
    Subheader, TextField,
} from 'material-ui';
import ToggleCheckBoxOutlineBlank from 'material-ui/svg-icons/toggle/check-box-outline-blank';
import KeyboardBackspaceIcon from 'material-ui/svg-icons/hardware/keyboard-backspace';
import { Col, Row } from 'react-flexbox-grid';
import { Link } from 'react-router-dom';
import { grey300 } from 'material-ui/styles/colors';

const Form = ({ title, options, author }) => (
    <Card>
        <FlatButton
            primary
            label="Back to the List"
            icon={<KeyboardBackspaceIcon style={{ paddingTop: 1 }} />}
            containerElement={<Link to="/" />}
        />
        <Row>
            <Col xs={12} md={6}>
                <CardText style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Avatar src={author.avatar} size={140} style={{ borderStyle: 'solid', borderWidth: 3, borderColor: grey300 }} />
                    <CardTitle title={title} style={{ textAlign: 'center', paddingBottom: 0 }} />
                </CardText>
            </Col>
            <Col xs={12} md={6} style={{ display: 'flex', alignItems: 'center' }}>
                <CardText style={{ flex: '1', paddingLeft: 40, paddingBottom: 48 }}>
                    <div style={{ paddingBottom: 16 }}>
                        <Subheader style={{ paddingLeft: 0 }}>Select one option:</Subheader>
                        {options.map((option) => (
                            <Checkbox disabled key={option} label={option} />
                        ))}
                    </div>
                    <TextField
                        floatingLabelText="Add new option"
                        floatingLabelFixed
                    />
                    {/*<Divider style={{ marginBottom: 16 }} />*/}
                    {/*<RaisedButton label="Add Another Option" />*/}
                </CardText>
            </Col>
        </Row>
    </Card>
);

export default Form;
