import { v4 as uuidv4 } from 'uuid'

export const generatePublisher= <T> (subscriber: Map<string, T>) => {
    return {
        sub: (eventHandler: T) => {
            const key = uuidv4()
            subscriber.set(key, eventHandler);
            return key;
        },
        unsub: (key: string) => {
            subscriber.delete(key)
          },
    }
}


