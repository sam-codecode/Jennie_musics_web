const tracks = [
    {
        title: "SOLO",
        artist: "Jennie · 2018",
        duration: "2:50",
        cover: "https://images.genius.com/91947ffa1324a44c8a001b98e452c613.1000x1000x1.png",
        src: "https://dn721809.ca.archive.org/0/items/jennie-solo/JENNIE%20-%20SOLO.mp3"
    },
    {
        title: "You & Me",
        artist: "Jennie · 2023",
        duration: "2:58",
        cover: "https://www.billboard.com/wp-content/uploads/2023/10/Jennie-cr-YG-Entertainment-press-2023-billboard-1548.jpg",
        src: "songs/you_and_me.mp3"
    },
    {
        title: "Mantra",
        artist: "Jennie · 2024",
        duration: "2:17",
        cover: "https://cdn.k-ennews.com/news/photo/202410/4384_11971_4641.jpg",
        src: "songs/mantra.mp3"
    },
    {
        title: "Like Jennie",
        artist: "Jennie · 2025",
        duration: "2:04",
        cover: "https://sm.mashable.com/t/mashable_me/photo/default/untitled-2025-04-09t183338787_qmzb.1248.jpg",
        src: "songs/like_jennie.mp3"
    },
    {
        title: "ExtraL",
        artist: "Jennie · 2025",
        duration: "2:48",
        cover: "https://linkstorage.linkfire.com/medialinks/images/32a4c344-1377-41f1-b66f-2e27e611b4f4/artwork-440x440.jpg",
        src: "songs/extraL.mp3"
    },
        {
        title: "ZEN",
        artist: "Jennie · 2025",
        duration: "3:22",
        cover: "https://i0.wp.com/kstationtv.com/wp-content/uploads/2025/01/JENNIE-3.jpg?fit=647%2C366&ssl=1",
        src: "songs/zen.mp3"
    },
            {
        title: "Like Jennie (MMA)",
        artist: "Jennie · 2025",
        duration: "3:04",
        cover: "https://wimg.heraldcorp.com/news/cms/2025/12/22/news-p.v1.20251222.511ed2bc20f74c96a260befb3d9a6637_P1.jpg",
        src: "songs/like_jennie_mma.mp3"
    }
];
let currentIndex = 0;
let isPlaying = false;

const audio = document.getElementById('audioPlayer');
const mainAlbum = document.getElementById('mainAlbum');
const mainTitle = document.getElementById('mainTitle');
const mainArtist = document.getElementById('mainArtist');
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const progressFill = document.getElementById('progressFill');
const progressBg = document.getElementById('progressBg');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const playlistList = document.getElementById('playlistList');

function formatTime(s) {
    if (isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
}

function loadTrack(index) {
    const t = tracks[index];
mainAlbum.src = t.cover;
    mainTitle.textContent = t.title;
    mainArtist.textContent = t.artist;
    audio.src = t.src;
    progressFill.style.width = '0%';
    currentTimeEl.textContent = '0:00';
    totalTimeEl.textContent = t.duration;
    updatePlaylistHighlight();
}

function updatePlaylistHighlight() {
    document.querySelectorAll('.playlist-item').forEach((el, i) => {
        el.classList.toggle('active', i === currentIndex);
        const thumb = el.querySelector('.playlist-thumb');
        const indicator = el.querySelector('.playing-indicator');
        if (i === currentIndex) {
            thumb.classList.toggle('spinning', isPlaying);
            indicator.classList.toggle('paused', !isPlaying);
        } else {
            thumb.classList.remove('spinning');
        }
    });
    mainAlbum.classList.toggle('playing', isPlaying);
}

function setPlayState(playing) {
    isPlaying = playing;
    playIcon.style.display = playing ? 'none' : 'block';
    pauseIcon.style.display = playing ? 'block' : 'none';
    updatePlaylistHighlight();
}

playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        setPlayState(false);
    } else {
        audio.play().catch(() => {});
        setPlayState(true);
    }
});

document.getElementById('rewindBtn').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentIndex);
    if (isPlaying) audio.play().catch(() => {});
});

document.getElementById('forwardBtn').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % tracks.length;
    loadTrack(currentIndex);
    if (isPlaying) audio.play().catch(() => {});
});

audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = pct + '%';
    currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('ended', () => {
    currentIndex = (currentIndex + 1) % tracks.length;
    loadTrack(currentIndex);
    audio.play().catch(() => {});
});

progressBg.addEventListener('click', (e) => {
    const rect = progressBg.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
});

// Build playlist
tracks.forEach((t, i) => {
    const li = document.createElement('li');
    li.className = 'playlist-item' + (i === 0 ? ' active' : '');
    li.innerHTML = `
        <img class="playlist-thumb" src="${t.cover}" alt="${t.title}">
        <div class="playlist-track-info">
            <p class="playlist-track-name">${t.title}</p>
            <p class="playlist-track-sub">${t.artist}</p>
        </div>
        <div class="playing-indicator${i === 0 ? ' paused' : ''}">
            <span></span><span></span><span></span>
        </div>
        <span class="playlist-duration">${t.duration}</span>
    `;
    li.addEventListener('click', () => {
        currentIndex = i;
        loadTrack(i);
        audio.play().catch(() => {});
        setPlayState(true);
    });
    playlistList.appendChild(li);
});


loadTrack(0);

