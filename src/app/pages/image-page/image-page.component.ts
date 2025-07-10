import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-image-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './image-page.component.html',
  styleUrl: './image-page.component.css'
})
export class ImagePageComponent {
  imageUrl = '';
  loading = true;
  showImage = false;
  teleImg = 'assets/TeleStatic.png';
  partagerImg = 'assets/PartagerStatic.png';
  arrowImg = 'assets/en-arriereStatic.png';
  instaImg = 'assets/partage/InstaStatic.png';
  mailImg = 'assets/partage/EmailStatic.png';
  mmsImg = 'assets/partage/MMSStatic.png';
  showSocials = false;
  showMailPopup = false;
  showMmsPopup = false;
  mailAddress = '';
  phoneNumber = '';
  mmsPhoneNumber = '';
  mailError = '';
  mmsError = '';
  mailSuccess = false;
  mmsSuccess = false;

  async ngOnInit() {
    // 1. Affiche le loader
    this.loading = true;
    this.showImage = false;

    // 2. Récupère le prompt et lance l'appel API
    const prompt = localStorage.getItem('comicPrompt') || '';
    if (!prompt) {
      this.loading = false;
      this.showImage = true;
      this.imageUrl = 'assets/erreur-404.gif';
      return;
    }
    try {
      // Appel /comic-json
      const jsonRes = await fetch('http://10.74.8.226:3000/comic-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      if (!jsonRes.ok) throw new Error('Erreur API /comic-json');
      const cases = await jsonRes.json();
      // Appel /comic-image
      const imgRes = await fetch('http://10.74.8.226:3000/comic-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cases: cases.cases })
      });
      if (!imgRes.ok) throw new Error('Erreur API /comic-image');
      const blob = await imgRes.blob();
      const imageUrl = URL.createObjectURL(blob);
      // 3. Quand l'image est prête, affiche l'image avec effet pop
      this.loading = false;
      setTimeout(() => {
        this.showImage = true;
        this.imageUrl = imageUrl;
      }, 100); // petit délai pour la transition
    } catch (e) {
      this.loading = false;
      this.showImage = true;
      this.imageUrl = 'assets/erreur-404.gif';
    }
  }

  onTeleHover() {
    this.teleImg = 'assets/TeleAnime.gif';
  }

  onTeleLeave() {
    this.teleImg = 'assets/TeleStatic.png';
  }

  onPartagerHover() {
    this.partagerImg = 'assets/PartagerAnime.gif';
  }

  onPartagerLeave() {
    this.partagerImg = 'assets/PartagerStatic.png';
  }

  onArrowHover() {
    this.arrowImg = 'assets/en-arriereAnime.gif';
  }

  onArrowLeave() {
    this.arrowImg = 'assets/en-arriereStatic.png';
  }

  onInstaHover() {
    this.instaImg = 'assets/partage/InstaAnime.gif';
  }

  onInstaLeave() {
    this.instaImg = 'assets/partage/InstaStatic.png';
  }

  onMailHover() {
    this.mailImg = 'assets/partage/EmailAnim.gif';
  }

  onMailLeave() {
    this.mailImg = 'assets/partage/EmailStatic.png';
  }

  onMmsHover() {
    this.mmsImg = 'assets/partage/MMSAnime.gif';
  }

  onMmsLeave() {
    this.mmsImg = 'assets/partage/MMSStatic.png';
  }

  downloadImage() {
    if (!this.imageUrl) return;
    const a = document.createElement('a');
    a.href = this.imageUrl;
    a.download = 'comic.jpg';
    a.click();
  }

  shareOnInstagram() {
    // À personnaliser selon l'intégration souhaitée
    window.open('https://www.instagram.com/comicshotgun/', '_blank');
  }

  shareOnReddit() {
    // À personnaliser selon l'intégration souhaitée
    window.open('https://www.reddit.com/submit', '_blank');
  }

  toggleSocials() {
    this.showSocials = !this.showSocials;
  }

  openMailPopup() {
    this.showMailPopup = true;
    this.mailAddress = '';
    this.mailError = '';
    this.mailSuccess = false;
  }

  closeMailPopup() {
    this.showMailPopup = false;
    this.mailAddress = '';
    this.mailError = '';
    this.mailSuccess = false;
  }

  openMmsPopup() {
    this.showMmsPopup = true;
    this.mmsPhoneNumber = '';
    this.mmsError = '';
    this.mmsSuccess = false;
  }

  closeMmsPopup() {
    this.showMmsPopup = false;
    this.mmsPhoneNumber = '';
    this.mmsError = '';
    this.mmsSuccess = false;
  }

  async sendMailOrSms() {
    this.mailError = '';
    this.mailSuccess = false;
    const hasMail = this.mailAddress && this.mailAddress.match(/^\S+@\S+\.\S+$/);
    const hasPhone = this.phoneNumber && this.phoneNumber.match(/^\+?\d{8,15}$/);
    if (!hasMail && !hasPhone) {
      this.mailError = 'Veuillez renseigner un mail ou un numéro.';
      return;
    }
    try {
      if (hasMail) {
        const res = await fetch('http://10.74.8.226:3000/send-mail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: this.mailAddress,
            imageUrl: this.imageUrl
          })
        });
        if (!res.ok) throw new Error('Erreur lors de l\'envoi du mail');
      }
      if (hasPhone) {
        const res = await fetch('http://10.74.8.226:3000/send-sms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: this.phoneNumber,
            imageUrl: this.imageUrl
          })
        });
        if (!res.ok) throw new Error('Erreur lors de l\'envoi du SMS');
      }
      this.mailSuccess = true;
      setTimeout(() => this.closeMailPopup(), 1500);
    } catch (e) {
      this.mailError = 'Erreur lors de l\'envoi.';
    }
  }

  async sendMms() {
    this.mmsError = '';
    this.mmsSuccess = false;
    if (!this.mmsPhoneNumber || !this.mmsPhoneNumber.match(/^\+?\d{8,15}$/)) {
      this.mmsError = 'Numéro invalide.';
      return;
    }
    try {
      const res = await fetch('http://10.74.8.226:3000/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: this.mmsPhoneNumber,
          imageUrl: this.imageUrl
        })
      });
      if (!res.ok) throw new Error('Erreur lors de l\'envoi du MMS');
      this.mmsSuccess = true;
      setTimeout(() => this.closeMmsPopup(), 1500);
    } catch (e) {
      this.mmsError = 'Erreur lors de l\'envoi du MMS.';
    }
  }
}
