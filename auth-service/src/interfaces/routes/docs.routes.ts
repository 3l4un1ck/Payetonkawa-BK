import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import redoc from 'redoc-express';
import {specs} from "../../infrastructure/swagger/swagger.config";

const router = Router();

// Swagger UI
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(specs, { explorer: true }));

// Redoc
router.get('/api-docs.json', (req, res) => {
  res.json(specs);
});
router.get(
  '/redoc',
  redoc({
    title: 'API Documentation',
    specUrl: '/api-docs.json',
  })
);

export default router;