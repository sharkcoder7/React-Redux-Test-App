import React from 'react';
import _ from 'lodash';
import {
    Container,
    Row,
    Col,
    Button,
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    CardImg,
    Form,
    Alert,
} from 'reactstrap';

import { Prompt, Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { addOnLeavingPrompt, removeOnLeavingPrompt } from 'components/utils';
import { createPost, fetchPostDetails } from '../../actions';
import defaultFeatureImage from 'assets/img/feature-placeholder.jpg';
import FormInputs from '../../components/FormInputs/FormInputs';

const modelDescription = {
    post: 'Body of post',
    attachment: 'Optional Attachment',
    permissions: 'Who can see this post. 0 no-one, 1 everyone, 2 followers',
    sharedWall: 'The wall post ID to be shared to the wall activity stream.',
    sharedDiscussion: 'The discussion post ID to be shared to the wall activity stream.',
    sharedBadgeIssued: 'The badge issued ID to be shared to the wall activity stream.',
    sharedFile: 'The file ID to be shared to the wall activity stream.',
    sharedQuotedText: 'Quoted text by the user sharing to the activity stream.',
    sharedInterviewResource:
        'The ID of the interview resource being shared to the wall activity stream.',
};

const permissions = [
    {
        name: 'No one',
        id: '0',
    },
    {
        name: 'Everyone',
        id: '1',
    },
    {
        name: 'Followers',
        id: '2',
    },
];

@withRouter
@connect(
    ({ editor }) => ({ ...editor, post: editor.model }),
    { fetchPostDetails, createPost, uploadImage: () => _.noop },
)
class EditPost extends React.Component {
    state = {
        alertVisible: false,
        transitionAllowed: true,
        validation: {},
        model: {
            permissions: 0,
        },
    };

    get postId() {
        return this.props.match.params.postId;
    }

    get isNewPost() {
        return this.postId === 'create';
    }

    permissionOptions = _.map(permissions, perm => (
        <option key={perm.id} value={perm.id}>
            {perm.name}
        </option>
    ));

    constructor(props, ...rest) {
        super(props, ...rest);
        /* eslint-disable react/no-direct-mutation-state */
        this.state.model = { ...props.post };
    }

    componentDidMount() {
        if (!this.isNewPost && this.props.post.id !== this.postId) {
            this.props.fetchPostDetails(this.postId);
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.post !== prevProps.post) {
            this.setState({ model: { ...this.props.post } });
        }

        if (this.props.error !== prevProps.error) {
            const validation = {};
            _.each(this.props.error, (err, field) => {
                validation[field] = _(err)
                    .values()
                    .first();
            });
            this.setState({ validation });
        }
    }

    onPropertyChange = (key, value) => {
        addOnLeavingPrompt();

        const model = { ...this.state.model, [key]: value };
        const validation = { ...this.state.validation, [key]: null };
        this.setState({ validation, model, transitionAllowed: false });
    };

    validate() {
        const model = this.state.model;
        let valid = true;
        const validation = {};
        if (_.isEmpty(model.post)) {
            valid = false;
            validation.post = 'Post content should not be empty';
        }

        if (!valid) {
            this.setState({ validation });
        }

        return valid;
    }

    savePost = async () => {
        if (this.validate()) {
            removeOnLeavingPrompt();
            await this.props.createPost(_.defaults(this.state.model, { permissions: 0 }));

            this.setState({ transitionAllowed: true, validation: {}, alertVisible: true });
            setTimeout(() => this.setState(() => ({ alertVisible: false })), 5000);
        }
    };

    renderRightColumn() {
        const model = this.state.model;
        const { isUploading } = this.props;
        return (
            <Card>
                <CardImg top width="100%" src={model.attachment || defaultFeatureImage} alt="..." />
                <CardBody>
                    <FormInputs
                        ncols={['col-md-12']}
                        attributes={[
                            {
                                label: 'Attachment',
                                inputProps: {
                                    type: 'text',
                                    value: model.attachment,
                                    placeholder: modelDescription.attachment,
                                    onChange: e =>
                                        this.onPropertyChange('attachment', e.target.value),
                                },
                                addonRight: (
                                    <Button
                                        disabled={isUploading}
                                        onClick={() => this.upload.click()}>
                                        Upload
                                    </Button>
                                ),
                                inputGroupAddonProps: {
                                    addonType: 'append',
                                },
                            },
                        ]}
                    />

                    <input
                        type="file"
                        ref={ref => (this.upload = ref)}
                        style={{ height: 0, opacity: 0 }}
                        accept="image/*"
                        onChange={evt => this.props.uploadImage(evt.target.files[0])}
                    />
                </CardBody>
            </Card>
        );
    }

    render() {
        const model = this.state.model;
        const pageTitle = this.isNewPost ? 'Create a new' : 'Edit';

        return (
            <Container fluid>
                <Prompt
                    when={!this.state.transitionAllowed}
                    message={'Changes that you made may not be saved.'}
                />
                <Alert
                    color="info"
                    isOpen={this.state.alertVisible}
                    toggle={() => this.setState({ alertVisible: false })}
                    className="fixed-top">
                    Successfully saved
                </Alert>
                <CardBody>
                    <Row>
                        <Col md={8} xs={12}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>{pageTitle} Post</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Form>
                                        <FormInputs
                                            ncols={['col-md-9', 'col-md-3']}
                                            attributes={[
                                                {
                                                    label: 'Post content',
                                                    error: this.state.validation.post,
                                                    inputProps: {
                                                        name: 'post',
                                                        type: 'textarea',
                                                        rows: 15,
                                                        value: model.post,
                                                        onChange: e =>
                                                            this.onPropertyChange(
                                                                'post',
                                                                e.target.value,
                                                            ),
                                                    },
                                                },
                                                {
                                                    label: 'Permissions',
                                                    inputProps: {
                                                        name: 'permissions',
                                                        type: 'select',
                                                        children: [this.permissionOptions],
                                                        value: '' + model.permissions,
                                                        onChange: e =>
                                                            this.onPropertyChange(
                                                                'permissions',
                                                                +e.target.value,
                                                            ),
                                                    },
                                                },
                                            ]}
                                        />
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md={4} xs={12}>
                            {this.renderRightColumn()}
                            <CardBody>
                                <Button onClick={this.savePost} className="float-left">
                                    Publish
                                </Button>
                                <Link to={'/'} className="float-right">
                                    <Button>Back</Button>
                                </Link>
                            </CardBody>
                        </Col>
                    </Row>
                </CardBody>
            </Container>
        );
    }
}

export default EditPost;
