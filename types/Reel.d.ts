interface CommentReply {
  id: string;
  text: string;
  ownerUsername: string;
  ownerProfilePicUrl: string;
  timestamp: string;
  likesCount: number;
}

interface Comment {
  id: string;
  text: string;
  ownerUsername: string;
  ownerProfilePicUrl: string;
  timestamp: string;
  likesCount: number;
  repliesCount: number;
  replies?: CommentReply[];
}

interface InstagramPost {
  id: string;
  type: string;
  shortCode: string;
  caption: string;
  hashtags: string[];
  mentions: string[];
  url: string;
  commentsCount: number;
  firstComment: string;
  latestComments: Comment[];
  dimensionsHeight: number;
  dimensionsWidth: number;
  displayUrl: string;
  images: [];
  videoUrl: string;
  alt: null;
  likesCount: number;
  videoViewCount: number;
  videoPlayCount: number;
  timestamp: string;
  childPosts: [];
  ownerFullName: string;
  ownerUsername: string;
  ownerId: string;
  productType: string;
  videoDuration: number;
  isSponsored: boolean;
  taggedUsers: TaggedUser[];
}

interface TaggedUser {
  full_name: string;
  id: string;
  is_verified: boolean;
  profile_pic_url: string;
  username: string;
}

interface InstagramPage {
  username: string;
  followersCount: number;
}
