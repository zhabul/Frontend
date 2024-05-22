import { ArticleInterface } from './row-line/interfaces';


const EmptyArticle:ArticleInterface = {
    id: -1,
    article: '',
    description: '',
    quantity: '',
    unit: '',
    pricePerUnit: '',
    percentage: '',
    total: '',
    fontWeight: 'normal',
    orderIndex: -1
};


export const sanitizeNumber = (number:string) => {
    return Number(number.toString()
    .replace(/\s/g, "")
    .replace(",", "."));
};

export const copyEmptyArticle = () => {
    return { ...EmptyArticle };
};

export const pushEmptyArticlesToLines = (lines, count = 1) => {
    return lines.map((line)=>{
        const newArtciels = line.articles.slice(0);
        if(line.articles.length == 0){
          newArtciels.push({ ...EmptyArticle });
        }
              // let i = 0;
              // while (i < count) {
              //     newArtciels.push({ ...EmptyArticle });
              //     i++;
              // }

        return { ...line, articles: newArtciels };
    })
};


export default {};
