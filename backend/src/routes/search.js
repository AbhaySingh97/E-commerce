import { Router } from 'express';
import * as searchController from '../controllers/searchController.js';

const router = Router();

router.get('/', searchController.searchProducts);
router.get('/autocomplete', searchController.autocomplete);
router.get('/trending', searchController.getTrendingSearches);

export default router;
