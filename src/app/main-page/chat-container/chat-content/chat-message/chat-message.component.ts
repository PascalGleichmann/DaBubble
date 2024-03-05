import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { OverlayService } from '../../../../services/overlay.service';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss'
})
export class ChatMessageComponent {
  overlay = inject(OverlayService);

  isOwnMessage: boolean = true;


  openMemberView(event: MouseEvent) {
    event.stopPropagation();
    this.overlay.toggleMemberView();
  }
}
