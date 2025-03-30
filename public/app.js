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
        title: "Mind Forward",
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
        title: "Beauty And The Beast",
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
        title: "Highs And Lows",
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
        cover: "/assets/cover1.jpg"
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
let dragThreshold = 150; // pixels to drag before unlock

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

    // Set up drag to unlock
    setupDragToUnlock();
}

// Drag to unlock functionality
function setupDragToUnlock() {
    albumCover.addEventListener('mousedown', startDragging);
    albumCover.addEventListener('mousemove', drag);
    albumCover.addEventListener('mouseup', endDragging);
    albumCover.addEventListener('mouseleave', endDragging);

    // Touch events for mobile
    albumCover.addEventListener('touchstart', startDragging);
    albumCover.addEventListener('touchmove', drag);
    albumCover.addEventListener('touchend', endDragging);
}

function startDragging(e) {
    if (isUnlocked) return;
    
    isDragging = true;
    albumCover.classList.add('dragging');
    
    // Get starting position
    startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    currentX = startX;
    
    // Prevent default to avoid text selection
    e.preventDefault();
}

function drag(e) {
    if (!isDragging) return;
    
    // Get current position
    currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    
    // Calculate drag distance
    const dragDistance = currentX - startX;
    
    // Apply rotation based on drag distance
    const rotation = Math.min(Math.max(dragDistance / 2, 0), dragThreshold);
    albumCover.style.transform = `rotateY(${rotation}deg)`;
}

function endDragging() {
    if (!isDragging) return;
    
    isDragging = false;
    albumCover.classList.remove('dragging');
    
    // Calculate final drag distance
    const dragDistance = currentX - startX;
    
    // If dragged far enough, unlock
    if (dragDistance >= dragThreshold) {
        unlockPlayer();
    } else {
        // Reset position if not dragged far enough
        albumCover.style.transform = 'rotateY(0deg)';
    }
}

// Unlock animation
function unlockPlayer() {
    if (!isUnlocked) {
        isUnlocked = true;
        albumCover.classList.add('unlocked');
        
        // Play unlock sound
        const unlockSound = new Audio('/audio/unlock.mp3');
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

// Initialize the player
init(); 