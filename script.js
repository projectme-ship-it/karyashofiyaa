const questions = [
  {
    q: "Akhir-akhir ini, hati kamu lagi gimana?",
    a: ["Lagi cukup bahagia dan tenang 🌷", "Biasa aja, kadang naik kadang turun", "Lagi banyak pikiran nih", "Jujur, agak berat belakangan ini"]
  },
  {
    q: "Kalau malam tiba dan kamu punya waktu sendiri, biasanya kamu merasa...",
    a: ["Tenang, bisa menikmati waktu sendiri", "Mulai kepikiran banyak hal", "Kadang merasa sepi", "Capek dan pengin istirahat dari semuanya"]
  },
  {
    q: "Ada nggak hal yang belakangan ini sering kamu pendam?",
    a: ["Nggak terlalu, aku cukup terbuka", "Ada, tapi masih bisa aku atasi", "Ada beberapa hal yang belum berani aku ceritakan", "Banyak, dan aku bingung mulai cerita dari mana"]
  },
  {
    q: "Kalau lagi sedih atau kecewa, kamu biasanya...",
    a: ["Cerita ke orang yang aku percaya", "Menenangkan diri dulu", "Memilih diam dan memendamnya", "Belum tahu harus bagaimana"]
  },
  {
    q: "Akhir-akhir ini, kamu merasa punya seseorang yang benar-benar mendengarkanmu?",
    a: ["Iya, alhamdulillah ada", "Ada, tapi nggak selalu bisa cerita", "Belum terlalu merasa begitu", "Aku masih mencari tempat cerita yang nyaman"]
  },
  {
    q: "Gimana hubungan kamu dengan diri sendiri akhir-akhir ini?",
    a: ["Lagi belajar menyayangi dan menerima diri", "Kadang bangga, kadang suka menyalahkan diri", "Sering lupa memperhatikan kebutuhan diri", "Lagi berusaha memahami diri sendiri"]
  },
  {
    q: "Kalau bicara soal ibadah dan hubunganmu dengan Allah, kamu merasa...",
    a: ["Alhamdulillah, cukup terjaga", "Kadang semangat, kadang kendor", "Lagi ingin memperbaiki dan mendekat lagi", "Sedang butuh diingatkan dan dikuatkan"]
  },
  {
    q: "Apa yang paling sering bikin kamu kepikiran belakangan ini?",
    a: ["Kuliah, pekerjaan, atau tanggung jawab", "Keluarga dan orang-orang terdekat", "Masa depan dan hal yang belum pasti", "Perasaan sendiri yang susah dijelaskan"]
  },
  {
    q: "Kalau boleh memilih satu hal yang kamu butuhkan sekarang, apa itu?",
    a: ["Waktu istirahat dan suasana tenang", "Teman ngobrol yang mau mendengarkan", "Semangat untuk mulai lagi", "Pelukan hangat dan doa baik"]
  },
  {
    q: "Satu kata yang paling menggambarkan harapanmu saat ini?",
    a: ["Lega", "Bahagia", "Kuat", "Tenang dan lebih dekat dengan Allah"]
  }
];

const $ = (id) => document.getElementById(id);
let visitor = "";
let current = 0;
let answers = Array(questions.length).fill(null);

// Efek klik dibuat langsung oleh browser (tanpa file audio tambahan).
let clickAudioContext = null;
function playClickSound(kind = "tap") {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    clickAudioContext ||= new AudioContextClass();
    if (clickAudioContext.state === "suspended") clickAudioContext.resume();
    const now = clickAudioContext.currentTime;
    const oscillator = clickAudioContext.createOscillator();
    const gain = clickAudioContext.createGain();
    const isNext = kind === "next";
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(isNext ? 660 : 520, now);
    oscillator.frequency.exponentialRampToValueAtTime(isNext ? 880 : 690, now + 0.075);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.055, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);
    oscillator.connect(gain);
    gain.connect(clickAudioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.14);
  } catch (error) { /* Suara opsional; fungsi utama website tetap berjalan. */ }
}

// Suara halus untuk tombol statis; tombol jawaban ditangani saat dibuat.
document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || button.disabled || button.id === "musicButton") return;
  const kind = button.id === "nextButton" ? "next" : "tap";
  playClickSound(kind);
});

const welcomeCard = $("welcomeCard");
const questionCard = $("questionCard");
const resultCard = $("resultCard");

$("nameForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = $("visitorName").value.trim();
  if (!name) return;
  visitor = name;
  welcomeCard.classList.add("hidden");
  questionCard.classList.remove("hidden");
  renderQuestion();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function renderQuestion() {
  const item = questions[current];
  $("questionNumber").textContent = `PERTANYAAN ${current + 1} DARI ${questions.length}`;
  $("progressBar").style.width = `${((current + 1) / questions.length) * 100}%`;
  $("questionTitle").textContent = item.q;
  $("answerList").innerHTML = "";
  item.a.forEach((answer, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer" + (answers[current] === index ? " selected" : "");
    button.textContent = answer;
    button.setAttribute("aria-pressed", answers[current] === index ? "true" : "false");
    button.addEventListener("click", () => {
      answers[current] = index;
      renderQuestion();
    });
    $("answerList").appendChild(button);
  });
  $("prevButton").classList.toggle("hidden", current === 0);
  $("nextButton").disabled = answers[current] === null;
  $("nextButton").textContent = current === questions.length - 1 ? "Lihat hasilku ♡" : "Berikutnya →";
}

$("prevButton").addEventListener("click", () => {
  if (current > 0) { current--; renderQuestion(); }
});
$("nextButton").addEventListener("click", () => {
  if (answers[current] === null) return;
  if (current < questions.length - 1) {
    current++;
    renderQuestion();
  } else {
    showResult();
  }
});

function makeScore(label, value) {
  const row = document.createElement("div");
  row.className = "score";
  const meta = document.createElement("div");
  meta.className = "score-label";
  const title = document.createElement("span");
  title.textContent = label;
  const number = document.createElement("strong");
  number.textContent = `${value}%`;
  meta.append(title, number);
  const track = document.createElement("div");
  track.className = "score-track";
  const fill = document.createElement("div");
  fill.className = "score-fill";
  fill.style.width = `${value}%`;
  track.appendChild(fill);
  row.append(meta, track);
  return row;
}

function showResult() {
  questionCard.classList.add("hidden");
  resultCard.classList.remove("hidden");
  $("resultHeading").textContent = `Oke, ${visitor}... 🤎`;
  $("resultIntro").textContent = "Makasih ya sudah meluangkan waktu untuk ngobrol sebentar dengan Shofiyaa.";

  // Skor ini adalah ringkasan refleksi sederhana dari pilihan, bukan pengukuran psikologis.
  const scores = [
    ["Suasana hati", scoreFrom([0, 1, 2, 3], [100, 78, 55, 35])],
    ["Ruang bercerita", scoreFrom([0, 1, 2, 3, 4], [100, 78, 55, 35, 20])],
    ["Merawat diri", scoreFrom([0, 1, 2, 3, 5], [90, 72, 45, 65, 78])],
    ["Harapan & ketenangan", scoreFrom([0, 1, 2, 3, 6, 9], [75, 85, 88, 80, 92, 100])]
  ];
  $("scores").innerHTML = "";
  scores.forEach(([label, value]) => $("scores").appendChild(makeScore(label, value)));

  const lastAnswer = questions[9].a[answers[9]];
  const moodAnswer = questions[0].a[answers[0]];
  const supportAnswer = questions[8].a[answers[8]];
  $("reflectionText").textContent =
    `${visitor}, kamu itu berharga, bahkan di hari-hari ketika kamu merasa belum melakukan banyak hal. ` +
    `Dari jawabanmu, kamu menggambarkan keadaan hati seperti ini: “${moodAnswer}”. ` +
    `Saat ini, kamu juga sedang berharap pada ${lastAnswer.toLowerCase()}. ` +
    `Jangan terlalu keras pada dirimu sendiri. Pelan-pelan saja, ya. Semoga Allah mudahkan urusanmu, ` +
    `lapangkan hatimu, dan tuntun setiap langkahmu. Aamiin. 🌷`;
  $("closingText").textContent =
    `Semoga kamu selalu diberi kekuatan, ketenangan, dan hati yang lapang. ` +
    `Kamu juga berhak mendapatkan ${supportAnswer.toLowerCase()}. Allah tahu setiap hal yang sedang kamu usahakan, ` +
    `bahkan yang belum sempat kamu ceritakan. Jangan lupa berbaik hati pada dirimu sendiri, yaa.`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function scoreFrom(indices, values) {
  let total = 0;
  let count = 0;
  indices.forEach((questionIndex, i) => {
    if (answers[questionIndex] !== null) {
      total += values[Math.min(answers[questionIndex], values.length - 1)];
      count++;
    }
  });
  return Math.round(total / Math.max(count, 1));
}

$("whatsappButton").addEventListener("click", () => {
  const lines = [
    `Hai Shofiyaa! Ini hasil little talk dari ${visitor} ♡`,
    "",
    ...questions.map((item, i) => `${i + 1}. ${item.q}\n${item.a[answers[i]]}`),
    "",
    "Terima kasih sudah membuat ruang kecil yang hangat ini. 🌷"
  ];
  const url = `https://wa.me/?text=${encodeURIComponent(lines.join("\n\n"))}`;
  window.open(url, "_blank", "noopener,noreferrer");
});

$("restartButton").addEventListener("click", () => {
  current = 0;
  answers = Array(questions.length).fill(null);
  resultCard.classList.add("hidden");
  welcomeCard.classList.remove("hidden");
  $("visitorName").value = visitor;
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const music = $("backgroundMusic");
$("musicButton").addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      $("musicButton").textContent = "♫ Jeda musik";
    } catch (error) {
      $("musicButton").textContent = "Tambahkan background.mp3";
      alert("Tambahkan file musik bernama background.mp3 ke folder assets/music terlebih dahulu.");
    }
  } else {
    music.pause();
    $("musicButton").textContent = "♫ Musik";
  }
});

const songs = [
    {
        title: "Arussatun Nur",
        artist: "Muhammad Al Muqit",
        src: "assets/music/Arussatun%20Nur.mp3",
        cover: "🌷"
    },
    {
        title: "Bi Saraha",
        artist: "Abeer Nehme",
        src: "assets/music/Bi%20Saraha.mp3",
        cover: "💗"
    },
    {
        title: "Khoirud Duror",
        artist: "Muhammad Al Muqit",
        src: "assets/music/Khoirud%20Duror.mp3",
        cover: "🌸"
    }
];

// ===== FUNGSI CUSTOM MUSIC PLAYER =====

const audio = document.getElementById("audioPlayer");

const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");

const title = document.getElementById("musicTitle");
const artist = document.getElementById("musicArtist");
const cover = document.getElementById("musicCover");

const progress = document.getElementById("progressBar");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

const volume = document.getElementById("volumeBar");

const playlistItems = document.getElementById("playlistItems");
const playlistToggle = document.getElementById("playlistToggle");
const playlist = document.getElementById("musicPlaylist");

let currentSong = 0;
let isShuffle = false;
let isRepeat = false;

// Memuat lagu
function loadSong(index) {
    currentSong = index;

    const song = songs[currentSong];

    audio.src = song.src;
    title.textContent = song.title;
    artist.textContent = song.artist;
    cover.textContent = song.cover;

    renderPlaylist();
}

// Memutar lagu
function playSong() {
    audio.play()
        .then(() => {
            playBtn.textContent = "❚❚";
        })
        .catch(() => {
            alert("Lagu gagal diputar. Periksa file MP3.");
        });
}

// Menjeda lagu
function pauseSong() {
    audio.pause();
    playBtn.textContent = "▶";
}

playBtn.addEventListener("click", () => {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
});

// Lagu berikutnya
function nextSong() {
    if (isShuffle && songs.length > 1) {
        let next;

        do {
            next = Math.floor(Math.random() * songs.length);
        } while (next === currentSong);

        loadSong(next);
    } else {
        loadSong((currentSong + 1) % songs.length);
    }

    playSong();
}

// Lagu sebelumnya
function previousSong() {
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
    }

    loadSong((currentSong - 1 + songs.length) % songs.length);
    playSong();
}

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", previousSong);

// Shuffle
shuffleBtn.addEventListener("click", () => {
    isShuffle = !isShuffle;

    shuffleBtn.style.color =
        isShuffle ? "#d16d80" : "";
});

// Repeat
repeatBtn.addEventListener("click", () => {
    isRepeat = !isRepeat;

    repeatBtn.style.color =
        isRepeat ? "#d16d80" : "";
});

// Lagu selesai
audio.addEventListener("ended", () => {
    if (isRepeat) {
        audio.currentTime = 0;
        playSong();
    } else {
        nextSong();
    }
});

// Progress lagu
audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;

    progress.value =
        (audio.currentTime / audio.duration) * 100;

    currentTime.textContent =
        formatTime(audio.currentTime);

    duration.textContent =
        formatTime(audio.duration);
});

// Mengatur posisi lagu
progress.addEventListener("input", () => {
    if (audio.duration) {
        audio.currentTime =
            (progress.value / 100) * audio.duration;
    }
});

// Mengatur volume
volume.addEventListener("input", () => {
    audio.volume = volume.value;
});

// Format waktu
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);

    return `${min}:${sec.toString().padStart(2, "0")}`;
}

// Membuka playlist
playlistToggle.addEventListener("click", () => {
    playlist.classList.toggle("active");
});

// Menampilkan daftar lagu
function renderPlaylist() {
    playlistItems.innerHTML = "";

    songs.forEach((song, index) => {
        const item = document.createElement("div");

        item.className = "playlist-item";

        if (index === currentSong) {
            item.classList.add("active");
        }

        item.textContent =
            `${song.cover} ${song.title}`;

        item.addEventListener("click", () => {
            loadSong(index);
            playSong();
        });

        playlistItems.appendChild(item);
    });
}

// Inisialisasi
audio.volume = 0.7;
loadSong(0);
