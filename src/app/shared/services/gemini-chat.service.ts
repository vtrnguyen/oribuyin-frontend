import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GeminiChatService {
    private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    private apiKey = environment.GEMINI_API_KEY;

    constructor(private http: HttpClient) { }

    sendMessage(text: string): Observable<any> {
        const url = `${this.apiUrl}?key=${this.apiKey}`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        const body = {
            contents: [
                {
                    parts: [
                        { text }
                    ]
                }
            ]
        };

        return this.http.post(url, body, { headers });
    }
}