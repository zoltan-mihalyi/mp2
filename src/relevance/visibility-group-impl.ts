///<reference path="../game/user-game.ts"/>
///<reference path="visibility-group.ts"/>
///<reference path="relevance-set.ts"/>
///<reference path="..\game\server-user-game.ts"/>
import EntityImpl=require('../game/entity-impl');
import IdSetImpl=require('../id-set-impl');

class VisibilityGroupImpl implements VisibilityGroup {
    private relevanceSet:RelevanceSet;
    private visible:IdSet<Entity> = new IdSetImpl<Entity>();

    constructor(relevanceSet) {
        this.relevanceSet = relevanceSet;
    }

    public add(entity:Entity):void {
        var relevanceSet = this.relevanceSet;
        if (!relevanceSet.entities.contains(entity)) {
            relevanceSet.toHide.remove(entity);
            relevanceSet.toShow.put(entity);
            relevanceSet.entities.put(entity);
            relevanceSet.visibleNum.set(entity, 0);
            relevanceSet.getState().entityAddedToRelevanceSet(entity, relevanceSet);
        }

        if (!this.visible.contains(entity)) {
            this.visible.put(entity);
            relevanceSet.visibleNum.increment(entity);
        }
    }

    public remove(entity:Entity):void {
        if (!this.visible.contains(entity)) {
            return;
        }
        this.visible.remove(entity);

        var relevanceSet = this.relevanceSet;
        var num = relevanceSet.visibleNum.decrement(entity);
        if (num === 0) {
            relevanceSet.toHide.put(entity);
            relevanceSet.toShow.remove(entity);
            relevanceSet.entities.remove(entity);
            relevanceSet.visibleNum.remove(entity);
            relevanceSet.getState().entityRemovedFromRelevanceSet(entity, relevanceSet);
        }
    }

    public removeEntities(filter:(e:Entity)=>boolean):void {
        this.visible.forEach((entity)=> {
            if (filter.call(entity, entity)) {
                this.remove(entity);
            }
        });
    }
}

export = VisibilityGroupImpl;