


export interface ArticleInterface {
    id: number;
    article: string;
    description: string;
    quantity: string;
    unit: string;
    pricePerUnit: string;
    percentage: string;
    total: string;
    fontWeight: 'normal' | 'bold';
    orderIndex: number;
};


export interface LineInterface {
    title: string;
    id: string;
    articles: ArticleInterface[];
};




export default {};
