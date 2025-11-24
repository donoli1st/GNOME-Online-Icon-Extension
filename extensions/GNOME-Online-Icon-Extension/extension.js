'use strict';

const { St, Gio, GLib } = imports.gi;
const Main = imports.ui.main;

let button;
let timeoutId;
let monitor;

function _updateIcon() {
    const online = monitor.get_network_available();

    if (online) {
        button.get_child().set_text('🌐');
        button.set_tooltip_text('Online');
    } else {
        button.get_child().set_text('⛔');
        button.set_tooltip_text('Offline');
    }

    return true;
}

function enable() {
    monitor = Gio.NetworkMonitor.get_default();

    const label = new St.Label({ text: '…' });
    button = new St.Bin({
        child: label,
        style_class: 'panel-button'
    });

    Main.panel._rightBox.insert_child_at_index(button, 0);

    timeoutId = GLib.timeout_add_seconds(
        GLib.PRIORITY_DEFAULT,
        30,
        _updateIcon
    );

    _updateIcon();
}

function disable() {
    if (timeoutId) {
        GLib.source_remove(timeoutId);
        timeoutId = null;
    }

    if (button) {
        Main.panel._rightBox.remove_child(button);
        button = null;
    }

    monitor = null;
}
