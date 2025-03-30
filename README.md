# Bruised Neon Player

A cinematic, gritty music player web application with a unique "unlock" interaction and dynamic visual styling.

## Features

- Cinematic "unlock" interaction with the album cover
- Dynamic background that changes based on the current track's album art
- Full music player functionality (play, pause, skip, shuffle, repeat)
- Responsive design for both mobile and desktop
- Gritty, post-industrial visual aesthetic
- Volume control and progress bar
- Track list with visual feedback

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd bruised-neon-player
```

2. Install dependencies:
```bash
npm install
```

3. Add your audio files:
- Place your MP3 files in the `/audio` directory
- Name them according to the pattern: `track1.mp3`, `track2.mp3`, etc.

4. Add your album artwork:
- Place your album cover images in the `/assets` directory
- Name them according to the pattern: `cover1.jpg`, `cover2.jpg`, etc.

5. Start the server:
```bash
npm start
```

6. Open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure

```
/audio          # contains .mp3 files
/assets         # album cover images and other media
/public
  index.html    # main HTML file
  styles.css    # styles
  app.js        # player logic
server.js       # Node + Express backend
package.json    # project dependencies
```

## Customization

### Adding More Tracks

Edit the `tracks` array in `public/app.js` to add or modify tracks:

```javascript
const tracks = [
    {
        title: "Track Title",
        artist: "Artist Name",
        duration: "3:45",
        audio: "/audio/track1.mp3",
        cover: "/assets/cover1.jpg"
    },
    // Add more tracks here
];
```

### Styling

The application uses CSS variables for easy customization. Edit the variables in `public/styles.css`:

```css
:root {
    --gunmetal: #2A2A2A;
    --iridescent-purple: #2D1B3D;
    --blood-orange: #8B0000;
    --matte-black: #1A1A1A;
    --text-primary: #E0E0E0;
    --text-secondary: #A0A0A0;
    --accent-color: #FF3B3B;
}
```

## Browser Support

The application is built with modern web standards and is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this project for your own purposes. 