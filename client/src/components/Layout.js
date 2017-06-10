import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { muiThemeable } from 'material-ui/styles';
import { brown50 } from 'material-ui/styles/colors'

const propTypes = {
    children: PropTypes.node,
};

const getStyles = (muiTheme) => {
    const {
        palette: {
            canvasColor,
        },
    } = muiTheme;

    return {
        header: {
        },
        canvas: {
            paddingTop: 30,
        },
        layout: {
            position: 'absolute',
            height: '100%',
            width: '100%',
            backgroundColor: brown50
        }
    }
};

const Layout = ({ muiTheme, header, children }) => {
    const styles=  getStyles(muiTheme);

    return (
        <div style={styles.layout}>
            <div style={styles.header}>
                {header}
            </div>
            <div style={styles.canvas}>
                <Grid>
                    <Row>
                        <Col xs={10} xsOffset={1}>
                            {children}
                        </Col>
                    </Row>
                </Grid>
            </div>
        </div>
    );
};

Layout.propTypes = propTypes;

export default muiThemeable()(Layout);
