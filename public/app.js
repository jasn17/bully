// Track data
const tracks = [
    {
        title: "WW3",
        artist: "Ye",
        duration: "1:43",
        audio: "./audio/WW3.mp3",
        cover: "./assets/ww3cover.jpeg"
    },
    {
        title: "Preacher Man",
        artist: "Ye",
        duration: "3:02",
        audio: "./audio/PreacherMan.mp3",
        cover: "./assets/cover1.jpg"
    },
    {
        title: "Mind Forward",
        artist: "Ye",
        duration: "1:53",
        audio: "./audio/MindForward.mp3",
        cover: "./assets/cover2.jpg"
    },
    {
        title: "Close To You",
        artist: "Ye",
        duration: "1:53",
        audio: "./audio/CloseToYou.mp3",
        cover: "./assets/cover3.jpg"
    },
    {
        title: "Circles",
        artist: "Ye",
        duration: "2:41",
        audio: "./audio/Circles.mp3",
        cover: "./assets/cover4.jpg"
    },
    {
        title: "Seratonin",
        artist: "Ye",
        duration: "2:42",
        audio: "./audio/Seratonin.mp3",
        cover: "./assets/cover5.jpg"
    },
    {
        title: "Besame Mama",
        artist: "Ye",
        duration: "2:08",
        audio: "./audio/BesameMama.mp3",
        cover: "./assets/cover1.jpg"
    },
    {
        title: "Losing Your Mind",
        artist: "Ye",
        duration: "3:24",
        audio: "./audio/LosingYourMind.mp3",
        cover: "./assets/cover2.jpg"
    },
    {
        title: "Beauty And The Beast",
        artist: "Ye",
        duration: "1:46",
        audio: "./audio/BeautyAndTheBeast.mp3",
        cover: "./assets/cover3.jpg"
    },
    {
        title: "Showtime",
        artist: "Ye",
        duration: "3:18",
        audio: "./audio/Showtime.mp3",
        cover: "./assets/cover4.jpg"
    },
    {
        title: "Highs And Lows",
        artist: "Ye",
        duration: "1:47",
        audio: "./audio/HighsAndLows.mp3",
        cover: "./assets/cover5.jpg"
    },
    {
        title: "Melrose",
        artist: "Ye",
        duration: "3:39",
        audio: "./audio/Melrose.mp3",
        cover: "./assets/cover1.jpg"
    },
    {
        title: "Bianca",
        artist: "Ye",
        duration: "2:10",
        audio: "./audio/bianca.mp3",
        cover: "./assets/ww3cover.jpeg"
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

// Drag to unlock state
let isDragging = false;
let startX = 0;
let currentX = 0;
let dragThreshold = 80;
let dragSensitivity = 1.5;

// Initialize
function init() {
    // Add initial class to album cover container
    const albumCoverContainer = document.querySelector('.album-cover-container');
    albumCoverContainer.classList.add('initial');
    
    // Set initial title
    document.title = "B U L L Y";
    
    // Set up drag to unlock first
    setupDragToUnlock();
    
    // Set up collapsible playlist on mobile
    setupCollapsiblePlaylist();
    
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
}

// Drag to unlock functionality
function setupDragToUnlock() {
    const albumCover = document.getElementById('albumCover');
    const container = document.querySelector('.album-cover-container');
    
    if (!albumCover || !container) {
        console.error('Album cover elements not found');
        return;
    }

    // Mouse events
    container.addEventListener('mousedown', startDragging);
    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', endDragging);
    container.addEventListener('mouseleave', endDragging);

    // Touch events for mobile
    container.addEventListener('touchstart', startDragging, { passive: false });
    window.addEventListener('touchmove', drag, { passive: false });
    window.addEventListener('touchend', endDragging);
}

function startDragging(e) {
    if (isUnlocked) return;
    
    isDragging = true;
    const albumCover = document.getElementById('albumCover');
    if (!albumCover) return;
    
    albumCover.classList.add('dragging');
    
    // Get starting position
    startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    currentX = startX;
    
    // Prevent default to avoid text selection
    e.preventDefault();
}

function drag(e) {
    if (!isDragging) return;
    
    const albumCover = document.getElementById('albumCover');
    if (!albumCover) return;
    
    // Get current position
    currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    
    // Calculate drag distance with increased sensitivity
    const dragDistance = (currentX - startX) * dragSensitivity;
    
    // Apply rotation based on drag distance
    const rotation = Math.min(Math.max(dragDistance / 2, 0), dragThreshold);
    albumCover.style.transform = `rotateY(${rotation}deg)`;
    
    // Prevent default to avoid scrolling
    e.preventDefault();
}

function endDragging() {
    if (!isDragging) return;
    
    isDragging = false;
    const albumCover = document.getElementById('albumCover');
    if (!albumCover) return;
    
    albumCover.classList.remove('dragging');
    
    // Calculate final drag distance with sensitivity applied
    const dragDistance = (currentX - startX) * dragSensitivity;
    
    // If dragged far enough, unlock; otherwise, reset position
    if (dragDistance >= dragThreshold) {
        unlockPlayer();
    } else {
        albumCover.style.transform = 'rotateY(0deg)';
    }
}

// Unlock animation
function unlockPlayer() {
    if (!isUnlocked) {
        isUnlocked = true;
        
        // Add blurred class to body
        document.body.classList.add('blurred');
        
        // Add unlocked class to album cover
        albumCover.classList.add('unlocked');
        
        // Add unlocked class to container
        document.querySelector('.album-cover-container').classList.add('unlocked');
        
        // Play unlock sound
        const unlockSound = new Audio('./audio/unlock.mp3');
        unlockSound.volume = 0.3;
        unlockSound.play();
        
        // Show player container
        setTimeout(() => {
            playerContainer.classList.add('visible');
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
    
    // Update background with the album cover
    document.querySelector('.app-container').style.setProperty('--background-image', `url('/assets/bully.webp')`);
    
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
    // Update icon to show active state
    shuffleBtn.innerHTML = isShuffled ? 
        '<svg class="icon" viewBox="0 0 24 24"><path d="M10.59 9.17L5.41 4L4 5.41l5.17 5.17L10.59 9.17zM14.5 4l2.04 2.04L4 18.59 5.41 20L17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41-1.41 3.13-3.13L14 5.41l5.5 5.5-3.67 3.5z"/></svg>' :
        '<svg class="icon" viewBox="0 0 24 24"><path d="M10.59 9.17L5.41 4L4 5.41l5.17 5.17L10.59 9.17zM14.5 4l2.04 2.04L4 18.59 5.41 20L17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41-1.41 3.13-3.13L14 5.41l5.5 5.5-3.67 3.5z"/></svg>';
});

repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active');
    // Update icon to show active state
    repeatBtn.innerHTML = isRepeat ? 
        '<svg class="icon" viewBox="0 0 24 24"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>' :
        '<svg class="icon" viewBox="0 0 24 24"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>';
});

// Set up collapsible playlist on mobile
function setupCollapsiblePlaylist() {
    const playlistHeader = document.getElementById('playlistHeader');
    if (playlistHeader) {
        playlistHeader.addEventListener('click', () => {
            playlistHeader.classList.toggle('collapsed');
            trackList.classList.toggle('collapsed');
        });
    }
}

// Initialize the player
init(); 
