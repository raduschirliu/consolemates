import ITopic from './Topic';

export default interface ILetter {
  id: string;
  author_id: string;
  author_name: string;
  recipient_id: string;
  reply_id?: string;
  subject: string;
  content: string;
  sentiment: number;
  viewed: boolean;
  topics: ITopic[];
};

export interface ILetterPost {
  reply_id?: string;
  subject: string;
  content: string;
  topics: string[];
};
