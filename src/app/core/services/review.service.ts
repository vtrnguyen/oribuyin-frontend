import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { CreateReviewDto } from "../../shared/dtos/create_review.dto";

@Injectable({
    providedIn: "root",
})
export class ReviewsService {
    private reviewApiUrl = "http://localhost:3000/api/v1/reviews";

    constructor(private http: HttpClient) { }

    createReview(review: CreateReviewDto): Observable<any> {
        return this.http.post<any>(`${this.reviewApiUrl}`, review);
    }

    getReviewsByAvgRating(page: number = 1, pageSize: number = 5, rating?: number | null): Observable<any> {
        const params: any = {
            page: page.toString(),
            pageSize: pageSize.toString(),
        };
        if (rating !== null && rating !== undefined) {
            params.rating = rating.toString();
        }
        return this.http.get<any>(`${this.reviewApiUrl}/by-average-rating`, { params });
    }
}
