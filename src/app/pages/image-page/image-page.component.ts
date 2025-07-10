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
  mailAddress = '';
  phoneNumber = '';
  mailError = '';
  mailSuccess = false;

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

  async sendMail() {
    this.mailError = '';
    this.mailSuccess = false;
    const hasMail = this.mailAddress && this.mailAddress.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    if (!hasMail) {
      this.mailError = 'Veuillez renseigner un mail.';
      return;
    }
    try {
      // Récupère le blob de l'image depuis l'URL blob:
      const response = await fetch(this.imageUrl);
      const blob = await response.blob();
      // Convertit le blob en base64
      const base64 = await this.blobToBase64(blob);
      // Envoie à l'API
      const res = await fetch('http://10.74.8.226:3000/send-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: this.mailAddress,
          imageBase64: base64
        })
      });
      if (!res.ok) throw new Error('Erreur lors de l\'envoi du mail');
      this.mailSuccess = true;
      setTimeout(() => this.closeMailPopup(), 1500);
    } catch (e) {
      this.mailError = 'Erreur lors de l\'envoi.';
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
