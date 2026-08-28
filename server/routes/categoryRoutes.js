const express = require('express');
const router = express.Router();
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { authenticate, requireRole } = require('../middleware/authMiddleware');

const categories = [
  { id: 'cat-1', name: 'Electrician', icon: 'Zap', description: 'Wiring, appliances, breaker boxes, fans, and lighting', status: 'approved', popular: true },
  { id: 'cat-2', name: 'Plumber', icon: 'Wrench', description: 'Pipes, leak repairs, taps, drainage, and water heaters', status: 'approved', popular: true },
  { id: 'cat-3', name: 'Carpenter', icon: 'Hammer', description: 'Furniture repair, doors, cabinets, and custom woodwork', status: 'approved', popular: true },
  { id: 'cat-4', name: 'Painter', icon: 'Paintbrush', description: 'Interior/exterior wall painting, waterproofing, and polish', status: 'approved', popular: true },
  { id: 'cat-5', name: 'Domestic Help', icon: 'Home', description: 'House cleaning, cooking, laundry, and daily chores', status: 'approved', popular: false },
  { id: 'cat-6', name: 'Caregiver', icon: 'Heart', description: 'Elderly care, patient assistance, and nursing support', status: 'approved', popular: false },
  { id: 'cat-7', name: 'Driver', icon: 'Car', description: 'Personal drivers, commercial vehicle handling, and trips', status: 'approved', popular: false },
  { id: 'cat-8', name: 'Gardener', icon: 'Flower2', description: 'Lawn maintenance, plant care, and garden design', status: 'approved', popular: false }
];

// Keyword mappings for AI free-text classification
const categoryKeywords = {
  'Electrician': ['fan', 'wire', 'wiring', 'light', 'short circuit', 'switch', 'socket', 'fuse', 'breaker', 'ac', 'voltage', 'spark'],
  'Plumber': ['leak', 'pipe', 'tap', 'sink', 'drain', 'water', 'toilet', 'flush', 'shower', 'geyser', 'sewage'],
  'Carpenter': ['door', 'lock', 'window', 'table', 'chair', 'bed', 'cabinet', 'wood', 'furniture', 'hinge'],
  'Painter': ['paint', 'color', 'wall', 'waterproof', 'dampness', 'stain', 'polish'],
  'Domestic Help': ['clean', 'dusting', 'sweep', 'mop', 'maid', 'chores', 'laundry'],
  'Caregiver': ['elderly', 'patient', 'nurse', 'medicine', 'care'],
  'Driver': ['drive', 'car', 'vehicle', 'chauffeur', 'outstation'],
  'Gardener': ['garden', 'lawn', 'plant', 'grass', 'pot', 'pruning']
};

// GET /api/categories - Fetch all approved categories
router.get('/', (req, res) => {
  const approved = categories.filter(c => c.status === 'approved');
  return sendSuccess(res, { categories: approved, total: approved.length }, 'Service categories loaded.');
});

// GET /api/categories/pending - Admin approval queue for worker-submitted skills
router.get('/pending', authenticate, requireRole('Admin'), (req, res) => {
  const pending = categories.filter(c => c.status === 'pending_review');
  return sendSuccess(res, { pendingCategories: pending }, 'Pending categories fetched.');
});

// POST /api/categories/ai-classify - AI Free-text category classification router
router.post('/ai-classify', (req, res) => {
  const { query } = req.body;
  if (!query || typeof query !== 'string') {
    return sendError(res, 'A text query is required for classification.', 400);
  }

  const q = query.toLowerCase();
  let bestMatch = null;
  let highestScore = 0;

  for (const [catName, keywords] of Object.entries(categoryKeywords)) {
    let score = 0;
    for (const kw of keywords) {
      if (q.includes(kw)) {
        score += 1;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = categories.find(c => c.name === catName);
    }
  }

  if (bestMatch && highestScore > 0) {
    return sendSuccess(res, {
      matched: true,
      confidence: highestScore >= 2 ? 'HIGH' : 'MEDIUM',
      category: bestMatch
    }, `Classified to ${bestMatch.name}`);
  }

  return sendSuccess(res, {
    matched: false,
    confidence: 'LOW',
    suggestedCategories: categories.slice(0, 4)
  }, 'No exact trade match found. Please select from the category grid.');
});

// POST /api/categories - Worker submits new skill/category
router.post('/', authenticate, (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return sendError(res, 'Skill/Category name is required.', 400);
  }

  const newCat = {
    id: `cat-${Date.now()}`,
    name,
    icon: 'Sparkles',
    description: description || 'User-submitted specialized trade category',
    status: 'pending_review',
    createdBy: req.user.id,
    createdAt: new Date().toISOString()
  };

  categories.push(newCat);

  return sendSuccess(res, { category: newCat }, 'Skill submitted for admin approval.', 201);
});

// PATCH /api/categories/:id/approve - Admin approves skill category
router.patch('/:id/approve', authenticate, requireRole('Admin'), (req, res) => {
  const cat = categories.find(c => c.id === req.params.id);
  if (!cat) {
    return sendError(res, 'Category not found.', 404);
  }

  cat.status = 'approved';

  // Add to AI keyword routing automatically
  if (!categoryKeywords[cat.name]) {
    categoryKeywords[cat.name] = cat.name.toLowerCase().split(' ');
  }

  return sendSuccess(res, { category: cat }, `Category '${cat.name}' approved and live.`);
});

module.exports = router;
