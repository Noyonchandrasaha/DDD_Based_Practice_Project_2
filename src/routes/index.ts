// ============================================================================
// FILE: src/routes/index.ts
// ============================================================================

import { Router } from 'express';
import { V1Routes } from './v1';


export class AppRoutes {
  public router: Router;
  constructor(private v1Routes: V1Routes) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.use('/api/v1', this.v1Routes.router);
    
  }
}