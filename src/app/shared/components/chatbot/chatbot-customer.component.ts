import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-chatbot-customer',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './chatbot-customer.component.html',
    styleUrls: ['./chatbot-customer.component.scss']
})
export class ChatbotCustomerComponent {
    isChatbotOpen: boolean = false;
    chatbotInput: string = '';
    chatbotAnimation: 'in' | 'out' = 'in';
    chatbotMessages: Array<{ from: 'user' | 'bot', text: string }> = [
        { from: 'bot', text: 'Xin chào! Tôi là Chat Bot OriBuyin. Bạn cần hỗ trợ gì về mua sắm hôm nay?' }
    ];

    sendChatbotMessage(): void {
        const input = this.chatbotInput.trim();
        if (!input) return;
        this.chatbotMessages.push({ from: 'user', text: input });
        this.chatbotInput = '';
        setTimeout(() => {
            this.chatbotMessages.push({ from: 'bot', text: this.getBotReply(input) });
        }, 600);
    }

    getBotReply(input: string): string {
        const lower = input.toLowerCase();
        if (lower.includes('giá') || lower.includes('bao nhiêu')) {
            return 'Bạn muốn hỏi giá sản phẩm nào? Vui lòng nhập tên sản phẩm.';
        }
        if (lower.includes('cách mua') || lower.includes('mua như thế nào')) {
            return 'Bạn có thể thêm sản phẩm vào giỏ hàng và tiến hành thanh toán.';
        }
        if (lower.includes('khuyến mãi') || lower.includes('giảm giá')) {
            return 'Bạn có thể xem các sản phẩm khuyến mãi tại trang chủ hoặc mục khuyến mãi.';
        }
        if (lower.includes('giao hàng')) {
            return 'OriBuyin giao hàng toàn quốc, thời gian từ 2-5 ngày làm việc.';
        }
        if (lower.includes('hỗ trợ') || lower.includes('liên hệ')) {
            return 'Bạn có thể liên hệ hotline 0368686868 hoặc email jorigindev@gmail.com.';
        }
        return 'Cảm ơn bạn đã nhắn tin! Tôi sẽ chuyển câu hỏi của bạn đến nhân viên hỗ trợ nếu cần.';
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
}