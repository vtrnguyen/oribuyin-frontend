import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { Category } from "../../shared/interfaces/category.interface";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: "root",
})
export class CategoriesService {
    private categoryApiUrl = "http://localhost:3000/api/v1/categories";
    private categoriesSubject = new BehaviorSubject<Category[]>([]);
    categories$ = this.categoriesSubject.asObservable();

    constructor(private http: HttpClient) {}

    getAllCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(`${this.categoryApiUrl}`).pipe(
            tap(categories => this.categoriesSubject.next(categories)),
        );
    }

    getCategoryValue(): Observable<any[]> {
        return this.http.get<any[]>(`${this.categoryApiUrl}/values`);
    }

    createCategory(newCategory: any): Observable<any> {
        return this.http.post<any>(`${this.categoryApiUrl}`, { newCategory });
    }

    updateCategory(categoryID: number, updatingCategory: any): Observable<any> {
        return this.http.put<any>(`${this.categoryApiUrl}/${categoryID}`, { updatingCategory });
    }

    deleteCategory(categoryID: number): Observable<any> {
        return this.http.delete<any>(`${this.categoryApiUrl}/${categoryID}`);
    }
}
