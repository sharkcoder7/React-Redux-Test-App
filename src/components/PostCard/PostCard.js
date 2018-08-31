import React from 'react';
import {
    Button,
    Card,
    CardBody,
    CardTitle,
    CardText,
    InputGroup,
    Input,
    InputGroupAddon,
    CardFooter,
} from 'reactstrap';
import sanitizeHtml from 'sanitize-html';
import linkifyHtml from 'linkifyjs/html';
import moment from 'moment/moment';

export default class PostCard extends React.PureComponent {
    state = {
        isProcessing: false,
    };

    addComment = async () => {
        this.setState({ isProcessing: true });
        await this.props.addComment(this.state.text);
        this.setState(() => ({ isProcessing: false, text: '' }));
    };

    render() {
        return (
            <Card>
                <CardBody>
                    <CardTitle>
                        {(this.props.user && this.props.user.name) || 'Anon'}{' '}
                        <small className="text-muted">
                            {moment(this.props.posted.date).format('h:mm a, D MMM')}
                        </small>
                    </CardTitle>
                    <CardText
                        dangerouslySetInnerHTML={{
                            __html: linkifyHtml(sanitizeHtml(this.props.post)),
                        }}
                    />
                </CardBody>

                <CardFooter>
                    <InputGroup style={{ marginBottom: 15 }}>
                        <Input
                            type="textarea"
                            value={this.state.text}
                            onChange={ev => this.setState({ text: ev.target.value })}
                        />
                        <InputGroupAddon addonType="append">
                            <Button
                                onClick={() => this.addComment(this.state.text)}
                                disabled={this.state.isProcessing}>
                                Comment
                            </Button>
                        </InputGroupAddon>
                    </InputGroup>

                    {this.props.children}
                </CardFooter>
            </Card>
        );
    }
}
