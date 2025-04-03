import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger, OnModuleInit } from '@nestjs/common';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  Message,
} from './socket.interface';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class SocketGateway implements OnModuleInit {
  @WebSocketServer() server: Server = new Server<
    ServerToClientEvents,
    ClientToServerEvents
  >();
  private logger = new Logger('SocketGateway');
  onModuleInit() {
    Socket.setMaxListeners(100);
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  sendFromServerToClient(
    data: any,
    topic: 'chat' | 'notif' | 'refetech' | 'isOnline',
  ) {
    this.server.emit(topic, data);
  }

  @SubscribeMessage('chat')
  async handleEvent(
    @MessageBody()
    payload: Message,
  ): Promise<Message> {
    console.log('testtt', payload); // todo handle
    this.logger.log(payload);
    this.server.emit('chat', payload); // broadcast messages
    return payload;
  }
}
