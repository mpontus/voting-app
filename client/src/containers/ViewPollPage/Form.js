import React from 'react';
import { Card, CardText, CardTitle, Menu, MenuItem } from 'material-ui';
import ToggleCheckBoxOutlineBlank from 'material-ui/svg-icons/toggle/check-box-outline-blank';

const Form = ({ title, options }) => (
    <Card>
        <CardTitle title={title} />
        <CardText style={{ paddingRight: 0 }}>
            <Menu
                style={{ width: '100%', marginLeft: -16 }}
            >
                {options.map((option) => (
                    <MenuItem
                        key={option}
                        leftIcon={<ToggleCheckBoxOutlineBlank />}
                        primaryText={option}
                        onClick={() => this.handleVote(option)}
                    />
                ))}
            </Menu>
        </CardText>
    </Card>
);

export default Form;
