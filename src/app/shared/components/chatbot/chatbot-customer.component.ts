import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiChatService } from '../../services/gemini-chat.service';
import { ClickOutsideModule } from 'ng-click-outside';

@Component({
    selector: 'app-chatbot-customer',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ClickOutsideModule,
    ],
    templateUrl: './chatbot-customer.component.html',
    styleUrls: ['./chatbot-customer.component.scss']
})
export class ChatbotCustomerComponent {
    isChatbotOpen: boolean = false;
    chatbotInput: string = '';
    chatbotAnimation: 'in' | 'out' = 'in';
    isBotLoading: boolean = false;
    isSettingOpen: boolean = false;
    chatbotMessages: Array<{ from: 'user' | 'bot', text: string, loading?: boolean }> = [
    ];

    isRecording = false;
    recordTime = 0;
    audioBars: number[] = [8, 16, 12, 20, 10, 18, 14, 22];
    private recordInterval: any;
    private recognition: any;


    // scroll message to bottom properties
    private shouldScrollToBottom = false;
    @ViewChild('chatScroll') chatScroll!: ElementRef<HTMLDivElement>;

    // speech recognition properties
    private isRecognitionStopping = false;

    constructor(private geminiChat: GeminiChatService) { }

    ngAfterViewChecked() {
        if (this.shouldScrollToBottom) {
            this.scrollToBottom();
            this.shouldScrollToBottom = false;
        }
    }

    sendChatbotMessage(): void {
        const input = this.chatbotInput.trim();
        if (!input) return;
        this.chatbotMessages.push({ from: 'user', text: input });
        this.chatbotInput = '';
        this.chatbotMessages.push({ from: 'bot', text: '', loading: true });
        this.shouldScrollToBottom = true;
        this.geminiChat.sendMessage(input).subscribe({
            next: (res) => {
                const reply = res?.candidates?.[0]?.content?.parts?.[0]?.text || 'Bot chưa có phản hồi.';
                const idx = this.chatbotMessages.findIndex(m => m.loading);
                if (idx !== -1) this.chatbotMessages[idx] = { from: 'bot', text: reply };
                this.shouldScrollToBottom = true;
            },
            error: () => {
                const idx = this.chatbotMessages.findIndex(m => m.loading);
                if (idx !== -1) this.chatbotMessages[idx] = { from: 'bot', text: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
                this.shouldScrollToBottom = true;
            }
        });
    }

    openChatbot() {
        this.chatbotAnimation = 'in';
        this.isChatbotOpen = true;
    }

    closeChatbot() {
        this.chatbotAnimation = 'out';
        setTimeout(() => {
            this.isChatbotOpen = false;
        }, 250);
    }

    toggleSetting() {
        this.isSettingOpen = !this.isSettingOpen;
    }

    clearChat() {
        this.chatbotMessages = [
        ];
        this.isSettingOpen = false;
    }

    toggleVoiceInput() {
        if (this.isRecording) {
            this.isRecording = false;
            clearInterval(this.recordInterval);

            if (this.recognition) {
                this.isRecognitionStopping = true;
                this.recognition.stop();
            }
        } else {
            if (!('webkitSpeechRecognition' in window)) {
                alert('Trình duyệt của bạn không hỗ trợ nhận diện giọng nói!');
                return;
            }

            if (this.isRecognitionStopping) return;

            this.isRecording = true;
            this.recordTime = 0;
            this.audioBars = [8, 16, 12, 20, 10, 18, 14, 22];

            this.recordInterval = setInterval(() => {
                this.recordTime += 1000;
                this.audioBars = this.audioBars.map(() => Math.floor(Math.random() * 20) + 8);
            }, 1000);

            this.recognition = new (window as any).webkitSpeechRecognition();
            this.recognition.lang = 'vi-VN';
            this.recognition.interimResults = false;
            this.recognition.maxAlternatives = 1;

            this.recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                this.chatbotInput = transcript;
            };

            this.recognition.onerror = () => {
                alert('Không thể nhận diện giọng nói. Vui lòng thử lại!');
                this.isRecording = false;
                clearInterval(this.recordInterval);
                this.isRecognitionStopping = false;
            };

            this.recognition.onend = () => {
                this.isRecording = false;
                clearInterval(this.recordInterval);
                this.isRecognitionStopping = false;
            };

            this.recognition.start();
        }
    }

    private scrollToBottom() {
        try {
            this.chatScroll.nativeElement.scrollTop = this.chatScroll.nativeElement.scrollHeight;
        } catch (err) { }
    }
}