///<reference path="../game/user-game.ts"/>
///<reference path="visibility-group.ts"/>
///<reference path="relevance-set.ts"/>
///<reference path="..\game\server-user-game.ts"/>
import EntityImpl=require('../game/entity-impl');
import IdSetImpl=require('../id-set-impl');

class VisibilityGroupImpl implements VisibilityGroup{
    private relevanceSet:RelevanceSet;
    private visible:IdSet<Entity> = new IdSetImpl<Entity>();
    constructor(relevanceSet) {
        this.relevanceSet = relevanceSet;
    }

    public add(entity) {
        var relevanceSet = this.relevanceSet;
        if (!relevanceSet.visible.contains(entity)) {
            relevanceSet.toHide.remove(entity);
            relevanceSet.toShow.put(entity);
            relevanceSet.visible.put(entity);
            relevanceSet.visibleNum.set(entity,0);
            //entity.visibleFor[relevanceSet.id] = relevanceSet;
        }

        if (!this.visible.contains(entity)) {
            this.visible.put(entity);
            relevanceSet.visibleNum.increment(entity);
        }
    }

    public remove(entity) {
        var filter;
        if (typeof entity === 'function') {
            filter = entity;
            this.visible.forEach(function(entity){
                if (filter.call(entity, entity)) {
                    this.remove(entity);
                }
            });
            return;
        }

        if(!this.visible.contains(entity)){
            return;
        }
        this.visible.remove(entity);

        var num=this.relevanceSet.visibleNum.decrement(entity);
        if (num === 0) {
            this.relevanceSet.toHide.put(entity);
            this.relevanceSet.toShow.remove(entity);
            this.relevanceSet.visible.remove(entity);
            this.relevanceSet.visibleNum.remove(entity);
            //delete entity.visibleFor[this.relevanceSet.id];
        }

    }
}

export = VisibilityGroupImpl;