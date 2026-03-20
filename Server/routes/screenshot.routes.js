import express from 'express';
import Screenshot from '../models/Screenshot.model.js';

const router = express.Router();

router.post('/screenshot', async (req, res) => {
  try {
    // payload may come from electron tracker or other source
    const { hostname, imageUrl, image } = req.body;
    const finalImageUrl = imageUrl || image;

    console.log('▶ Screenshot upload:', {
      hostname,
      hasImageUrl: !!imageUrl,
      hasImage: !!image,
    });
    
    const screenshot = new Screenshot({
      hostname,
      imageUrl: finalImageUrl,
      timestamp: new Date()
    });
    
    await screenshot.save();
    res.status(201).json(screenshot);
  } catch (error) {
    console.error('Screenshot save error:', error);
    res.status(500).json({ message: 'Failed to save screenshot' });
  }
});

router.get('/screenshots', async (req, res) => {
  try {
    const { limit = 100 } = req.query;
    const screenshots = await Screenshot.find()
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));
    res.json(screenshots);
  } catch (error) {
    console.error('Screenshot fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch screenshots' });
  }
});

router.get('/screenshots/:hostname', async (req, res) => {
  try {
    const { hostname } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const screenshots = await Screenshot.find({ hostname })
      .sort({ timestamp: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    const total = await Screenshot.countDocuments({ hostname });

    res.json({ screenshots, total });
  } catch (error) {
    console.error('Screenshot fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch screenshots' });
  }
});

export default router;
