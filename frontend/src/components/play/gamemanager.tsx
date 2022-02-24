import { UnityContext } from "react-unity-webgl";
import { io, Socket } from "socket.io-client";
import { gameSocket } from "../../App";

export class GameManager {
    private _P1ready: boolean;
    private _P2ready: boolean;
    private _GameMod: number;
    private _ID: string;
    private _Socket: Socket;
    private _GameID: number;
    private _UnityContext: UnityContext;
    private _GameState: boolean;
    private _Ballpos: string;
    private _Warning: boolean;
    private _Spectator: boolean;
    private _GameDate: string;
    private _Ranked: boolean;
    private _Score1: number;
    private _Score2: number;
    private _UpdatePos: boolean;
    private _SocketId: string;
    private _BallPos: {
        posx: number,
        posy: number
    };
    constructor() {
        this._P1ready = false;
        this._P2ready = false;
        this._SocketId = '';
        this._ID = "";
        this._Socket = io();
        this._GameID = 0;
        this._GameState = false;
        this._Ballpos = '';
        this._Warning = false;
        this._Spectator = false;
        this._Ranked = false;
        this._UpdatePos = false;
        this._Score1 = 0;
        this._Score2 = 0;
        this._GameMod = 0;
        this._BallPos = {
            posx: 0,
            posy: 0
        }
        this._GameDate = new Date().toLocaleDateString();
        this._UnityContext = new UnityContext({
            loaderUrl: "./Build/webgl.loader.js",
            dataUrl: "./Build/webgl.data",
            frameworkUrl: "./Build/webgl.framework.js",
            codeUrl: "./Build/webgl.wasm",
        });
    }

    public get UnityContext() {
        return this._UnityContext;
    }
    public get P1ready() {
        return this._P1ready;
    }
    public get P2ready() {
        return this._P2ready;
    }
    public get ID() {
        return this._ID;
    }
    public get Socket() {
        return this._Socket;
    }
    public get GameID() {
        return this._GameID;
    }
    public get GameState() {
        return this._GameState;
    }
    public get Warning() {
        return this._Warning;
    }
    public get Spectator() {
        return this._Spectator;
    }
    public get Ranked() {
        return this._Ranked;
    }
    public get Score1() {
        return this._Score1;
    }
    public get Score2() {
        return this._Score2;
    }
    public get Date() {
        return this._GameDate;
    }
    public get GameMod() {
        return this._GameMod;
    }

    public set GameMod(value: number) {
        this._GameMod = value;
    }
    public set Ranked(value: boolean) {
        this._Ranked = value;
    }
    public set Spectator(value: boolean) {
        this._Spectator = value;
    }

    public set Warning(value: boolean) {
        this.Warning = value;
    }
    public set UnityContext(value: any) {
        this._GameID = value;
    }
    public set GameID(value: number) {
        this._GameID = value;
    }
    public set Socket(value: Socket) {
        this._Socket = value;
    }
    public set P1ready(value: boolean) {
        this._P1ready = value;
    }
    public set P2ready(value: boolean) {
        this._P2ready = value;
    }
    public set ID(value: string) {
        this._ID = value;
    }

    receive_gameID(username: string, setReload: any) {
        gameSocket.on(`getGameID/${username}`, (gameID: number, socketId: string) => {
            this._GameID = gameID;
            this._SocketId = socketId;
            gameSocket.emit('JoinRoom', {gameID: gameID});
            setReload(true);
            gameSocket.emit('joinroom', {gameID: this._GameID});
        });
    }
    receive_ready_up() {
        gameSocket.on(`ReadyUp/${this._GameID}`, (playerID: string) => {
            if (playerID === 'Player1')
                this._P1ready = true;
            else if (playerID === 'Player2')
                this._P2ready = true;
        })
    }
    receive_particle() {
        gameSocket.on(`StartParticle/${this._GameID}`, () => {
            this._UnityContext.send("HUD", "spawn_blackhole");
        })
    }

    receive_endGame() {
        gameSocket.on(`finishGame/${this._GameID}`, (loser: string) => {
            this._GameState = true;
            this._Warning = true;
            if (loser === 'Player1') {
                gameSocket.emit(`finishGame`, { gameId: this._GameID, player: this._ID, score1: 0, score2: 10, date: this._GameDate });
            }
            else if (loser === 'Player2') {
                gameSocket.emit(`finishGame`, { gameId: this._GameID, player: this._ID, score1: 10, score2: 0, date: this._GameDate });
            }
        })
    }

    send_ready_up() {
        this._UnityContext.on("setReady", () => {
            gameSocket.emit('ReadyUp', { player: this._ID, gameId: this._GameID });
        });
    }
    send_ball_position() {
        this._UnityContext.on("SetBallPos", (posx: number, posy: number) => {
            if (this._ID === "Player1") {
                this._UpdatePos = true;
                this._BallPos = {
                    posx: posx,
                    posy: posy
                };
            }
        });
    }

    receive_game_info() {
        gameSocket.on(`UpdatePosition`, (Position: number, Player: string, posx: number, posy: number, score1: number, score2: number) => {
            if (this._ID !== Player) {
                if (this._ID === "Player1") {
                    this._UnityContext.send("RemotePaddle", "SetPosition", Position);
                }
                else if ("Player2" && this._Spectator === false) {
                    this._UnityContext.send("LocalPaddle", "SetPosition", Position);
                    this._Ballpos = `${posx} ${posy}`;
                    this._UnityContext.send("Ball", 'setPos', this._Ballpos);
                    this._Score1 = score1;
                    this._Score2 = score2;
                }
                else {
                    this._Ballpos = `${posx} ${posy}`;
                    if (Player === "Player1") {
                        this._UnityContext.send("Ball", 'setPos', this._Ballpos);
                    }
                    this._Score1 = score1;
                    this._Score2 = score2;
                    if (Player === "Player2") {
                        this._UnityContext.send("RemotePaddle", "SetPosition", Position);
                    }
                    else if (Player === "Player1"){
                        this._UnityContext.send("LocalPaddle", "SetPosition", Position);
                    }
                }
            }
        })
    }

    send_player_position() {
        this._UnityContext.on("SendPosition", (Position: number) => {
            if (this._UpdatePos || this._ID === 'Player2') {
                this._UpdatePos = false;
                gameSocket.emit('UpdatePosition', { pos: Position, id: this._ID, gameID: this._GameID, posx: this._BallPos.posx, posy: this._BallPos.posy, soId: this._SocketId, score1: this.Score1, score2: this.Score2 });
            }
        });
    }
    send_point() {
        this._UnityContext.on("GameResult", (PointToAdd: string, score1: number, score2: number) => {
            if (this._ID === "Player1") {
                if (score1 === 15 && score2 !== 10) {
                    gameSocket.emit('AddPoint', { gameId: this._GameID, point: "player1" });
                    this._Score1 += 1;
                }
                else if (score1 !== 10 && score2 !== 10) {
                    gameSocket.emit('AddPoint', { gameId: this._GameID, point: 'player2' });
                    this._Score2 += 1;
                }
            }
            if (score1 === 10 || score2 === 10) {
                this._UnityContext.send("LocalPaddle", "setGameStarted", 0);
                this._UnityContext.send("RemotePaddle", "setGameStarted", 0);
                gameSocket.emit('finishGame', { gameId: this._GameID, player: this._ID, score1: this._Score1, score2: this._Score2, date: this._GameDate })
                this._GameState = true;
            }
        });
    }
    send_gameid() {
        gameSocket.emit("getGameID", '');
    }

    ready_checker() {
        if (this._P1ready === true && this._P2ready === true) {
            if (this._GameMod === 1) {
                this._GameMod = 2;
            }
            if (this._ID === "Player2") {
                this._UnityContext.send("RemotePaddle", "setID", this._ID);
                this._UnityContext.send("Ball", "setID", this._ID);
                this._UnityContext.send("HUD", "setID", this._ID);
            }
            else if (this._ID === "Player1") {
                this._UnityContext.send("LocalPaddle", "setID", this._ID);
                this._UnityContext.send("Ball", "setID", this._ID);
                this._UnityContext.send("HUD", "setID", this._ID);
            }
            this._UnityContext.send("HUD", "gameInit");
            this._UnityContext.send("LocalPaddle", "setGameStarted", 1);
            this._UnityContext.send("RemotePaddle", "setGameStarted", 1);
            this._P1ready = false;
            this._P2ready = false;
        }
        else if (this._Spectator === true) {
            this._UnityContext.send("LocalPaddle", "setID", "Player2");
            this._UnityContext.send("HUD", "setID", "Player2");
            this._UnityContext.send("HUD", "gameInit");
            this._UnityContext.send("Ball", "setID", "Player2");
            this._UnityContext.send("LocalPaddle", "setGameStarted", 0);
            this._UnityContext.send("RemotePaddle", "setGameStarted", 0);
            this._P1ready = false;
            this._P2ready = false;
        }
    }
}