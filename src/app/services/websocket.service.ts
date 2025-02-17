import { Injectable } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { Observable } from 'rxjs';
import {environment} from "../../environment";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  public socket$
  public webSocket$

  constructor() {
    const url = environment.URI_WSS + localStorage.getItem('token');
    this.socket$ = webSocket(url);
    this.webSocket$ = this.socket$.asObservable();
  }

  subscribe() {



//     const socket = new WebSocket('wss://ws.finnhub.io?token='+ environmentsFinhub.apiKey);
//
// // Connection opened -> Subscribe
//     socket.addEventListener('open', function (event) {
//       socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'AAPL'}))
//       socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'BINANCE:BTCUSDT'}))
//       socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'IC MARKETS:1'}))
//     });
//
// // Listen for messages
//     socket.addEventListener('message', function (event) {
//       console.log('Message from server ', event.data);
//     });

// Unsubscribe
//     var unsubscribe = function(symbol: any) {
//       socket.send(JSON.stringify({'type':'unsubscribe','symbol': symbol}))
//     }
  }

  // Send a message to the server
  public sendMessage(message: any) {
    this.socket$.next(message);
  }

  // Receive messages from the server
  getMessages(): Observable<any> {
    return this.socket$.asObservable();
  }

  // Close the WebSocket connection
  closeConnection() {
    this.socket$.complete();
  }

}
