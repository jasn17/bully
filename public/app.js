// Track data
const tracks = [
    {
        title: "Preacher Man",
        artist: "Ye",
        duration: "3:02",
        audio: "/audio/PreacherMan.mp3",
        cover: "/assets/cover1.jpg"
    },
    {
        title: "Mine Forward",
        artist: "Ye",
        duration: "1:53",
        audio: "/audio/MindForward.mp3",
        cover: "/assets/cover2.jpg"
    },
    {
        title: "Close To You",
        artist: "Ye",
        duration: "1:53",
        audio: "/audio/CloseToYou.mp3",
        cover: "/assets/cover3.jpg"
    },
    {
        title: "Circles",
        artist: "Ye",
        duration: "2:41",
        audio: "/audio/circles.mp3",
        cover: "/assets/cover4.jpg"
    },
    {
        title: "Seratonin",
        artist: "Ye",
        duration: "2:42",
        audio: "/audio/Seratonin.mp3",
        cover: "/assets/cover5.jpg"
    },
    {
        title: "Besame Mama",
        artist: "Ye",
        duration: "2:08",
        audio: "/audio/BesameMama.mp3",
        cover: "/assets/cover1.jpg"
    },
    {
        title: "Losing Your Mind",
        artist: "Ye",
        duration: "3:24",
        audio: "/audio/LosingYourMind.mp3",
        cover: "/assets/cover2.jpg"
    },
    {
        title: "Beauty and the Beast",
        artist: "Ye",
        duration: "1:46",
        audio: "/audio/BeautyAndTheBeast.mp3",
        cover: "/assets/cover3.jpg"
    },
    {
        title: "Showtime",
        artist: "Ye",
        duration: "3:18",
        audio: "/audio/Showtime.mp3",
        cover: "/assets/cover4.jpg"
    },
    {
        title: "Highs and Lows",
        artist: "Ye",
        duration: "1:47",
        audio: "/audio/HighsAndLows.mp3",
        cover: "/assets/cover5.jpg"
    },
    {
        title: "Melrose",
        artist: "Ye",
        duration: "3:39",
        audio: "/audio/Melrose.mp3",
        cover: "/assets/cover5.jpg"
    }
];

// DOM Elements
const albumCover = document.getElementById('albumCover');
const playerContainer = document.getElementById('playerContainer');
const trackList = document.getElementById('trackList');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const volumeSlider = document.getElementById('volumeSlider');
const progressBar = document.getElementById('progressBar');
const currentTimeDisplay = document.getElementById('currentTime');
const durationDisplay = document.getElementById('duration');
const trackTitle = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');

// Player State
let currentTrack = 0;
let isPlaying = false;
let isShuffled = false;
let isRepeat = false;
let audio = new Audio();
let isUnlocked = false;

// Initialize
function init() {
    // Populate track list
    tracks.forEach((track, index) => {
        const trackElement = document.createElement('div');
        trackElement.className = 'track-item';
        trackElement.innerHTML = `
            <span class="track-number">${index + 1}</span>
            <span class="track-title">${track.title}</span>
            <span class="track-duration">${track.duration}</span>
        `;
        trackElement.addEventListener('click', () => playTrack(index));
        trackList.appendChild(trackElement);
    });

    // Set up audio event listeners
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleTrackEnd);
    audio.addEventListener('loadedmetadata', () => {
        durationDisplay.textContent = formatTime(audio.duration);
    });

    // Set up volume control
    volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value / 100;
    });

    // Set up progress bar click
    document.querySelector('.progress-container').addEventListener('click', (e) => {
        const progressContainer = e.currentTarget;
        const clickPosition = e.offsetX / progressContainer.offsetWidth;
        audio.currentTime = clickPosition * audio.duration;
    });

    // Set up unlock interaction
    albumCover.addEventListener('click', unlockPlayer);
}

// Unlock animation
function unlockPlayer() {
    if (!isUnlocked) {
        isUnlocked = true;
        albumCover.style.transform = 'rotateY(180deg)';
        setTimeout(() => {
            playerContainer.style.opacity = '1';
            playerContainer.style.transform = 'translateY(0)';
        }, 500);
    }
}

// Play/Pause functionality
function togglePlay() {
    if (!isUnlocked) return;
    
    if (isPlaying) {
        audio.pause();
        playBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
    } else {
        audio.play();
        playBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>';
    }
    isPlaying = !isPlaying;
}

// Play specific track
function playTrack(index) {
    if (!isUnlocked) return;
    
    currentTrack = index;
    audio.src = tracks[index].audio;
    trackTitle.textContent = tracks[index].title;
    trackArtist.textContent = tracks[index].artist;
    
    // Update background
    document.querySelector('.app-container').style.setProperty('--background-image', `url(${tracks[index].cover})`);
    
    // Update active track in list
    document.querySelectorAll('.track-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
    
    audio.play();
    isPlaying = true;
    playBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>';
}

// Handle track end
function handleTrackEnd() {
    if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
    } else {
        playNext();
    }
}

// Play next track
function playNext() {
    if (isShuffled) {
        currentTrack = Math.floor(Math.random() * tracks.length);
    } else {
        currentTrack = (currentTrack + 1) % tracks.length;
    }
    playTrack(currentTrack);
}

// Play previous track
function playPrev() {
    if (isShuffled) {
        currentTrack = Math.floor(Math.random() * tracks.length);
    } else {
        currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
    }
    playTrack(currentTrack);
}

// Update progress bar
function updateProgress() {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progress}%`;
    currentTimeDisplay.textContent = formatTime(audio.currentTime);
}

// Format time
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Event Listeners
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', playPrev);
nextBtn.addEventListener('click', playNext);

shuffleBtn.addEventListener('click', () => {
    isShuffled = !isShuffled;
    shuffleBtn.classList.toggle('active');
});

repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active');
});

// Initialize the player
init(); 