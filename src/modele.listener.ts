import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserService } from './user/user.service';
@Injectable()
export class ListenerOnModele implements OnModuleInit {
  constructor(private readonly UserService: UserService) {}
  onModuleInit() {
    this.UserService.startWatching();
  }
}
