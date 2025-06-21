import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DashboardService } from './dashboard.service';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { JwtRequestUser } from 'src/common/interfaces/jwt-request-user';

@UseGuards(AuthGuard('jwt'))
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getDashboard(@GetUser() user: JwtRequestUser) {
    return this.dashboardService.getDashboardStats(user.id);
  }
}
