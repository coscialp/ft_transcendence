import { io, Socket } from "socket.io-client";
import { ip } from "../../App";

export class GameManager
{
    private _P1ready: boolean;
    private _P2ready: boolean;
    private _ID: string;
    private _Socket: Socket;
    private _GameID: number;
    constructor() {
        this._P1ready = false;
        this._P2ready = false;
        this._ID = "";
        this._Socket = io(`ws://${ip}:5002`, { transports: ['websocket'] });
        this._GameID = 0;
    }
    
    public get P1ready()
    {
        return this._P1ready;
    }
    public get P2ready()
    {
        return this._P2ready;
    }
    public get ID()
    {
        return this._ID;
    }
    public get Socket()
    {
        return this._Socket;
    }
    public get GameID()
    {
        return this._GameID;
    }


    public set GameID(value: number)
    {
        this._GameID = value;
    }

    public set Socket(value: Socket)
    {
        this._Socket = value;
    }
    public set P1ready(value: boolean)
    {
        this._P1ready = value;
    }
    public set P2ready(value: boolean)
    {
        this._P2ready = value;
    }
    public set ID(value: string)
    {
        this._ID = value; 
    }
}