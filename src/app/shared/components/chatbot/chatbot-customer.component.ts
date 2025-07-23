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

    // scroll message to bottom properties
    private shouldScrollToBottom = false;
    @ViewChild('chatScroll') chatScroll!: ElementRef<HTMLDivElement>;

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

    private scrollToBottom() {
        try {
            this.chatScroll.nativeElement.scrollTop = this.chatScroll.nativeElement.scrollHeight;
        } catch (err) { }
    }
}