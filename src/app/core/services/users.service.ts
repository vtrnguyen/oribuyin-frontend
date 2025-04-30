import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { User } from "../../shared/interfaces/user.interface";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: "root",
})
export class UsersService {
    private userApiUrl = "http://localhost:3000/api/v1/users";
    private usersSubject = new BehaviorSubject<User[]>([]);
    users$ = this.usersSubject.asObservable();

    constructor(private http: HttpClient) {}

    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.userApiUrl}`).pipe(
            tap(users => this.usersSubject.next(users)),
        );
    }

    getNumberOfUsers(): Observable<any> {
        return this.http.get<any>(`${this.userApiUrl}/count`);
    }

    createUser(newUser: any, newAccount: any): Observable<any> {
        return this.http.post<any>(`${this.userApiUrl}`, { newUser, newAccount });
    }

    updateUser(userID: number, updatingUser: any, updatingAccount: any): Observable<any> {
        return this.http.put<any>(`${this.userApiUrl}/${userID}`, { updatingUser, updatingAccount });
    }

    deleteUser(userID: number): Observable<any> {
        return this.http.delete<any>(`${this.userApiUrl}/${userID}`);
    }

    getCurrentUsers(): User[] {
        return this.usersSubject.value;
    }
}
