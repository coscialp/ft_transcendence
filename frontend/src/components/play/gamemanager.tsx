import { UnityContext } from "react-unity-webgl";
import { io, Socket } from "socket.io-client";



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
    private _SpeedSecurity: number;
    private _Score1: number;
    private _Score2: number;
    private _BallSpeedSecurity: number;
    constructor() {
        this._P1ready = false;
        this._P2ready = false;
        this._ID = "";
        this._Socket = io();
        this._GameID = 0;
        this._GameState = false;
        this._Ballpos = '';
        this._Warning = false;
        this._Spectator = false;
        this._Ranked = false;
        this._SpeedSecurity = 0;
        this._BallSpeedSecurity = 0;
        this._Score1 = 0;
        this._Score2 = 0;
        this._GameMod = 0;
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
        this._Socket.on(`getGameID/${username}`, (gameID: number) => {
            this._GameID = gameID;
            setReload(true);
        });
    }
    receive_player_position() {
        this._Socket.on(`SetPosition/${this._GameID}`, (Position: number, Player: string) => {
            if (this._ID !== Player) {
                if (this._ID === "Player1")
                    this._UnityContext.send("RemotePaddle", "SetPosition", Position);
                else
                    this._UnityContext.send("LocalPaddle", "SetPosition", Position);
            }
        })
    }
    receive_ball_position() {
        this._Socket.on(`SetBallPos/${this._GameID}`, (posx: number, posy: number) => {
            this._Ballpos = `${posx} ${posy}`;
            if (this._ID === "Player2") {
                this._UnityContext.send("Ball", 'setPos', this._Ballpos);
            }
        })
    }
    receive_ready_up() {
        this._Socket.on(`ReadyUp/${this._GameID}`, (playerID: string) => {
            if (playerID === 'Player1')
                this._P1ready = true;
            else if (playerID === 'Player2')
                this._P2ready = true;
        })
    }
    receive_particle() {
        this._Socket.on(`StartParticle/${this._GameID}`, () => {
            this._UnityContext.send("ParticleEffectBait", "StartParticlebait");
        })
    }
    receive_point() {
        this._Socket.on(`AddPoint/${this._GameID}`, (Player: string) => {
            if (this._ID === "Player2") {
                if (Player === "player1") {
                    this._Score1++;
                    this._UnityContext.send("HUD", "AddScore", "RightWall");
                } else {
                    this._Score2++;
                    this._UnityContext.send("HUD", "AddScore", "LeftWall");
                }
            }
        })
    }
    receive_endGame() {
        this._Socket.on(`finishGame/${this._GameID}`, (loser: string) => {
            this._GameState = true;
            this._Warning = true;
            if (loser === 'Player1') {
                this.Socket.emit(`finishGame`, { gameId: this._GameID, player: this._ID, score1: 0, score2: 10, date: this._GameDate });
            }
            else if (loser === 'Player2') {
                this.Socket.emit(`finishGame`, { gameId: this._GameID, player: this._ID, score1: 10, score2: 0, date: this._GameDate });
            }
        })
    }

    send_ready_up() {
        this._UnityContext.on("setReady", () => {
            this._Socket.emit('ReadyUp', { player: this._ID, gameId: this._GameID });
        });
    }
    send_ball_position() {
        this._UnityContext.on("SetBallPos", (posx: number, posy: number) => {
            if (this._ID === "Player1") {
                this._BallSpeedSecurity += 1;
                if (this._BallSpeedSecurity === 4) {
                    this._BallSpeedSecurity = 0;
                    this._Socket.emit('SetBallPos', { posx: posx, posy: posy, id: this._GameID });
                    this._Socket.emit('SetBallPosSpectate', { posx: posx, posy: posy, id: this._GameID });
                }
            }
        });
    }
    send_player_position() {
        this._UnityContext.on("SendPosition", (Position: number) => {
            this._SpeedSecurity += 1;
            if (this._SpeedSecurity === 4) {
                this._SpeedSecurity = 0;
                this._Socket.emit('SetPosition', { pos: Position, id: this._ID, gameId: this._GameID })
                this._Socket.emit('SetPosSpectate', { pos: Position, id: this._ID, gameId: this._GameID });
            }
        });
    }
    send_point() {
        this._UnityContext.on("GameResult", (PointToAdd: string, score1: number, score2: number) => {
            if (this._ID === "Player1") {
                if (score1 === 15 && score2 !== 10) {
                    this._Socket.emit('AddPoint', { gameId: this._GameID, point: "player1" });
                    this._Score1++;
                }
                else if (score1 !== 10 && score2 !== 10) {
                    this._Socket.emit('AddPoint', { gameId: this._GameID, point: 'player2' });
                    this._Score2++;
                }
            }
            if (score1 === 10 || score2 === 10) {
                this._UnityContext.send("LocalPaddle", "setGameStarted", 0);
                this._UnityContext.send("RemotePaddle", "setGameStarted", 0);
                this._Socket.emit('finishGame', { gameId: this._GameID, player: this._ID, score1: this._Score1, score2: this._Score2, date: this._GameDate })
                this._GameState = true;
            }
        });
    }
    send_gameid() {
        this._Socket.emit("getGameID", '');
    }

    ready_checker() {
        if (this._P1ready === true && this._P2ready === true) {
            if (this._GameMod === 0) {
                this._GameMod = 2;
            }
            if (this._ID === "Player2") {
                this._UnityContext.send("RemotePaddle", "setID", this._ID);
                this._UnityContext.send("HUD", "setID", this._ID);
            }
            else if (this._ID === "Player1") {
                this._UnityContext.send("LocalPaddle", "setID", this._ID);
                this._UnityContext.send("HUD", "setID", this._ID);
            }
            this._UnityContext.send("HUD", "gameInit");
            this._UnityContext.send("Ball", "setID", this._ID);
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
    receive_pos_specate() {
        this._Socket.on(`SetPosSpectate/${this._GameID}`, (Position: number, Player: string) => {
            if (Player === "Player2")
                this._UnityContext.send("RemotePaddle", "SetPosition", Position);
            else
                this._UnityContext.send("LocalPaddle", "SetPosition", Position);
        })
    }
    receive_ball_pos_spectate() {
        this._Socket.on(`SetBallPosSpectate/${this._GameID}`, (posx: number, posy: number) => {
            this._Ballpos = `${posx} ${posy}`;
            this._UnityContext.send("Ball", 'setPos', this._Ballpos);
        })
    }
}