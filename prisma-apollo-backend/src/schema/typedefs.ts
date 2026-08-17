const typeDefs =`#graphql
  type Feed {
    feedname:String!
    description:String!
    feedavatar:String
    subsCount:Int!
    owner:User!
    moderators:[User]
    subs:[User]
    posts:[Post]
    bannedusers:[User]
    active:Boolean
    chatRoom:Room
    createdAt:String
    updatedAt:String
    id:ID!
  }
  type Comment {
    post:Post
    user:User
    content:String
    replies:[Comment]
    replyto:Comment
    active:Boolean
    karma:Int
    depth:Int
    createdAt:String
    updatedAt:String
    id:ID!
  }
  type Post {
    headline:String!
    description:String!
    owner:User!
    karma:Int!
    img:String
    feed:Feed!
    commentsCount:Int
    comments:[Comment]
    active:Boolean
    locked:Boolean
    createdAt:String
    updatedAt:String
    id:ID!
  }
  type User {
    username: String!
    email:String
    firstname:String
    lastname:String
    avatar:String
    relationship:String
    description:String
    dislikedPosts:[Post]
    likedPosts:[Post]
    likedComments:[Comment]
    dislikedComments:[Comment]
    work:String
    feedSubs:[Feed]
    nationality:String
    posts:[Post]
    ownedFeeds:[Feed]
    userKarma:Int
    active:Boolean
    comments:[Comment]
    createdAt:String
    chatrooms:[Room]
    chatroomInvites:[Room]
    User_UserFriendRequests_A:[User]
    User_UserFriendRequests_B:[User]
    User_UserFriendRequestsSent_A:[User]
    User_UserFriendRequestsSent_B:[User]
    User_UserFriends_A:[User]
    User_UserFriends_B:[User]
    friends:[User]
    friendsRequests:[User]
    friendsRequestsSent:[User]
    id: ID!
  }
  scalar Date

  type Message {
    id: ID!
    content: String!
    owner: User!
    room: Room!
    createdAt: Date!
  }
  enum RoomType {
    PRIVATE
    GROUP
    FEED
  }
  type Room {
    id: ID!
    name: String!
    owner:User!
    users: [User!]
    messages: [Message!]
    type: RoomType
  }
  union NewRoomResult = Feed | User | Room
  union Search = Feed | Post | User
  type Token {
    value: String!
  }
  scalar Upload

  input SingleFileInput {
  userId: String!
  file: Upload!
  }
  input MultiFileInput {
  userId: String!
  files: [Upload!]!
  }
  type Subscription {
    messageSent(roomId: String!): Message
  }
  

  type Query {
    me: User!
    hello: String

    getuser(
    id:Int!
    ):User

    getfeed(
    feedname:String
    querytype:String!
    ):[Feed]

    getfeedposts(
    feedname:String!
    orderBy:String!
    offset:Int!
    ):[Post]

    getpostcomments(
    postid:Int!
    offset:Int!
    ):[Comment]

    getpopularposts(
    offset:Int!
    orderBy:String
    ):[Post]

    getpost(postid:Int!):Post

    getcomments(
    commentid:Int!
    offset:Int!
    ):[Comment]

    getuserposts(
    userid:Int!
    offset:Int!
    ):[Post]

    getusercomments(
    userid:Int!
    offset:Int!
    ):[Comment]

    getusersubs(
    userid:Int!
    offset:Int!
    ):[Feed]

    getuserownedfeeds(
    userid:Int!
    offset:Int!
    ):[Feed]

    getuserinfo(
    userid:Int!
    offset:Int!
    type:String!
    ):User

    getsearchbar(
    searchby:String!
    ):[Search]

    getsearchusers(
    searchby:String
    ):[User]
    
    getCommentsCount(
    feedname:String!):Int!

    getSubsCount(
    feedname:String!):Int!

    getFiles(userId: Int!): [String!]
    
    getImage(imageId:String!):String!

    getUserRooms:User

    getMessages(roomId: Int!,offset:Int): [Message!]

    getMessagesForRoom(roomId:Int!): Room!

    getChatRoomInfo(roomId:Int!): Room!
  }
  
  type Mutation {
    subscribe(
      feedname: String!
      type: String!
    ): User
    createUser(
      username: String!
      email:String!
      password: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
    makeFeed(
      feedname: String!
      description: String!
    ): Feed
    makePost(
      headline: String!
      feedname: String!
      description: String!
      img: String
    ): Post
    makeComment(
      postid: Int!
      content: String!
      replyto: Int
    ):Comment
    modifyComment(
      commentid:Int!
      action:String!
      content: String!
    ):Comment
    modifyPost(
    postid:Int!
    action:String!
    content: String!
    ):Post
    modifyFeed(
    feedid:Int!
    action:String!
    content:String!
    ):Search
    modifyUser(
    type:String!
    content: String!
    ): User

    dislikePost(
    id:Int!
    ):Post

    likePost(
    id:Int!
    ):Post

    dislikeComment(
    id:Int!
    ):Comment

    likeComment(
    id:Int!
    ):Comment
    
    singleUpload(input: SingleFileInput!): [String!]

    multiUpload(input: MultiFileInput!): String!

    createRoom(
    name:String! 
    type:String!
    feedId:Int
    ):NewRoomResult



    inviteToRoom(
    roomId:Int!,
    invitedId:Int!
    ):Room

    roomInviteAction(
    type:String!
    roomId:Int!
    ):User


    editRoom(
    roomId:Int,
    feedId:Int,
    content:String,
    type:String!
    ):NewRoomResult!

    message(content: String!, roomId:Int!): Message

    sendFriendRequest(userId:Int!):User

    friendRequestAction(userId:Int!, type:String!):User
  }
`
export default typeDefs