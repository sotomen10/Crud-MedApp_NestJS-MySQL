import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }


  notifyAll(event: string, message: any) {
    this.server.emit(event, message); 
  }


  notifyUserAction(action: string, message: string, data: any) {
    this.notifyAll('notification', {
      action,
      message,
      data
    });
  }

  @SubscribeMessage('createUser')
  handleCreateUser(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log('Usuario creado:', data);

    this.notifyAll('userCreated', { message: 'Nuevo usuario creado con éxito', user: data });
  }
}
