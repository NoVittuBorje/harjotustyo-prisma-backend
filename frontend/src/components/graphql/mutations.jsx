import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;
export const REGISTER = gql`
  mutation Mutation($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      username
      email
    }
  }
`;
export const MAKEFEED = gql`
mutation Mutation($feedname: String!, $description: String!) {
  makeFeed(feedname: $feedname, description: $description) {
    feedname
    description
    feedavatar
    subsCount
    active
    createdAt
    updatedAt
    id
    owner {
      avatar
      id
      username
      ownedFeeds {
        id
        feedname
      }
    }
  }
}
`;

export const MAKEPOST = gql`
  mutation Mutation(
    $headline: String!
    $feedname: String!
    $img: String
    $description: String!
  ) {
    makePost(
      headline: $headline
      feedname: $feedname
      img: $img
      description: $description
    ) {
      headline
      description
      karma
      img
      active
      createdAt
      updatedAt
      id
      owner {
        username
        avatar
        id
      }
      feed {
        feedname
        description
        active
        createdAt
        updatedAt
        id
      }
    }
  }
`;

export const SUBSCRIBE = gql`
  mutation Mutation($feedname: String!, $type: String!) {
    subscribe(feedname: $feedname, type: $type) {
      username
      email
      firstname
      lastname
      avatar
      relationship
      description
      work
      feedSubs {
        feedname
        id
      }
      ownedFeeds {
        feedname
      }
      id
    }
  }
`;
export const MAKECOMMENT = gql`
  mutation Mutation($content: String!, $replyto: Int, $postid: Int!) {
    makeComment(content: $content, replyto: $replyto, postid: $postid) {
      content
      id
      post {
        id
      }
      replyto {
        id
      }
      replies {
        content
        user {
          avatar
          id
          username
        }
        id
      }
      user {
        avatar
        username
        id
      }
    }
  }
`;
export const EDITCOMMENT = gql`
  mutation ModifyComment(
    $commentid: Int!
    $content: String!
    $action: String!
  ) {
    modifyComment(commentid: $commentid, content: $content, action: $action) {
      content
      active
      karma
      depth
      id
    }
  }
`;
export const EDITFEED = gql`
  mutation ModifyFeed($feedid: Int!, $action: String!, $content: String!) {
    modifyFeed(feedid: $feedid, action: $action, content: $content) {
      ... on Feed {
        feedname
        description
        active
        feedavatar
        createdAt
        updatedAt
        id
        owner {
          avatar
          username
          id
        }
        moderators {
          username
          avatar
          id
        }
        bannedusers {
          username
          avatar
          id
        }
      }
      ... on Post {
        headline
        description
        karma
        img
        active
        locked
        createdAt
        updatedAt
        id
      }
    }
  }
`;
export const EDITPOST = gql`
  mutation ModifyPost($postid: Int!, $action: String!, $content: String!) {
    modifyPost(postid: $postid, action: $action, content: $content) {
      headline
      description
      karma
      img
      active
      createdAt
      updatedAt
      id
    }
  }
`;
export const SINGLEIMAGEUPLOAD = gql`
  mutation Mutation($input: SingleFileInput!) {
    singleUpload(input: $input)
  }
`;
export const USEREDIT = gql`
  mutation Mutation($type: String!, $content: String!) {
    modifyUser(type: $type, content: $content) {
      username
      email
      firstname
      lastname
      avatar
      relationship
      description
      work
      nationality
      active
      createdAt
      id
    }
  }
`;
export const LIKECOMMENT = gql`
  mutation LikeComment($likeCommentId: Int!) {
    likeComment(id: $likeCommentId) {
      content
      active
      karma
      depth
      createdAt
      updatedAt
      id
      replies {
        id
      }
      replyto {
        id
      }
    }
  }
`;
export const DISLIKECOMMENT = gql`
  mutation DislikeComment($dislikeCommentId: Int!) {
    dislikeComment(id: $dislikeCommentId) {
      content
      active
      karma
      depth
      createdAt
      updatedAt
      id
      replies {
        id
      }
      replyto {
        id
      }
    }
  }
`;
export const LIKEPOST = gql`
  mutation LikePost($likePostId: Int!) {
    likePost(id: $likePostId) {
      headline
      description
      karma
      img
      active
      createdAt
      updatedAt
      id
    }
  }
`;
export const DISLIKEPOST = gql`
  mutation DislikePost($dislikePostId: Int!) {
    dislikePost(id: $dislikePostId) {
      headline
      description
      karma
      img
      active
      createdAt
      updatedAt
      id
    }
  }
`;
export const SENDCHATMESSAGE = gql`
  mutation Message($content: String!, $roomId: Int!) {
    message(content: $content, roomId: $roomId) {
      id
      content
      createdAt
      author {
        username
        id
      }
    }
  }
`;
export const MAKENEWCHATROOM = gql`
  mutation CreateRoom($name: String!, $type: String!, $feedId: Int) {
    createRoom(name: $name, type: $type, feedId: $feedId) {
      ... on Feed {
        feedname
        description
        feedavatar
        subsCount
        active
        createdAt
        updatedAt
        id
        chatRoom {
          id
          name
          type
          owner {
            username
            avatar
            id
          }
          users {
            username
            avatar
            id
          }
        }
      }
      ... on User {
        username
        avatar
        id
        chatrooms {
          id
          name
          type
        }
      }
      ... on Room {
        id
        name
        type
        owner {
          username
          avatar
          id
        }
        users {
          username
          avatar
          id
        }
      }
    }
  }
`;
export const EDITCHATROOM = gql`
  mutation EditRoom(
    $type: String!
    $roomId: Int
    $feedId: Int
    $content: String
  ) {
    editRoom(type: $type, roomId: $roomId, feedId: $feedId, content: $content) {
      ... on Feed {
        feedname
        description
        feedavatar
        subsCount
        active
        createdAt
        updatedAt
        id
        chatRoom {
          id
          name
          type
          owner {
            username
            avatar
            id
          }
          users {
            username
            avatar
            id
          }
        }
      }
      ... on User {
        username
        avatar
        id
        chatrooms {
          id
          name
          type
        }
      }
      ... on Room {
        id
        name
        type
        owner {
          username
          avatar
          id
        }
        users {
          username
          avatar
          id
        }
      }
    }
  }
`;
export const FRIENDSREQUESTACTIONS = gql`
  mutation FriendRequestAction($userId: Int!, $type: String!) {
    friendRequestAction(userId: $userId, type: $type) {
      username
      avatar
      id
      friends {
        username
        avatar
        id
      }
      friendsRequestsSent {
        username
        avatar
        id
      }
    }
  }
`;
export const INVITETOCHATROOM = gql`
  mutation InviteToRoom($roomId: Int!, $invitedId: Int!) {
    inviteToRoom(roomId: $roomId, invitedId: $invitedId) {
      id
      name
    }
  }
`;
export const CHATROOMINVITEACTIONS = gql`
  mutation RoomInviteAction($type: String!, $roomId: Int!) {
    roomInviteAction(type: $type, roomId: $roomId) {
      username
      avatar
      id
      chatrooms {
        id
        name
      }
      chatroominvites {
        id
        name
      }
    }
  }
`;
export const SENDFRIENDREQUEST = gql`
  mutation SendFriendRequest($userId: Int!) {
    sendFriendRequest(userId: $userId) {
      username
      avatar
      id
      friendsRequestsSent {
        username
        avatar
        id
      }
    }
  }
`;
