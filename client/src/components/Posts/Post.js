import React, { useState, useEffect } from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useDispatch, useSelector } from "react-redux";
import { List, Button, Avatar } from "antd";
import {
  LikeOutlined,
  CommentOutlined,
  LikeFilled,
  ArrowLeftOutlined
} from "@ant-design/icons";
import { updatePostLikes } from "../../Flux/actions/postActions";
import Profile from "../Profile/Profile";
import PostsFeed from "./PostsFeed";
import Comments from "./Comments";
import CommentInput from "./CommentInput";

const Post = props => {
  TimeAgo.addLocale(en);
  const timeAgo = new TimeAgo("en-US");

  const dispatch = useDispatch();
  const posts = useSelector(state => state.post.posts);
  const updatingPostLike = useSelector(state => state.post.updatingPostLike);
  const auth = useSelector(state => state.auth);
  const [Route, setRoute] = useState("comment");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onLikeClick = (postId, user, userId) => {
    dispatch(updatePostLikes(postId, "like", user, userId));
  };

  const onUnlikeClick = (postId, user, userId) => {
    dispatch(updatePostLikes(postId, "unlike", user, userId));
  };

  const i = props.commentIndex;

  return (
    <div>
      {Route === "comment" ? (
        <div style={{ margin: "15px" }}>
          <div>
            <ArrowLeftOutlined onClick={() => setRoute(props.commingFrom)} />{" "}
            back
          </div>
          <List
            dataSource={["1"]}
            renderItem={() => (
              <List.Item
                actions={[
                  !posts[i].likersId.includes(auth.user._id) ? (
                    <Button
                      disabled={updatingPostLike}
                      onClick={() => {
                        onLikeClick(
                          posts[i]._id,
                          `${auth.user.firstName} ${auth.user.lastName}`,
                          auth.user._id
                        );
                      }}
                    >
                      {`${posts[i].likersId.length} `}
                      <LikeOutlined />
                    </Button>
                  ) : (
                    <Button
                      disabled={updatingPostLike}
                      onClick={() => {
                        onUnlikeClick(
                          posts[i]._id,
                          `${auth.user.firstName} ${auth.user.lastName}`,
                          auth.user._id
                        );
                      }}
                    >
                      {`${posts[i].likersId.length} `}
                      <LikeFilled />
                    </Button>
                  ),
                  <Button>
                    {`${posts[i].comments.length} `}
                    <CommentOutlined />
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar>{posts[i].author[0]}</Avatar>}
                  title={posts[i].author}
                  description={timeAgo.format(posts[i].postedTime)}
                />
                {posts[i].text}
              </List.Item>
            )}
          />
          <div>
            <Comments post={posts[i]} />
          </div>
          <CommentInput
            postData={{
              commenter: `${auth.user.firstName} ${auth.user.lastName}`,
              commentId: posts[i]._id,
              userId: auth.user._id
            }}
          />
        </div>
      ) : Route === "/profile" ? (
        <Profile />
      ) : Route === "/home" ? (
        <PostsFeed />
      ) : null}
    </div>
  );
};

export default Post;
