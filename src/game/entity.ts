/// <reference path="../id-provider.ts" />

interface Entity extends IDProvider {
    set(name, value);
    get(name);
}