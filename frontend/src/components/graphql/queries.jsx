import { gql } from "@apollo/client";

export const GET_ME = gql`
query Me {
  me {
    username
    id
    email
    firstname
    lastname
    avatar
    relationship
    description
    work
    nationality
    userKarma
    active
    createdAt
    feedSubs {
      feedname
      id
    }
    ownedFeeds {
      feedname
      id
    }
    dislikedPosts {
      id
    }
    likedPosts {
      id
    }
    dislikedComments {
      id
    }
    likedComments {
      id
    }
    chatroomInvites {
      id
      name
    }
    chatrooms {
      id
      name
    }
    friends {
      id
      username
      avatar
    }
    friendsRequests {
      id
      username
      avatar
    }
    friendsRequestsSent {
      id
      username
      avatar
    }
    User_UserFriendRequestsSent_A {
      id
      username
    }
    User_UserFriendRequestsSent_B {
      id
      username
    }
    User_UserFriendRequests_A {
      id
      username
    }
    User_UserFriendRequests_B {
      id
      username
    }
    User_UserFriends_A {
      username
      id
    }
    User_UserFriends_B {
      id
      username
    }
  }
}
`;
export const GET_FEED = gql`
  query Getfeed($querytype: String!, $feedname: String) {
    getfeed(querytype: $querytype, feedname: $feedname) {
      feedname
      description
      active
      id
      feedavatar
      createdAt
      owner {
        username
        avatar
        id
        active
      }
      moderators {
        username
        avatar
        id
        active
      }
      subs {
        id
      }
      subsCount
      chatRoom {
        owner {
          id
        }
        name
        id
        users {
          id
        }
      }
    }
  }
`;
export const GET_FEED_POSTS = gql`
  query Getfeedposts($feedname: String!, $offset: Int!, $orderBy: String!) {
    getfeedposts(feedname: $feedname, offset: $offset, orderBy: $orderBy) {
      headline
      description
      karma
      img
      active
      locked
      commentsCount
      createdAt
      updatedAt
      id
      feed {
        feedname
        id
      }
      owner {
        username
        avatar
        id
        active
      }
    }
  }
`;
export const GET_POST_COMMENTS = gql`
  query Getpostcomments($postid: Int!, $offset: Int!) {
    getpostcomments(postid: $postid, offset: $offset) {
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
      user {
        username
        avatar
        id
      }
    }
  }
`;
export const GET_POST = gql`
  query Getpost($postid: Int!) {
    getpost(postid: $postid) {
      headline
      description
      karma
      img
      active
      locked
      createdAt
      updatedAt
      id
      owner {
        id
        avatar
        username
      }
      feed {
        feedname
        feedavatar
        owner {
          id
        }
        moderators {
          id
        }
        id
      }
    }
  }
`;

export const GET_USER = gql`
  query Getuser($getuserId: Int!) {
    getuser(id: $getuserId) {
      username
      email
      firstname
      lastname
      avatar
      userKarma
      relationship
      description
      nationality
      work
      active
      id
      dislikedPosts {
        id
      }
      likedPosts {
        id
      }
      likedComments {
        id
      }
      dislikedComments {
        id
      }
      feedSubs {
        id
      }
      posts {
        id
      }
      ownedFeeds {
        id
      }
      comments {
        id
      }
      createdAt
    }
  }
`;

export const GET_ALL_FEED = gql`
  query Getfeed($querytype: String!, $feedname: String) {
    getfeed(querytype: $querytype, feedname: $feedname) {
      feedname
      description
    }
  }
`;

export const GET_COMMENTS = gql`
  query Getcomments($commentid: Int!, $offset: Int!) {
    getcomments(commentid: $commentid, offset: $offset) {
      content
      user {
        username
        avatar
        id
      }
      active
      karma
      depth
      createdAt
      updatedAt
      id
      replies {
        content
        active
        karma
        depth
        id
        createdAt
        updatedAt
        user {
          username
          avatar
          id
        }
        replies {
          id
        }
      }
    }
  }
`;
export const GET_POPULAR_POSTS = gql`
  query Query($offset: Int!, $orderBy: String) {
    getpopularposts(offset: $offset, orderBy: $orderBy) {
      headline
      description
      karma
      img
      active
      locked
      commentsCount
      createdAt
      updatedAt
      id
      feed {
        feedname
      }
      owner {
        username
        avatar
        id
        active
      }
    }
  }
`;
export const GET_USER_COMMENTS = gql`
  query Getusercomments($userid: Int!, $offset: Int!) {
    getusercomments(userid: $userid, offset: $offset) {
      content
      active
      karma
      depth
      createdAt
      updatedAt
      id
      replyto {
        id
        user {
          id
          username
          avatar
        }
        content
        active
        karma
        depth
        createdAt
        updatedAt
      }
      replies {
        id
      }
      post {
        id
        headline
        description
      }
    }
  }
`;
export const GET_USER_POSTS = gql`
  query Getuserposts($userid: Int!, $offset: Int!) {
    getuserposts(userid: $userid, offset: $offset) {
      headline
      description
      karma
      img
      locked
      commentsCount
      active
      createdAt
      updatedAt
      id
      owner {
        id
      }
      feed {
        feedname
        id
      }
    }
  }
`;
export const GET_USER_SUBS = gql`
  query Getusersubs($userid: Int!, $offset: Int!) {
    getusersubs(userid: $userid, offset: $offset) {
      feedname
      description
      feedavatar
      active
      createdAt
      id
    }
  }
`;
export const GET_USER_OWNEDFEEDS = gql`
  query Getuserownedfeeds($userid: Int!, $offset: Int!) {
    getuserownedfeeds(userid: $userid, offset: $offset) {
      feedname
      description
      feedavatar
      active
      createdAt
      id
    }
  }
`;
export const GET_SEARCH_BAR = gql`
  query Getsearchbar($searchby: String!) {
    getsearchbar(searchby: $searchby) {
      ... on Feed {
        feedname
        active
        id
      }
      ... on Post {
        headline
        karma
        active
        createdAt
        updatedAt
        id
      }
      ... on User {
        username
        avatar
        id
        active
      }
    }
  }
`;
export const GET_SEARCH_USERS = gql`
  query Getsearchusers($searchby: String) {
    getsearchusers(searchby: $searchby) {
      username
      id
    }
  }
`;
export const GET_IMAGE_URLS = gql`
  query Query($userId: String!) {
    getFiles(userId: $userId)
  }
`;
export const GET_IMAGE_URL = gql`
  query Query($imageId: String!) {
    getImage(imageId: $imageId)
  }
`;
export const GET_FEED_SUBS_COUNT = gql`
  query Query($feedname: String!) {
    getSubsCount(feedname: $feedname)
  }
`;
export const GET_CHAT_MESSAGES = gql`
  query GetMessages($roomId: Int!, $offset: Int) {
    getMessages(roomId: $roomId, offset: $offset) {
      id
      content
      createdAt
      author {
        username
        id
        avatar
      }
    }
  }
`;
export const GET_CHAT_MESSAGES_FOR_ROOM = gql`
  query GetMessagesForRoom($roomId: Int!) {
    getMessagesForRoom(roomId: $roomId) {
      id
      name
      type
      messages {
        id
        content
        author {
          username
          avatar
          id
        }
        createdAt
      }
    }
  }
`;
export const GET_CHAT_ROOM_INFO = gql`
  query Query($roomId: Int!) {
    getChatRoomInfo(roomId: $roomId) {
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
`;
