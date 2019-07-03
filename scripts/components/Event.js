function Event() {
    this.listeners = [];
}

Event.prototype.add = function(listener) {
    this.listeners.push(listener);
}

Event.prototype.manage = function(args = {}) {
    for (var i = 0; i < this.listeners.length; i++) {
        return this.listeners[i](args);
    }
}