import type { AnyActorRef } from 'xstate';

/** Helpers for XState machine actors: await terminal output from snapshot `output`, or `context` when needed. */
export const actorHelpers = {
  /** Subscribes until the actor reaches `done`, then resolves with output or context. */
  awaitOutput<TOutput>(actor: AnyActorRef): Promise<TOutput> {
    return new Promise<TOutput>((resolve, reject) => {
      const currentSnapshot = actor.getSnapshot();
      if (currentSnapshot.status === 'done') {
        const currentResolved = ((currentSnapshot as { context?: unknown; output?: unknown })
          .output ??
          (currentSnapshot as { context?: unknown; output?: unknown }).context) as TOutput;
        resolve(currentResolved);
        return;
      }
      const subscription = actor.subscribe({
        error: (error) => {
          subscription.unsubscribe();
          reject(error);
        },
        next: (snapshot) => {
          if (snapshot.status !== 'done') return;
          subscription.unsubscribe();
          const resolved = ((snapshot as { context?: unknown; output?: unknown }).output ??
            (snapshot as { context?: unknown; output?: unknown }).context) as TOutput;
          resolve(resolved);
        },
      });
    });
  },
};
