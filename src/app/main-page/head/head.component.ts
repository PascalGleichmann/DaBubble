import { Component, inject } from '@angular/core';
import { SearchBarComponent } from "./search-bar/search-bar.component";
import { DropdownMenuComponent } from '../overlay/dropdown-menu/dropdown-menu.component';
import { CommonModule } from '@angular/common';
import { OverlayService } from '../../services/overlay.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-head',
    standalone: true,
    templateUrl: './head.component.html',
    styleUrl: './head.component.scss',
    imports: [
        SearchBarComponent,
        DropdownMenuComponent,
        CommonModule
    ]
})
export class HeadComponent {
    overlay = inject(OverlayService);
    name: string | null = '';
    imgSrc: string = 'assets/img/start-page/unknown.svg';
    private firestore: Firestore = inject(Firestore);
    auth = getAuth();
    authSubscription: Subscription | null = null;

    ngOnInit() {
        this.loggedInUser();
        this.findImageUrl();
    }

    ngOnDestroy() {
        if (this.authSubscription) {
            this.authSubscription.unsubscribe();
        }
    }

    findImageUrl() {
        this.authSubscription = new Subscription(() => {
        });
        const unsubscribe = onAuthStateChanged(this.auth, async (user) => {
            if (user) {
                const userDocRef = doc(this.firestore, 'users', user.uid);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data();
                    this.imgSrc = userData['image'];
                }
            }
        });
        this.authSubscription.add(unsubscribe);
    }

    openDropdownMenu(event: MouseEvent) {
        event.stopPropagation();
        this.overlay.toggleDropdownMenu();
    }

    loggedInUser() {
        if (this.authSubscription) {
            this.authSubscription.unsubscribe();
        }
        this.authSubscription = new Subscription(() => {
        });
        const unsubscribe = onAuthStateChanged(this.auth, async (user) => {
            if (user?.displayName) {
                this.name = user.displayName;
            } else {
                this.name = 'Guest';
            }
        });
        this.authSubscription.add(unsubscribe);
    }
}
