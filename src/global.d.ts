declare module 'react-mixpanel-browser';

// uid: firebase user id
// cid: capture nano id

declare namespace Capture {
  export type Creator = {
    uid: string;
    displayName?: string;
    email?: string;
    avatar?: string;
  };

  export type Info = {
    capturedUrl: string;
    createdAt: number;
    group: string;
    port: string;
    url: string;
    cid: string;
    comments: Comment[];
    creator: Creator;
    view: {
      count: number;
      viewer: string[];
    };
    type?: 'pdf';
    order?: number;
    filename?: string;
  };

  export type Marker = {
    box: Omit<DOMRectReadOnly, 'toJSON'>;
    x: number;
    y: number;
  };

  export type Comment = {
    marker: Marker;
    replies?: Reply[];
    content: string;
    creator: Creator;
    createdAt: number;
    updatedAt: number;
    isTemp?: boolean;
  };

  export type Reply = {
    creator: Creator;
    content: string;
    createdAt: number;
    updatedAt: number;
  };

  export type SortedComment = Comment & { index: number };

  export type CommentType = 'POST' | 'REPLY';
  export type CommentModifyType = 'EDIT' | 'DELETE' | 'WRITE';
  export type CurrentComment = {
    commentIndex: number;
    replyIndex: number;
    isPost: boolean;
    isBeingModify: boolean;
    content: string;
    type: CommentType;
    modifyType: CommentModifyType;
    timestamp: number;
  };

  export interface Invitation {
  }

  export class InvitationData {
  }
}
