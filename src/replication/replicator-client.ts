interface ReplicatorClient<T>{
    onUpdate(message:T);
}