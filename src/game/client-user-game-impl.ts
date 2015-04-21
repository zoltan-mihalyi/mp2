///<reference path="../replication/replicator-client.ts"/>
///<reference path="client-user-game.ts"/>
///<reference path="..\messaging\writeable.ts"/>
///<reference path="..\messaging\command-event.ts"/>
///<reference path="..\predicted-command.ts"/>
///<reference path="..\id-map.ts"/>
import StateImpl = require('../game/state-impl');
import IdSetImpl = require('../id-set-impl');
import IdMapImpl = require('../id-map-impl');
import EntityImpl = require('../game/entity-impl');

interface BooleanMap {
    [index:string]:boolean;
}

interface PredictionInfo {
    attrs:BooleanMap;
    correction:(entity:Entity, key:string, value:any)=>void;
}

class ClientUserGameImpl extends StateImpl implements ClientUserGame, ClientState {
    private entities:IdSet<Entity> = new IdSetImpl<Entity>();
    private info:any;
    private replicator:ReplicatorClient<any>;
    private out:Writeable<Message<CommandEvent>>;
    private id:number;
    private callbacks:{[index:number]:Function} = {};
    private nextCallbackId = 0;
    private predictedCommands:{[index:string]:PredictedCommand} = {};
    private predictedEntities:IdMap<EntityData,PredictionInfo> = new IdMapImpl<EntityData,PredictionInfo>();

    constructor(id:number, info:any, out:Writeable<Message<CommandEvent>>) {
        super();
        this.id = id;
        this.info = info;
        this.out = out;
    }

    public getState():ClientState {
        return this;
    }

    public getInfo() {
        return this.info;
    }

    public execute(...params:any[]):void {
        var callbacks:number[] = [];
        for (var i = 0; i < params.length; i++) {
            var param = params[i];
            if (typeof  param === 'function') {
                params[i] = this.addCallback(param);
                callbacks.push(i);
            }
        }

        var commandEvent:CommandEvent = {
            eventType: 'COMMAND',
            gameId: this.id,
            params: params,
            callbacks: callbacks
        };

        this.out.write({
            reliable: true,
            keepOrder: true,
            data: commandEvent
        });
        var predictedCommand = this.predictedCommands[params[0]];
        if (predictedCommand) {
            predictedCommand.simulate.apply(null, params.slice(1));
        }
    }

    private addCallback(fn:Function):number {
        var id = ++this.nextCallbackId;
        this.callbacks[id] = fn;
        return id;
    }

    public setPredicted(predictedCommand:PredictedCommand) {
        this.predictedCommands[predictedCommand.command] = predictedCommand;
        for (var i = 0; i < predictedCommand.entities.length; i++) {
            var entityInfo = predictedCommand.entities[i];
            var attrsMap:BooleanMap = {};
            for (var j = 0; j < entityInfo.attrs.length; j++) {
                attrsMap[entityInfo.attrs[j]] = true;
            }
            this.predictedEntities.put(entityInfo.entity.toObject(), {
                attrs: attrsMap,
                correction: predictedCommand.correction
            });
        }
    }

    public getReplicator():ReplicatorClient<any> {
        return this.replicator;
    }

    public setReplicator(replicator:ReplicatorClient<any>):void {
        this.replicator = replicator;
        replicator.setState(this);
    }

    contains(data:EntityData):boolean {
        return this.entities.contains(data);
    }

    createBatch():ClientStateBatch {
        var toRemove:Entity[]=[];
        var toMerge:EntityData[]=[];
        var mergeResult:Entity[]=[];
        return {
            merge:(e:EntityData)=>{
                toMerge.push(e);
            },
            remove:(e:Entity):void=>{
                toRemove.push(e);
            },
            apply:()=>{
                for(var i=0;i<toRemove.length;i++){
                    this.entities.remove(toRemove[i]);
                }
                for(var i=0;i<toRemove.length;i++){
                    this.onRemove(toRemove[i]);
                }
                for(var i=0;i<toMerge.length;i++){
                    mergeResult.push(this.merge(toMerge[i]));
                }
                for(var i=0;i<mergeResult.length;i++){
                    if(mergeResult[i]!==null){
                        this.onAdd(mergeResult[i]);
                    }
                }
            }
        };
    }

    private merge(data:EntityData):Entity {
        if (this.contains(data)) {
            var predicted = this.predictedEntities.contains(data);
            if (predicted) {
                var predictionInfo = this.predictedEntities.get(data);
            }
            var entity = this.entities.get(data);
            for (var i in data.attrs) {
                if (data.attrs.hasOwnProperty(i)) {
                    if (predicted && predictionInfo.attrs[i]) {
                        predictionInfo.correction(entity, i, data.attrs[i]);
                    } else {
                        entity.set(i, data.attrs[i]);
                    }
                }
            }
            for (var i in data.links) {
                if (data.links.hasOwnProperty(i)) {
                    entity.attachId(i, data.links[i]);
                }
            }
            return null;
        } else {
            var newEntity = new EntityImpl(data, this.entities);
            this.entities.put(newEntity);
            return newEntity
        }
    }

    forEach(callback:(e:Entity)=>void):void {
        this.entities.forEach(callback);
    }

    runCallback(id:number, params:any[]):void {
        this.callbacks[id].apply(null, params)
    }
}

export = ClientUserGameImpl;