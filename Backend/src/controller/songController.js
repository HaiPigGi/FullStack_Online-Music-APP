import path from 'path';
import fs from 'fs';
import Song from '../model/song.js'; // Import model Song dari file yang sesuai
import speaker from 'speaker';
// Inisialisasi variabel untuk menyimpan daftar lagu
let songs = [];
let currentSongIndex = -1;

// Fungsi untuk mendapatkan daftar lagu dari local
export const getAllSongs = async (req, res) => {
  try {
    const musicDirectory = './public/music';

    fs.readdir(musicDirectory, async (err, files) => {
      if (err) {
        return res.status(500).json({ message: 'Error reading music directory' });
      }

      const allowedExtensions = ['.mp3', '.wav'];
      const musicFiles = files.filter(file => allowedExtensions.includes(path.extname(file)));

      // Simpan daftar lagu ke dalam variabel songs
      songs = musicFiles.map(file => ({
        title: path.basename(file, path.extname(file)),
        filename: file,
      }));

      // Simpan daftar lagu ke dalam database (tambahkan baris ini)
      await fetchAndSaveSongsFromLocal(songs);

      res.json(songs);
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Fungsi untuk mengisi data lagu ke dalam database
export const fetchAndSaveSongsFromLocal = async (songs) => {
  try {
    // Loop melalui daftar lagu dan simpan ke dalam database
    for (const song of songs) {
      await Song.create({
        title: song.title,
        artist: 'Unknown Artist', // Anda dapat mengubah ini sesuai kebutuhan
        // Tambahkan atribut lain yang dibutuhkan
      });
    }
    console.log(`${songs.length} songs saved to the database.`);
  } catch (error) {
    console.error('Error fetching and saving songs:', error);
  }
};

// Fungsi untuk memutar lagu
export const playSong = (req, res) => {
  const songIndex = parseInt(req.params.index);
  if (songIndex >= 0 && songIndex < songs.length) {
    currentSongIndex = songIndex;
    
    // Ganti dengan kode untuk memutar lagu sesuai platform Anda menggunakan 'node-speaker'
    const song = songs[currentSongIndex];
    const songPath = `./public/music/${song.filename}`;
    const speakerInstance = new speaker();

    fs.createReadStream(songPath).pipe(speakerInstance);

    res.json({ message: 'Song is playing' });
  } else {
    res.status(400).json({ message: 'Invalid song index' });
  }
};

// Fungsi untuk memainkan lagu berikutnya
export const playNextSong = (req, res) => {
  if (currentSongIndex < songs.length - 1) {
    currentSongIndex++;

    // Ganti dengan kode untuk memutar lagu berikutnya sesuai platform Anda menggunakan 'node-speaker'
    const nextSong = songs[currentSongIndex];
    const songPath = `./public/music/${nextSong.filename}`;
    const speakerInstance = new speaker();

    fs.createReadStream(songPath).pipe(speakerInstance);

    res.json({ message: 'Playing next song' });
  } else {
    res.status(400).json({ message: 'No more songs to play' });
  }
};


// Fungsi untuk memainkan lagu sebelumnya
export const playPreviousSong = (req, res) => {
  if (currentSongIndex > 0) {
    currentSongIndex--;

    // Ganti dengan kode untuk memutar lagu sebelumnya sesuai platform Anda menggunakan 'node-speaker'
    const previousSong = songs[currentSongIndex];
    const songPath = `./public/music/${previousSong.filename}`;
    const speakerInstance = new speaker();

    fs.createReadStream(songPath).pipe(speakerInstance);

    res.json({ message: 'Playing previous song' });
  } else {
    res.status(400).json({ message: 'No previous songs' });
  }
};

// Fungsi untuk mendapatkan gambar lagu jika ada
export const getSongImage = (req, res) => {
  const songIndex = parseInt(req.params.index);
  if (songIndex >= 0 && songIndex < songs.length) {
    const song = songs[songIndex];
    // Ubahlah direktori sesuai dengan direktori gambar lagu di komputer Anda
    const imagePath = path.join('./public/music', `${song.title}.jpg`);
    // Baca file gambar dan kirimkan sebagai respons
    fs.readFile(imagePath, (err, image) => {
      if (err) {
        return res.status(500).json({ message: 'Error reading image file' });
      }
      res.contentType('image/jpeg').send(image);
    });
  } else {
    res.status(400).json({ message: 'Invalid song index' });
  }
};
