import express from 'express';
import {
  getAllSongs,
  playSong,
  playNextSong,
  playPreviousSong,
  getSongImage
} from '../controller/songController.js';

const router = express.Router();

// Route untuk mendapatkan semua lagu
router.get('/songs', getAllSongs);

// Route untuk memutar lagu berdasarkan indeks
router.post('/play/:index', playSong);

// Route untuk memainkan lagu berikutnya
router.post('/next', playNextSong);

// Route untuk memainkan lagu sebelumnya
router.post('/previous', playPreviousSong);

// Route untuk mendapatkan gambar lagu berdasarkan indeks
router.get('/image/:index', getSongImage);

export default router;
