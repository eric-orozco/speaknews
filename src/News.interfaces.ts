export interface Article {
  abstract: string;
  lead_paragraph: string;
  source: string;
  byline: string;
  headline: string;
  multimedia: {
    type?: string;
    url?: string;
  };
  url: string;
  pub_date: string;
}

export interface News {
  status: string;
  totalResults: number;
  articles: Article[];
}
