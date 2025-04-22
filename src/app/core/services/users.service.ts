import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { User } from "../../shared/interfaces/user.interface";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: "root",
})
export class UsersService {
    private authApiUrl = "http://localhost:3000/api/v1/users";
    private usersSubject = new BehaviorSubject<User[]>([]);
    users$ = this.usersSubject.asObservable();

    constructor(private http: HttpClient) {}

    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.authApiUrl}`).pipe(
            tap(users => this.usersSubject.next(users)),
        );
    }

    getCurrentUsers(): User[] {
        return this.usersSubject.value;
    }
}
