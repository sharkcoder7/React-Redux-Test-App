import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
    Container,
    Button,
    CardColumns,
    ListGroup,
    ListGroupItem,
    Navbar,
    Progress,
} from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchAllPosts, createPostComment } from '../../actions';
import { PostCard, PostCardComment } from '../../components';
import './styles.scss';

@withRouter
@connect(
    ({ posts }) => ({ posts }),
    { fetchAllPosts, createPostComment },
)
class PostList extends React.Component {
    static propTypes = {
        posts: PropTypes.object.isRequired,
        comments: PropTypes.object,
    };

    static defaultProps = {
        comments: {},
    };

    state = {
        progressVisible: true,
    };

    async componentDidMount() {
        await this.props.fetchAllPosts();
        this.setState(() => ({ progressVisible: false }));
    }

    addCommentForPost = post => async comment =>
        this.props.createPostComment({ comment, wall: post.id });

    renderPostComment = (comment, idx) => (
        <ListGroupItem key={comment.id}>
            <PostCardComment {...comment} />
        </ListGroupItem>
    );

    renderPost = (post, idx) => (
        <PostCard key={post.id} {...post} addComment={this.addCommentForPost(post)}>
            <ListGroup flush>
                {_(post.comments)
                    .values()
                    .sortBy([cmnt => _.get(cmnt, ['posted', 'date'])])
                    .reverse()
                    .map(this.renderPostComment)
                    .value()}
            </ListGroup>
        </PostCard>
    );

    render() {
        const data = this.props.posts.data;

        return (
            <Container fluid>
                <Navbar light color="light" fixed="top" expand="md">
                    <Link to={`post/create`}>
                        <Button outline color="primary">
                            Add
                        </Button>
                    </Link>
                    <Progress
                        animated
                        color="info"
                        value={100}
                        className={this.state.progressVisible ? '' : 'invisible'}>
                        Refreshing...
                    </Progress>
                </Navbar>

                <CardColumns>{data.map(this.renderPost)}</CardColumns>
            </Container>
        );
    }
}

export default PostList;
