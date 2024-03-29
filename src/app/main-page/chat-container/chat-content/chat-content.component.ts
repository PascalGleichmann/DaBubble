import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild, inject } from '@angular/core';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { CollectionReference, Firestore, collection, doc, getDocs, onSnapshot, orderBy, query } from '@angular/fire/firestore';
import { DirectMessagesService } from '../../../services/direct-messages.service';
import { PrivateMessageComponent } from '../private-message/private-message.component';
import { SelectionService } from '../../../services/selection.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-chat-content',
  standalone: true,
  imports: [CommonModule, ChatMessageComponent, PrivateMessageComponent],
  templateUrl: './chat-content.component.html',
  styleUrl: './chat-content.component.scss'
})
export class ChatContentComponent implements AfterViewInit, OnDestroy {
  firestore: Firestore = inject(Firestore);
  DMService: DirectMessagesService = inject(DirectMessagesService);
  selectionService: SelectionService = inject(SelectionService);
  private selectionIdSubscription: Subscription;
  private unsubscribeChannelMessages: (() => void) | undefined;
  choosenChatId: string = '';
  @ViewChild('chatList')
  chatList!: ElementRef;
  private chatHistoryLoadedSubscription!: Subscription;
  isLoading: boolean = false;


  messages: any[] = [];

  constructor(private renderer: Renderer2) {
    this.selectionIdSubscription = this.selectionService.choosenChatTypeId.subscribe(newId => {
      this.choosenChatId = newId;
      if (this.choosenChatId != '') {
        this.subscribeChannelMessagesChanges();
      }
    });
  }

  ngAfterViewInit() {
    this.chatHistoryLoadedSubscription = this.DMService.chatHistoryLoaded$.subscribe(() => {
      setTimeout(() => {
        this.scrollToBottom();
      }, 1);
    });
  }

  scrollToBottom() {
    if (this.chatList) {
      this.renderer.setProperty(this.chatList.nativeElement, 'scrollTop', this.chatList.nativeElement.scrollHeight);
    }
  }

  subscribeChannelMessagesChanges() {
    if (this.unsubscribeChannelMessages) {
      this.unsubscribeChannelMessages();
    }
      const channelsRef = collection(this.firestore, 'channels', this.choosenChatId, 'messages');
      const channelQuery = query(channelsRef);
      this.unsubscribeChannelMessages = onSnapshot(channelQuery, { includeMetadataChanges: true }, (querySnapshot) => {
        this.loadChannelMessages();
      }
      )
  }

  async loadChannelMessages() {
    this.messages = [];
    const collRef = collection(this.firestore, 'channels', this.choosenChatId, 'messages');
    const q = query(collRef, orderBy('postTime'));

    await getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const postDate = new Date(doc.data()['postTime']);
        const hours = postDate.getHours().toString().padStart(2, '0');
        const minutes = postDate.getMinutes().toString().padStart(2, '0');
        const formattedPostTime = `${hours}:${minutes}`;

        const formattedPostDate = postDate.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });

        this.messages.push({
          text: doc.data()['text'],
          posthour: formattedPostTime,
          postDay: formattedPostDate,
          reactions: doc.data()['reactions'],
          authorId: doc.data()['authorId'],
          docId: doc.data()['docId']
        });
      });
    });
  }

  ngOnDestroy() {
    this.chatHistoryLoadedSubscription.unsubscribe();
    this.selectionIdSubscription.unsubscribe();
    if (this.unsubscribeChannelMessages) {
      this.unsubscribeChannelMessages();
    }
  }
}
