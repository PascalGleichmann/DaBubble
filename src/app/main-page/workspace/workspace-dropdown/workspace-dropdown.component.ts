import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { DirectMessagesService } from '../../../services/direct-messages.service';
import { ChannelSelectionService } from '../../../services/channel-service/channel-selection.service';


@Component({
  selector: 'app-workspace-dropdown',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './workspace-dropdown.component.html',
  styleUrl: './workspace-dropdown.component.scss'
})
export class WorkspaceDropdownComponent {
  @Input() name = "";
  @Input() channel = false;
  @Input() active = true;
  @ViewChild('arrow') arrow: HTMLImageElement | undefined;
  channelService = inject(ChannelSelectionService);
  authService: AuthService = inject(AuthService);
  DMService: DirectMessagesService = inject(DirectMessagesService);
  showList = false;
  existingChannels = this.channelService.channels;

  constructor() { 
    
    console.log(this.existingChannels)
   }


  ngOnInit() {
    this.DMService.fetchUserNames();
    this.checkName();
  }

  sendChannelId(index: number){
    this.channelService.choosenChannelId.next(this.channelService.channelIds[index]);
    this.channelService.channelOrDM.next('channel');
  }

  sendDMId(index: number){
    this.channelService.choosenChannelId.next(this.channelService.DMIds[index]);
    this.channelService.channelOrDM.next('direct-message');
  }

  checkName() {
    if (this.name === 'Direktnachrichten') {
      this.showList = true;
    }
  }



  toggleActiveDropdown(event: Event) {
    this.active = !this.active;
  }
}