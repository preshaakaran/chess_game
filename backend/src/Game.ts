// interface Game {
//     id: number;
//     name: string;
//     player1: WebSocket;
//     player2: WebSocket;
// }

import { Chess } from "chess.js";
import WebSocket from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game{
    public player1: WebSocket;
    public player2: WebSocket;
    public board: Chess;

    private startTime: Date;
    private moveCount = 0;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color:"white"
            }
        }))
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color:"black"
            }
        }))
    }

    makeMove(socket: WebSocket, move: { from: string; to: string; }) {
        // Check if it's the correct player's turn
        if (this.moveCount % 2 === 0 && socket !== this.player1) {
            console.log('Player 1 turn, but player 2 tried to move.');
            return;
        }
        if (this.moveCount % 2 === 1 && socket !== this.player2) {
            console.log('Player 2 turn, but player 1 tried to move.');
            return;
        }
    
        // Attempt to make the move
        try {
            this.board.move(move);
        } catch (e) {
            console.log('Invalid move:', e);
            return;
        }
    
        // Log the move count
        console.log('Move count:', this.moveCount);
        console.log('Move count % 2:', this.moveCount % 2);
    
        if (this.board.isGameOver()) {
            const winner = this.board.turn() === "w" ? "black" : "white";
            this.player1.send(JSON.stringify({ type: GAME_OVER, payload: { winner } }));
            this.player2.send(JSON.stringify({ type: GAME_OVER, payload: { winner } }));
            return;
        }
    
        // Send move to the correct player
        if (this.moveCount % 2 === 0) {
            this.player2.send(JSON.stringify({ type: MOVE, payload: move }));
        } else {
            this.player1.send(JSON.stringify({ type: MOVE, payload: move }));
        }
    
        this.moveCount++;
    }
}