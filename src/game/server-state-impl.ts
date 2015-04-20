///<reference path="entity.ts"/>
///<reference path="server-state.ts"/>
///<reference path="..\id-map.ts"/>
///<reference path="..\relevance\relevance-set.ts"/>

import EntityImpl=require('./entity-impl');
import IdMapImpl=require('../id-map-impl');
import ReadableServerStateImpl=require('./readable-server-state-impl');

class ServerStateImpl extends ReadableServerStateImpl implements ServerGameState {
    public id:number = Math.random(); //TODO
    private nextId:number = 0;
    private entityRelevanceSets:IdMap<Entity,RelevanceSet[]> = new IdMapImpl<Entity,RelevanceSet[]>();

    createEntity():Entity {
        var entity = new EntityImpl({
            id: ++this.nextId,
            attrs: {},
            links: {}
        }, this.entities);
        this.addEntity(entity);
        return entity; //TODO
    }

    addEntity(entity:Entity):void {
        this.entities.put(entity);
        this.onAdd(entity);
    }

    removeEntity(entity:Entity):void {
        this.entities.remove(entity);
        this.onRemove(entity);
        if (this.entityRelevanceSets.contains(entity)) {
            var relevanceSets = this.entityRelevanceSets.get(entity);
            var n = relevanceSets.length;
            while (n > 0) {
                relevanceSets[0].removeEntity(entity);
                n--;
            }
        }
    }

    entityAddedToRelevanceSet(entity:Entity, relevanceSet:RelevanceSet):void {
        var entityRelevanceSets = this.entityRelevanceSets;
        if (entityRelevanceSets.contains(entity)) {
            entityRelevanceSets.get(entity).push(relevanceSet);
        } else {
            entityRelevanceSets.put(entity, [relevanceSet]);
        }
    }

    entityRemovedFromRelevanceSet(entity:Entity, relevanceSet:RelevanceSet):void {
        var entityRelevanceSets = this.entityRelevanceSets;
        if (!entityRelevanceSets.contains(entity)) {
            return;
        }
        var relevanceSets = entityRelevanceSets.get(entity);
        if (relevanceSets.length === 1) { //last
            entityRelevanceSets.remove(entity);
        } else {
            relevanceSets.splice(relevanceSets.indexOf(relevanceSet), 1);
        }
    }
}

export = ServerStateImpl;