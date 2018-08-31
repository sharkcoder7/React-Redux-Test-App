import React from 'react';
import moment from 'moment';
import { CardBody, CardSubtitle, CardText } from 'reactstrap';

export default props => (
    <CardBody>
        <CardSubtitle>
            {(props.user && props.user.name) || 'Anon'}{' '}
            <small className="text-muted">
                {moment(props.posted.date).format('h:mm a, D MMM')}
            </small>
        </CardSubtitle>
        <CardText>{props.comment}</CardText>
    </CardBody>
);
