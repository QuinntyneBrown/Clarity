// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Messaging.Internals;

public class Observable<T> : IObservable<T>
{

    public Observable() { }

    private IList<Subscription> _subscriptions = new List<Subscription>();

    private readonly object _lock = new object();

    public IDisposable Subscribe(IObserver<T> observer)
    {
        return AddSubscription(observer);
    }

    public void Unsubscribe(IObserver<T> observer)
    {
        RemoveSubscription(observer);
    }

    public void Broadcast(T item)
    {
        var subscriptions = _subscriptions;
        for (int i = 0; i < subscriptions.Count; i++)
        {
            subscriptions[i].Observer.OnNext(item);
        }
    }

    protected void BroadcastError(Exception error)
    {
        var subscriptions = _subscriptions;
        for (int i = 0; i < subscriptions.Count; i++)
        {
            subscriptions[i].Observer.OnError(error);
        }
    }

    protected void BroadcastOnCompleted()
    {
        var subscriptions = _subscriptions;
        for (int i = 0; i < subscriptions.Count; i++)
        {
            subscriptions[i].Observer.OnCompleted();
        }
    }

    private Subscription AddSubscription(IObserver<T> observer)
    {
        lock (_lock)
        {
            var newList = new List<Subscription>(_subscriptions);
            var subscr = new Subscription() { Observable = this, Observer = observer };
            newList.Add(subscr);
            Interlocked.Exchange(ref _subscriptions, newList);
            return subscr;
        }
    }

    private void RemoveSubscription(IObserver<T> observer)
    {
        lock (_lock)
        {
            var newList = new List<Subscription>(_subscriptions);
            var subscr = newList.FirstOrDefault(s => s.Observer == observer);
            if (subscr != null)
            {
                newList.Remove(subscr);
                Interlocked.Exchange(ref _subscriptions, newList);
            }
        }
    }

    internal class Subscription : IDisposable
    {
        public required Observable<T> Observable;
        public required IObserver<T> Observer;

        public void Dispose()
        {
            Observable.Unsubscribe(Observer);
        }
    }

}

