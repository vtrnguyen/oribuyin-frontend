import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { CreateReviewDto } from "../../shared/dtos/create_review.dto";

@Injectable({
    providedIn: "root",
})
export class ReviewsService {
    private reviewApiUrl = "http://localhost:3000/api/v1/Reviews";

    constructor(private http: HttpClient) { }

    createReview(review: CreateReviewDto): Observable<any> {
        return this.http.post<any>(`${this.reviewApiUrl}`, review);
    }
}
