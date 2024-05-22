import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

const initialArticles = {
    articlesAdditionalWork: [],
    articlesMaterial: [],
    articlesOther: []
};

@Injectable({
    providedIn: 'root',
})
export class RikiService {

    articles = {
        articlesAdditionalWork: [],
        articlesMaterial: [],
        articlesOther: []
    };
    modalState = new BehaviorSubject(false);
    $articles = new Subject();
    
    constructor() {}

    getArticlesSubject() {
        return this.$articles;
    }

    getArticles() {
        return this.articles;
    }

    clearArticles() {
        return this.articles = initialArticles;
    }

    addArticles(articles) {
        this.articles = articles;
        this.$articles.next(articles);
    }

    getModalState() {
        return this.modalState;
    }

    toggleRikiModal(state) {
        this.modalState.next(state);
    }
}