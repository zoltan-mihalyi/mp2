///<reference path="relevance-set.ts"/>
///<reference path="..\state\server-state.ts"/>
interface RelevanceSetFactory{
    new (state:ServerState):RelevanceSet;
}