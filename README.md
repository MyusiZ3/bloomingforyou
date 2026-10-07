# Blooming For You

An interactive birthday celebration website designed with a vintage botanical scrapbook theme. Built with standard HTML, Vanilla CSS, and JavaScript with no external framework dependencies.

## Features

- **Entrance Gate**: A floral curtain gateway unlocked by a pin code or interactive heart padlock.
- **Sealed Envelope**: A 3D vintage envelope with a wax seal that plays paper sliding audio upon opening.
- **Birthday Cake & Candles**: An interactive 22nd birthday cake where candles can be clicked or blown out, followed by a character story sequence.
- **Floral Bouquet**: A layered botanical bouquet with ambient floating petal canvas effects.
- **Parchment Letter**: A custom handwritten-style letter sheet.
- **Scratch-off Polaroid Scrapbook**: Multi-photo collage spreads (duo and trio layouts) featuring realistic scratch-to-reveal canvas cards, vintage newspaper clippings, postage stamps, washi tape, dried botanicals, and ambient floating animations.
- **Mystery Gift Box**: An interactive gift box with shake audio, confetti bursts, and sequential text reveal animations.
- **Background Music**: Integrated audio player with a floating toggle control.

## Project Structure

```text
bloomingforyou/
├── assets/
│   ├── audio/          # Sound effects and background music
│   ├── css/            # Modular stylesheets (base, bouquet, cake, curtain, envelope, giftbox, letter, parallax, scrapbook)
│   ├── images/         # Image assets (Moments, characters, flowers, polaroids)
│   └── js/             # Application logic (main.js, petals.js)
├── config.js           # Central configuration file
├── index.html          # Main HTML entry point
└── README.md
```

## Configuration

All custom text, recipient information, letter content, music settings, and photos can be customized directly in `config.js`:

### 1. Photos and Captions
Add images to `assets/images/Moments/` and register them in the `polaroids` array inside `config.js`:

```javascript
polaroids: [
  {
    id: "first-together",
    spread: 1,
    title: "First Pic Together",
    image: "assets/images/Moments/first.jpg",
    caption: "first pic together btw :3",
    rotation: "-5.5deg"
  },
  // ...
]
```

### 2. Letter Content
Modify the `letter` object in `config.js` to change the greeting, paragraphs, and sign-off:

```javascript
letter: {
  salutation: "Dear Aliya,",
  paragraphs: [
    "Your message here...",
  ],
  closing: "With love,",
  signature: "Your Name",
}
```

### 3. Background Music
Set the track information in `config.js`:

```javascript
music: {
  title: "wave to earth - seasons",
  src: "assets/audio/track.dat",
  autoplayOnOpen: true,
}
```

## Deployment

This is a static site and can be hosted on GitHub Pages or any static web host.

### Deploying to GitHub Pages:
1. Push the repository to GitHub.
2. Go to **Settings** > **Pages** in the repository.
3. Under **Build and deployment > Source**, select **Deploy from a branch**.
4. Set the branch to **main** and folder to **/ (root)**, then click **Save**.
5. The live site will be available at `https://<username>.github.io/<repository-name>/`.
