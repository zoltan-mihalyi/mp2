///<reference path="relevance-set.ts"/>
///<reference path="../state/server-replication-state.ts"/>
interface RelevanceSetFactory{
    new (state:ServerReplicationState):RelevanceSet;
}